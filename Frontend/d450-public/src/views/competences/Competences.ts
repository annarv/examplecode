import { useCompetenceStore } from '@/stores/competences/CompetencesStore';
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue';
import { vue3Debounce } from 'vue-debounce';

export default defineComponent({
  directives: {
    debounce: vue3Debounce({
      lock: true,
      fireOnEmpty: true,
      listenTo: 'input',
    }),
  },
  setup() {
    const pageSize = 10;
    const searchText = ref('');
    const competenceStore = useCompetenceStore();

    const { competencesPage } = storeToRefs(competenceStore);

    const setPage = (page: number) => competenceStore.loadPagedCompetences(searchText.value, page, pageSize);

    const onSearchInputEvent = () => setPage(1);

    competenceStore.selectCompetence('');
    setPage(competencesPage.value.page);

    return {
      searchText,
      competencesPage,

      setPage,
      onSearchInputEvent,
    };
  },
});
