import { computed, defineComponent } from 'vue';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';

export default defineComponent({
  setup() {
    const projectStore = useProjectsStore();

    const stats = computed(() => projectStore.statistics);

    return {
      stats
    }
  },
});
