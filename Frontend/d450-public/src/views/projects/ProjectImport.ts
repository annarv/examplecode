import { ref, computed, defineComponent } from 'vue';
import router from '@/routers';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import { useImportAssignmentsStore } from '@/stores/assignments/ImportAssignmentsStore';
import { AssignmentImportAction, AssignmentImportState } from '@/common/ImportEnums';
import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { AssignmentImportedInfo, ImportSummary } from '@/network/assignment/Models';

export default defineComponent({
  setup() {
    const pageSize = 10;
    const assignmentsStore = useImportAssignmentsStore();
    const projectStore = useProjectsStore();
    const profileStore = useProfileStore();
    const selectedProject = ref();
    const assignmentsFile = ref<File[]>();
    const isLoading = ref(false);
    const importedFileId = ref();
    const selectedProfileId = ref();
    const showSaveModal = ref(false);
    const showCancelModal = ref(false);
    const summary = ref<ImportSummary>();
    const allDataLoaded = ref(false);

    const statesToText = (states: string[]) => {
      let message = '';
      if (states.includes(AssignmentImportState[AssignmentImportState.RespondentNotFound]))
        message += 'Респондент не найден. ';
      if (states.includes(AssignmentImportState[AssignmentImportState.EmployeeNotFound]))
        message += 'Оцениваемый не найден. ';
      if (states.includes(AssignmentImportState[AssignmentImportState.RoleNotFound])) message += 'Роль не найдена. ';
      if (states.includes(AssignmentImportState[AssignmentImportState.AlreadyExists]))
        message += 'Такое назначение уже существует. ';
      return message;
    };

    const actionToText = (action: string) => {
      switch (action) {
        case AssignmentImportAction[AssignmentImportAction.NoAction]:
          return 'Без действий';
        case AssignmentImportAction[AssignmentImportAction.Update]:
          return 'Обновление роли';
        case AssignmentImportAction[AssignmentImportAction.Create]:
          return 'Создание назначения';
      }
      return '';
    };

    const firstLoad = async () => {
      // if (!projectStore.selectedProjectId) {
      //   await projectStore.selectProject(route.params.id as string);
      // }
      selectedProject.value = projectStore.selectedProject;
      checkFileAndLoad();
    };

    const onFileChanged = async () => {
      isLoading.value = true;
      assignmentsFile.value &&
        (await assignmentsStore.uploadAssignmentsFile(selectedProject.value?.id!, assignmentsFile.value[0]));
      isLoading.value = false;
      checkFileAndLoad();
    };

    const checkFileAndLoad = async () => {
      const timeoutId = setTimeout(() => (isLoading.value = true), 300);
      if (!importedFileId.value)
        importedFileId.value = await assignmentsStore.getImportFileId(selectedProject.value?.id!);
      if (importedFileId.value) {
        await loadAssignmnets();
        await profileStore.loadPagedProfiles('', 0, 10);
        selectedProfileId.value = assignmentsStore.assignmentsPage.entities[0].profileId || undefined;
      }
      clearTimeout(timeoutId);
      isLoading.value = false;
      allDataLoaded.value = true;
    };

    const loadAssignmnets = async (page: number = 0, useLoading: boolean = false) => {
      let timeoutId: any;
      if (useLoading) timeoutId = setTimeout(() => (isLoading.value = true), 300);
      await assignmentsStore.loadPagedAssignments(selectedProject.value?.id!, page, pageSize);
      await getSummary();
      if (useLoading) {
        clearTimeout(timeoutId);
        isLoading.value = false;
      }
    };

    const changeProfile = (profileId: string) => {
      assignmentsStore.updateProfileId(selectedProject.value?.id!, profileId);
    };

    const acceptAction = async (asmnt: AssignmentImportedInfo) => {
      asmnt.action = asmnt.possibleActionsAdapter.some((action) => action.value === asmnt.selectedActionAdapter)
        ? AssignmentImportAction[asmnt.selectedActionAdapter]
        : asmnt.action;
      asmnt.hasConflict = false;
      await assignmentsStore.changeImportAssignment(selectedProject.value?.id!, asmnt);
      await loadAssignmnets(page.value - 1 ?? 0, true);
      await getSummary();
    };

    const beforeSave = async () => {
      const timeoutId = setTimeout(() => (isLoading.value = true), 300);
      await getSummary();
      clearTimeout(timeoutId);
      isLoading.value = false;
      showSaveModal.value = true;
    };

    const getSummary = async () => {
      const result = await assignmentsStore.getImportSummary(selectedProject.value?.id!);
      if (result) summary.value = result;
    };

    const save = async () => {
      showSaveModal.value = false;
      isLoading.value = true;
      const result = await assignmentsStore.processImport(selectedProject.value?.id!, importedFileId.value);
      isLoading.value = false;
      if (result) await router.push({ name: 'route-project-details', params: { id: selectedProject.value?.id! } });
      else await loadAssignmnets();
    };

    const cancelImport = async () => {
      showCancelModal.value = false;
      const timeoutId = setTimeout(() => (isLoading.value = true), 300);
      const result = await assignmentsStore.cancelImport(selectedProject.value?.id!, importedFileId.value);
      clearTimeout(timeoutId);
      isLoading.value = false;
      if (result) await router.push({ name: 'route-project-details', params: { id: selectedProject.value?.id! } });
    };

    const page = computed({
      get() {
        return assignmentsStore.assignmentsPage.page + 1;
      },
      async set(page: number) {
        await loadAssignmnets(page - 1, true);
      },
    });

    const totalPage = computed(() =>
      Math.ceil(assignmentsStore.assignmentsPage.total / assignmentsStore.assignmentsPage.pageSize),
    );

    const isVisiblePaging = computed(() => assignmentsStore.assignmentsPage.total > pageSize);

    const assignments = computed(() =>
      assignmentsStore.assignmentsPage.entities.map((asmnt) => {
        !asmnt.possibleActions.includes(AssignmentImportAction[AssignmentImportAction.NoAction]) &&
          asmnt.possibleActions.push(AssignmentImportAction[AssignmentImportAction.NoAction]);
        asmnt.possibleActionsAdapter = asmnt.possibleActions.map((action: any) => ({
          title: actionToText(action),
          value: +AssignmentImportAction[action],
        }));
        asmnt.selectedActionAdapter = +AssignmentImportAction[asmnt.action as unknown as AssignmentImportAction];

        asmnt.hasWarning = [
          AssignmentImportState[AssignmentImportState.RoleNotFound],
          AssignmentImportState[AssignmentImportState.EmployeeNotFound],
          AssignmentImportState[AssignmentImportState.RespondentNotFound],
          AssignmentImportState[AssignmentImportState.AlreadyExists],
        ].some((state) => asmnt.state.includes(state));

        return asmnt;
      }),
    );

    const profiles = computed(() =>
      profileStore.profilesPage.entities.map((cm) => {
        return {
          title: cm.name,
          value: cm.id,
        };
      }),
    );

    firstLoad();

    return {
      assignmentsFile,
      isLoading,
      importedFileId,
      page,
      totalPage,
      isVisiblePaging,
      assignments,
      profiles,
      selectedProfileId,
      showSaveModal,
      showCancelModal,
      summary,
      allDataLoaded,

      onFileChanged,
      statesToText,
      changeProfile,
      acceptAction,
      beforeSave,
      save,
      cancelImport,
    };
  },
});
