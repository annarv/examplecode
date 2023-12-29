import { Ref, computed, defineComponent, ref } from 'vue';
import { vue3Debounce } from 'vue-debounce';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import { useScaleStore } from '@/stores/ScaleStore';
import { TransformPage } from '@/common/Page';
import { ProjectBrief } from '@/network/project/Models';

interface ProjectView {
  statusName: string;
  statusClass: string;
  statusVariant: any;
}

interface ProjectViewItem {
  project: ProjectBrief;
  view: ProjectView;
}

interface ProjectForm {
  name: string;
  description: string;
  scaleId: string;
}

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

    const projectStore = useProjectsStore();
    const scalesStore = useScaleStore();

    const projectForm = ref(<ProjectForm>{ name: '', description: '' });

    const projectsPage = computed(() =>
      TransformPage(
        projectStore.projectsPage,
        false,
        (p) =>
          <ProjectViewItem>{
            project: p,
            view: {
              statusClass: p.closedState !== 'notactivated' ? '_blue' : p.publicState !== 'notactivated' ? '_green' : '',
              statusName: p.closedState !== 'notactivated' ? 'Завершен' : p.publicState !== 'notactivated' ? 'Запущен' : 'Черновик',
              statusVariant: p.closedState === 'pending' || p.publicState === 'pending' ? 'outlined' : 'text',
            },
          },
      ),
    );

    const scales = computed(() => scalesStore.allScales);

    const setPage = (page: number) => projectStore.loadPagedProjects(searchText.value, page, pageSize);

    const closeAndClearCreationProjectDialog = (isActive: Ref<boolean>) => {
      isActive.value = false;
      projectForm.value.name = '';
      projectForm.value.description = '';
      projectForm.value.scaleId = '';
    };

    const onSearchInputEvent = () => setPage(1);

    const createProject = async (isActive: Ref<boolean>) => {
      isActive.value = false;
      if (!projectForm.value.name || !projectForm.value.scaleId) return;

      await projectStore.createProjectWithScale(projectForm.value.name, projectForm.value.description, projectForm.value.scaleId);
      setPage(projectStore.projectsPage.page);
    };

    scalesStore.loadScales();
    setPage(projectStore.projectsPage.page);
    return {
      projectForm,
      searchText,

      projectsPage,
      scales,

      setPage,

      closeAndClearCreationProjectDialog,
      onSearchInputEvent,
      createProject,
    };
  },
});
