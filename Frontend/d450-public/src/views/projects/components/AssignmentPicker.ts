import { computed, defineComponent, ref, watch } from 'vue';
import { useEmployeeStore } from '@/stores/employees/EmployeesStore';
import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { useAssignmentsStore } from '@/stores/assignments/AssignmentStore';
import { useTextStore } from '@/stores/texts/TextStore';
import { dialogRefState } from '@/common/RefState';

interface AssignmentEdit {
  employeeId: string | null;
  profileId: string | null;
}

interface IdName {
  id: string;
  name: string;
}

export default defineComponent({
  setup(_, { expose }) {
    const employeeStore = useEmployeeStore();
    const profileStore = useProfileStore();
    const assignmentsStore = useAssignmentsStore();
    const textStore = useTextStore();

    const errors = ref(<string[]>[]);

    // employees
    const employeesPageSize = 10;
    const employees = computed(() => employeeStore.employeesPage.entities.map(e => <IdName>{ id: e.id, name: [e.surname, e.name, e.middleName].join(' ') }));

    const employeeSearch = ref('');
    watch(employeeSearch, (val) => {
      if (!assignmentForm.value.employeeId) employeeStore.loadPagedEmployees(val, 0, employeesPageSize);
    });

    // profiles
    const profilesPageSize = 10;
    const profiles = computed(() => {
      const cms = profileStore.profilesPage.entities;
      if (assignmentForm.value.profileId && !cms.some((cm) => cm.id === assignmentForm.value.profileId)) {
        const addCm = profileStore.cachedProfiles.get(assignmentForm.value.profileId);
        cms.unshift({ id: addCm.value?.id ?? '', name: addCm.value?.name ?? '', competenceIds: addCm.value?.competenceIds ?? [] });
      }
      return cms;
    });
    const profilesSearch = ref('');
    watch(profilesSearch, (val) => {
      profileStore.loadPagedProfiles(val, 0, profilesPageSize);
    });

    // create/ edit assignment
    const selectedAssignmentId = ref('');
    const assignmentDialog = dialogRefState(false, () => {
      erorrsReset();
    });
    const assignmentForm = ref(<AssignmentEdit>{ employeeId: null, profileId: null });

    const addAssignment = () => {
      selectedAssignmentId.value = '';
      assignmentForm.value = { employeeId: null, profileId: null };
      // TODO: employee store not yet reworked - so 0 is base page
      employeeStore.loadPagedEmployees('', 0, employeesPageSize);
      profileStore.loadPagedProfiles('', 1, profilesPageSize);
      assignmentDialog.value = true;
    };

    const editAssignment = (assignmentId: string) => {
      const assignment = assignmentsStore.assignmentsPage.entities.find((a) => a.id === assignmentId);
      if (!assignment) return;

      erorrsReset();
      selectedAssignmentId.value = assignmentId;
      assignmentForm.value = { employeeId: assignment.employeeId, profileId: assignment.profileId };
      profileStore.loadPagedProfiles('', 1, profilesPageSize);
      assignmentDialog.value = true;
    };

    const saveAssignmnet = async () => {
      let operationErrors: string[] = [];

      if (!assignmentForm.value.profileId || !assignmentForm.value.employeeId) return;
      if (selectedAssignmentId.value === '') {
        operationErrors = await assignmentsStore.createAssignment({
          employeeId: assignmentForm.value.employeeId,
          profileId: assignmentForm.value.profileId,
        });
      } else {
        operationErrors = await assignmentsStore.updateAssignment(selectedAssignmentId.value, {
          employeeId: assignmentForm.value.employeeId,
          profileId: assignmentForm.value.profileId,
        });
      }

      if (operationErrors.length > 0) {
        erorrsReset();
        errors.value = operationErrors.map((error) => textStore.getErrorText(error));
        return;
      }
      assignmentDialog.value = false;
      setAssignmentPage(assignmentsStore.assignmentsPage.page);
    };

    const removeAssignment = async (assignmentId: string) => {
      await assignmentsStore.removeAssignment(assignmentId);
      setAssignmentPage(assignmentsStore.assignmentsPage.page);
    };

    const setAssignmentPage = (page: number) => assignmentsStore.loadPagedProjectAssignments(page, assignmentsStore.assignmentsPage.pageSize);

    const erorrsReset = () => errors.value = [];

    expose({
      addAssignment,
      editAssignment,
      removeAssignment,
    });

    return {
      errors,

      employees,
      employeeSearch,
      employeesPageSize,

      profiles,
      profilesSearch,
      profilesPageSize,

      selectedAssignmentId,
      assignmentForm,
      assignmentDialog,
      addAssignment,
      editAssignment,
      removeAssignment,
      saveAssignmnet,
    };
  },
});
