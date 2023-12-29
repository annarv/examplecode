import router from '@/routers';
import { useCompetenceStore } from '@/stores/competences/CompetencesStore';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { computed, defineComponent, ref } from 'vue';

interface CompetenceForm {
  name: string;
  description: string;
  indicators: IndicatorForm[];
}

interface IndicatorForm {
  id: string;
  name: string;
}

export default defineComponent({
  setup() {
    const competenceStore = useCompetenceStore();
    const { selectedCompetence } = storeToRefs(competenceStore);

    const editCompetence = ref(<CompetenceForm>{
      name: '',
      description: '',
      indicators: [],
    });

    watch(
      selectedCompetence,
      (c) => {
        editCompetence.value = {
          name: c.name,
          description: c.description,
          indicators: c.indicators.map((i) => ({ id: i.id, name: i.name })),
        };
      },
      { immediate: true },
    );

    const isNew = computed(() => !selectedCompetence.value.id);
    const isSaveEnabled = computed(
      () =>
        editCompetence.value.name &&
        editCompetence.value.indicators.length > 0 &&
        editCompetence.value.indicators.every((i) => i.name),
    );

    const createIndicator = () => {
      editCompetence.value.indicators.push({
        id: '',
        name: '',
      });
    };

    const removeIndicator = (idx: number) => {
      editCompetence.value.indicators.splice(idx, 1);
    };

    const save = async () => {
      await competenceStore.saveCompetence(
        editCompetence.value.name,
        editCompetence.value.description,
        editCompetence.value.indicators,
      );
      router.push({ name: 'route-competences-list' });
    };

    return {
      editCompetence,
      isSaveEnabled,
      isNew,

      createIndicator,
      removeIndicator,
      save,
    };
  },
});
