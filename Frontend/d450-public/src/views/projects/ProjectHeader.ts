import { Ref, computed, defineComponent, ref } from 'vue';
import { useScaleStore } from '@/stores/ScaleStore';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import { useRecordStore } from '@/stores/records/RecordStore';
import UpwayMenu from './components/UpwayMenu.vue';
import { storeToRefs } from 'pinia';
import Statistics from './components/Statistics.vue';
// import { useAssessmentStore } from '@/stores/assessments/AssessmentStore';
// import { useAssignmentsStore } from '@/stores/assignments/AssignmentStore';

interface ProjectView {
  name: string;
  description: string;
  scaleName: string;
  competencesCount: number;
  canChangeProject: boolean;
  canCloseProject: boolean;
}

interface ProjectEdit {
  name: string;
  description: string;
  scaleId: string;
}

export default defineComponent({
  components: { UpwayMenu, Statistics },
  setup() {
    const projectStore = useProjectsStore();
    const scaleStore = useScaleStore();
    const recordStore = useRecordStore();
    // const assessmentStore = useAssessmentStore();
    // const assignmentsStore = useAssignmentsStore();

    // const hasRecords = computed(() => recordStore.employeeRecordsPage.total > 0);
    // const hasAssessments = computed(() => assessmentStore.assessmentsPage.total > 0);
    // const hasAssignments = computed(() => assignmentsStore.assignmentsPage.total > 0);

    const projectView = computed(() => {
      const selectedProject = projectStore.selectedProject;
      const projectScale = scaleStore.cachedScales.get(selectedProject.scaleId);
      // const scopeRecord = recordStore.selectedScope;
      return <ProjectView>{
        name: selectedProject.name,
        description: selectedProject.description,
        scaleName: projectScale.value?.name,
        competencesCount: selectedProject.calculation.competenceCalculations.length,
        canChangeProject: selectedProject.publicState === 'notactivated' && selectedProject.closedState === 'notactivated',
        canCloseProject: selectedProject.publicState === 'activated' && selectedProject.closedState === 'notactivated',
      };
    });

    //#region draft
    const projectEdit = ref<ProjectEdit>({ name: '', description: '', scaleId: '' });
    const { allScales } = storeToRefs(scaleStore);

    const onProjectChanging = (dialog: boolean) => {
      if (!dialog) return;
      const selectedProject = projectStore.selectedProject;
      projectEdit.value = {
        description: selectedProject.description,
        name: selectedProject.name,
        scaleId: selectedProject.scaleId,
      };
    };

    const updateProject = async (isActive: Ref<boolean>) => {
      isActive.value = false;
      await projectStore.updateProject(projectEdit.value.name, projectEdit.value.description, projectEdit.value.scaleId);
      projectStore.loadSelectedProject();
    };

    const startProject = async () => {
      await projectStore.startProject();
      projectStore.loadSelectedProject();
    };

    scaleStore.loadScales();
    //#endregion draft

    //#region public
    const finishProject = async () => {
      await projectStore.finishProject();
      projectStore.loadSelectedProject();
    };
    //#endregion public

    // recordStore.loadScopeByProject();

    return {
      projectView,
      projectEdit,
      allScales,
      // hasRecords,
      // hasAssessments,
      // hasAssignments,

      onProjectChanging,
      updateProject,
      startProject,
      finishProject,
    };
  },
});
