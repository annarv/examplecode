import { Ref, computed, defineComponent, ref } from 'vue';

import { useEmployeeStore } from '@/stores/employees/EmployeesStore';
import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { useAssignmentsStore } from '@/stores/assignments/AssignmentStore';
import { useRoleStore } from '@/stores/RoleStore';
import { TransformPage } from '@/common/Page';

import AssignmentPicker from './AssignmentPicker.vue';
import RespondentPicker from './RespondentPicker.vue';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';

interface AssignmentView {
  id: string;
  name: string;
  email: string;
  profileModel: string;
  respondents: RespondentView[];
  isDraft(): boolean;
}
interface RespondentView {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  isDraft: boolean;
}

export default defineComponent({
  props: {
    draftMode: {
      default: true,
      type: Boolean,
    },
  },
  components: {
    AssignmentPicker,
    RespondentPicker,
  },
  setup() {
    const employeeStore = useEmployeeStore();
    const assignmentsStore = useAssignmentsStore();
    const rolesStore = useRoleStore();
    const profileStore = useProfileStore();

    // assignment list
    const assignmentsPageSize = 10;
    const assignmentPage = computed(() => {
      const res = TransformPage(assignmentsStore.assignmentsPage, false, (a) => {
        const cm = profileStore.cachedProfiles.get(a.profileId);
        const e = employeeStore.cachedEmployees.get(a.employeeId);
        return <AssignmentView>{
          id: a.id,
          profileModel: cm.value?.name ?? '',
          name: [e.value?.surname, e.value?.name, e.value?.middleName].join(' '),
          email: e.value?.email ?? '',
          isDraft() {
            return this.respondents.length === 0 || this.respondents.every((rspl) => rspl.isDraft);
          },
          respondents: a.respondents.map((rsp) => {
            const r = rolesStore.allRoles.find((r) => r.id === rsp.roleId);
            const e = employeeStore.cachedEmployees.get(rsp.employeeId);
            return <RespondentView>{
              employeeId: rsp.employeeId,
              name: [e.value?.surname, e.value?.name, e.value?.middleName].join(' '),
              email: e.value?.email ?? '',
              role: r?.name ?? '',
              isDraft: rsp.publicState === 'notactivated',
            };
          }),
        };
      });
      return res;
    });
    const setAssignmentPage = (page: number) => assignmentsStore.loadPagedProjectAssignments(page, assignmentsPageSize);

    // create/edit assignment
    const assignmentPicker = ref();
    const addAssignment = () => assignmentPicker.value.addAssignment();
    const editAssignment = (assignmentId: string) => assignmentPicker.value.editAssignment(assignmentId);
    const removeAssignment = (isActive: Ref<boolean>, assignmentId: string) => {
      isActive.value = false;
      assignmentPicker.value.removeAssignment(assignmentId);
    };

    // create/edit respondent
    const respondentPicker = ref();
    const addRespondent = (assignmentId: string) => respondentPicker.value.addRespondent(assignmentId);
    const editRespondent = (assignmentId: string, respondentId: string) => respondentPicker.value.editRespondent(assignmentId, respondentId);
    const removeRespondent = async (isActive: Ref<boolean>, assignmentId: string, respondentId: string) => {
      isActive.value = false;
      respondentPicker.value.removeRespondent(assignmentId, respondentId);
    };

    // starting assignments/respondents
    const startingAssignments = ref(<{ id: string }[]>[]);
    const startAssignment = async (assignmentId: string) => {
      if (!startingAssignments.value.find((i) => i.id === assignmentId)) startingAssignments.value.push({ id: assignmentId });
      const assignment = assignmentsStore.assignmentsPage.entities.find((a) => a.id === assignmentId);
      if (!assignment) return;

      for (const respondent of assignment.respondents) {
        if (respondent.publicState !== 'notactivated') return;
        await assignmentsStore.startRespondent(assignmentId, respondent.employeeId);
      }

      setTimeout(() => {
        startingAssignments.value = startingAssignments.value.filter((i) => i.id !== assignmentId);
        setAssignmentPage(assignmentPage.value.page);
      }, 3000);
    };

    const startRespondent = async (assignmentId: string, respondentId: string) => {
      if (!startingAssignments.value.find((i) => i.id === assignmentId)) startingAssignments.value.push({ id: assignmentId });
      const assignment = assignmentPage.value.entities.find((a) => a.id === assignmentId);
      if (!assignment) return;
      const respondent = assignment.respondents.find((r) => r.employeeId === respondentId);
      if (!respondent || !respondent.isDraft) return;

      await assignmentsStore.startRespondent(assignment.id, respondent.employeeId);

      setTimeout(() => {
        startingAssignments.value = startingAssignments.value.filter((i) => i.id !== assignmentId);
        setAssignmentPage(assignmentPage.value.page);
      }, 3000);
    };

    // run
    rolesStore.loadRoles();
    setAssignmentPage(1);

    return {
      assignmentPicker,
      respondentPicker,

      assignmentPage,
      setAssignmentPage,

      addAssignment,
      editAssignment,
      removeAssignment,

      addRespondent,
      editRespondent,
      removeRespondent,

      startingAssignments,
      startAssignment,
      startRespondent,

      projectId: useProjectsStore().selectedProjectId,
    };
  },
});
