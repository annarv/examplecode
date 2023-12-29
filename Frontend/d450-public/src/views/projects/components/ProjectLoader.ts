import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import { useScaleStore } from '@/stores/ScaleStore';

interface ProjectView {
  name: string;
  description: string;
  scaleName: string;
}

export default defineComponent({
  setup() {
    const projectStore = useProjectsStore();
    const scaleStore = useScaleStore();
    const polling = ref<NodeJS.Timeout>();

    const projectView = computed(() => {
      const selectedProject = projectStore.selectedProject;
      const projectScale = scaleStore.cachedScales.get(selectedProject.scaleId);
      return <ProjectView>{
        name: selectedProject.name,
        description: selectedProject.description,
        scaleName: projectScale.value?.name,
      };
    });

    onMounted(() => {
      polling.value = setInterval(async () => {
        await projectStore.loadSelectedProject();
      }, 5000);
    });

    onBeforeUnmount(() => {
      clearInterval(polling.value);
    });

    return { projectView };
  },
});
