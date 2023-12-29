import { computed, defineComponent, watch } from 'vue';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import ProjectBody from './ProjectBody.vue';
import { useRecordStore } from '@/stores/records/RecordStore';
import { useAssessmentStore } from '@/stores/assessments/AssessmentStore';
import { useAssignmentsStore } from '@/stores/assignments/AssignmentStore';
import ProjectHeader from './ProjectHeader.vue';
import ProjectLoader from './components/ProjectLoader.vue';

export default defineComponent({
  components: {
    ProjectLoader,
    ProjectHeader,
    ProjectBody,
  },
  setup() {
    const projectStore = useProjectsStore();

    const projectState = computed(() => {
      const sp = projectStore.selectedProject;
      return <'draft' | 'wait' | 'public' | 'closed'>(
        (sp.closedState === 'activated'
          ? 'closed'
          : sp.closedState === 'pending' || sp.publicState === 'pending'
          ? 'wait'
          : sp.publicState === 'activated'
          ? 'public'
          : 'draft')
      );
    });

    return { projectState };
  },
});
