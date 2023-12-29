import { computed, defineComponent, ref, watch } from 'vue';
import Assignments from './components/Assignments.vue';
import Assessments from './components/Assessments.vue';
import Records from './components/Records.vue';
import { useAssessmentStore } from '@/stores/assessments/AssessmentStore';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';

export default defineComponent({
  components: {
    Records,
    Assessments,
    Assignments,
  },
  setup() {
    const recordsTabName = 'records';
    const assessmentsTabName = 'assessments';
    const assignmentsTabName = 'assignments';

    const projectStore = useProjectsStore();
    const assessmentStore = useAssessmentStore();

    const showRecordsTab = computed(() => projectStore.statistics.assessmentsClosedCount > 0 );
    const showAssessmentsTab = computed(() => projectStore.statistics.assessmentsCount > 0);

    const draftMode = useProjectsStore().selectedProject.publicState === 'notactivated';

    const activeTab = ref();
    watch(activeTab, (val) => {
      if (val === assessmentsTabName)
        assessmentStore.loadPagedProjectAssessments(assessmentStore.assessmentsPage.page, assessmentStore.assessmentsPage.pageSize);
    });

    watch(
      [showRecordsTab, showAssessmentsTab],
      () => {
        activeTab.value = showRecordsTab.value
          ? recordsTabName
          : showAssessmentsTab.value
          ? assessmentsTabName
          : assignmentsTabName;
      },
      {
        immediate: true,
      },
    );

    return {
      recordsTabName,
      assessmentsTabName,
      assignmentsTabName,
      showRecordsTab,
      showAssessmentsTab,
      activeTab,
      draftMode,
    };
  },
});
