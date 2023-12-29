import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { useCompetenceStore } from '@/stores/competences/CompetencesStore';
import { CompetenceInfo } from '@/stores/competences/models/CompetenceInfo';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, ref, watch } from 'vue';
import router from '@/routers';
import { ProfileInfo } from '@/stores/profiles/models/ProfileInfo';

interface Competence {
  info: CompetenceInfo;
  toAdd: boolean;
}

export default defineComponent({
  setup() {
    const profileStore = useProfileStore();
    const competenceStore = useCompetenceStore();
    const { selectedProfile } = storeToRefs(profileStore);
    const { selectedProfileCompetences, competencesPage } = storeToRefs(competenceStore);
    const competenciesToChange = ref<Competence[]>([]);

    const saveProfile = async () => {
      const saveResult = await profileStore.saveProfile(selectedProfile.value.name);
      let selectedProfileId = selectedProfile.value!.id!;

      if (!Array.isArray(saveResult)) {
        selectedProfileId = (saveResult as ProfileInfo).id;
        profileStore.selectProfile(selectedProfileId);
      }

      for (const competence of competenciesToChange.value) {
        if (competence.toAdd) await profileStore.addCompetence(competence.info.id);
        else await profileStore.removeCompetence(competence.info.id);
      }

      await router.push({ name: 'route-profiles-list' });
    };

    const cancel = async () => await router.push({ name: 'route-profiles-list' });

    //#region profile validation
    const isValidProfile = ref(false);
    const profileNameValidation = ref([
      (value: string) => !!value || 'Обязательное поле',
      (value: string) => (value && value.length >= 3) || 'Минимум 3 символа',
    ]);
    const originalProfileName = ref();
    const originalProfileCompetencies = ref();

    watch(
      () => selectedProfile.value.name,
      () =>
        (isValidProfile.value =
          selectedProfile.value.name?.length >= 3 && selectedProfileCompetences.value?.length > 0),
    );
    watch(
      selectedProfileCompetences,
      () =>
        (isValidProfile.value =
          selectedProfile.value.name?.length >= 3 && selectedProfileCompetences.value?.length > 0),
      { deep: true },
    );

    setTimeout(() => {
      originalProfileName.value = selectedProfile.value.name;
      originalProfileCompetencies.value = [...selectedProfileCompetences.value];
    }, 100);

    const isSaveActive = computed(() => {
      const nameChanged = originalProfileName.value && selectedProfile.value.name != originalProfileName.value;
      const competeciesChanged =
        originalProfileCompetencies.value &&
        (originalProfileCompetencies.value.some(
          (c: { id: string }) => !selectedProfileCompetences.value.find((sc) => sc.id === c.id),
        ) ||
          selectedProfileCompetences.value.some(
            (c) => !originalProfileCompetencies.value.find((sc: { id: string }) => sc.id === c.id),
          ));
      return nameChanged || competeciesChanged;
    });
    //#endregion

    //#region add competecies in profile
    const addCompsPageSize = 10;

    const addDialogOpen = (dialog: boolean) => {
      if (!dialog) return;
      competenceStore.loadPagedCompetences('', 1, addCompsPageSize);
    };

    const containedInProfileCompetences = (competence: CompetenceInfo) =>
      selectedProfileCompetences.value.some((c) => c.id === competence.id);

    const toggleCompetenceInProfile = (competence: CompetenceInfo) => {
      const cmpt = competenciesToChange.value?.find((c) => c.info.id === competence.id);
      if (cmpt) cmpt.toAdd = !cmpt.toAdd;
      else
        competenciesToChange.value.push({
          info: competence,
          toAdd: !containedInProfileCompetences(competence),
        });
    };

    const onSetPage = async (page: number) => await competenceStore.loadPagedCompetences('', page, addCompsPageSize);

    const applyCompetencies = () => {
      competenciesToChange.value.forEach((newCompetence) => {
        let competence = containedInProfileCompetences(newCompetence.info);
        if (!competence && newCompetence.toAdd) selectedProfileCompetences.value.push(newCompetence.info);
        if (competence && !newCompetence.toAdd) removeCompetenceInProfile(newCompetence.info);
      });
    };

    const removeCompetenceInProfile = (competence: CompetenceInfo) => {
      const cIdx = selectedProfileCompetences.value?.findIndex((c) => c.id === competence.id);
      selectedProfileCompetences.value.splice(cIdx, 1);
      const cmpt = competenciesToChange.value.find((c) => c.info.id === competence.id);
      if (cmpt) cmpt.toAdd = false;
      else competenciesToChange.value.push({ info: competence, toAdd: false });
    };
    //#endregion

    competenceStore.loadSelectedProfileCompetences();

    return {
      selectedProfile,
      competencesPage,
      selectedProfileCompetences,
      profileNameValidation,
      isValidProfile,
      isSaveActive,

      addDialogOpen,
      onSetPage,

      containedInProfileCompetences,
      toggleCompetenceInProfile,
      removeCompetenceInProfile,
      saveProfile,
      cancel,
      applyCompetencies,
    };
  },
});
