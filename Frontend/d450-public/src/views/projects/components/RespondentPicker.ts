import { Ref, computed, defineComponent, ref, watch } from 'vue';
import { useEmployeeStore } from '@/stores/employees/EmployeesStore';
import { useAssignmentsStore } from '@/stores/assignments/AssignmentStore';
import { useRoleStore } from '@/stores/RoleStore';
import { RoleKind } from '@/network/role/Models';
import { storeToRefs } from 'pinia';

interface RespondentEdit {
  employeeId: string | null;
  roleId: string | null;
}
interface IdName {
  id: string;
  name: string;
}

export default defineComponent({
  setup(_, { expose }) {
    const employeeStore = useEmployeeStore();
    const assignmentsStore = useAssignmentsStore();
    const rolesStore = useRoleStore();

    //roles
    const { allRoles } = storeToRefs(rolesStore);
    const filteredRoles = computed(() => {
      let list = rolesStore.allRoles;
      if (respondentForm.value.roleId) {
        const role = list.find((role) => role.id === respondentForm.value.roleId);
        list = list.filter((r) => (role!.kind == RoleKind.Self ? r.kind == RoleKind.Self : r.kind != RoleKind.Self));
      }
      return list;
    });

    // employees
    const employeesPageSize = 10;
    const employees = computed(() => {
      let list = employeeStore.employeesPage.entities.map(
        (e) => <IdName>{ id: e.id, name: [e.surname, e.name, e.middleName].join(' ') },
      );

      if (selectedAssignmentId.value && respondentForm.value.roleId) {
        const assignment = assignmentsStore.assignmentsPage.entities.find((a) => a.id === selectedAssignmentId.value);
        const role = allRoles.value.find((role) => role.id === respondentForm.value.roleId);
        list = list.filter((e) =>
          role!.kind === RoleKind.Self ? e.id === assignment!.employeeId : e.id != assignment?.employeeId,
        );
        if (
          (role?.kind === RoleKind.Self && respondentForm.value.employeeId !== assignment?.employeeId) ||
          (role?.kind !== RoleKind.Self && respondentForm.value.employeeId === assignment?.employeeId)
        ) {
          respondentForm.value.employeeId = '';
        }
      }
      return list;
    });
    const employeeSearch = ref('');
    watch(employeeSearch, (val) => {
      if (!respondentForm.value.employeeId) employeeStore.loadPagedEmployees(val, 0, employeesPageSize);
    });

    // create/ edit respondent or role
    const selectedAssignmentId = ref('');
    const selectedRespondentId = ref('');
    const respondentDialog = ref(false);
    const respondentForm = ref(<RespondentEdit>{ employeeId: null, roleId: null });

    const changeAssignmentRole = (newRoleId: string) => {
      const role = allRoles.value.find((role) => role.id === newRoleId);
      const assignment = assignmentsStore.assignmentsPage.entities.find((a) => a.id === selectedAssignmentId.value);
      if (role!.kind === RoleKind.Self && assignment) {
        const empl = employeeStore.cachedEmployees.get(assignment.employeeId);
        empl.value &&
          employeeStore.loadPagedEmployees([empl.value.surname, empl.value.name].join(' '), 0, employeesPageSize);
      } else {
        employeeStore.loadPagedEmployees('', 0, employeesPageSize);
      }
    };

    const addRespondent = (assignmentId: string) => {
      const assignment = assignmentsStore.assignmentsPage.entities.find((a) => a.id === assignmentId);
      if (!assignment) return;

      selectedAssignmentId.value = assignmentId;
      selectedRespondentId.value = '';
      respondentForm.value = { employeeId: null, roleId: null };
      // TODO: employee srore not yet reworked - so 0 is base page
      employeeStore.loadPagedEmployees('', 0, employeesPageSize);
      respondentDialog.value = true;
    };

    const editRespondent = (assignmentId: string, respondentId: string) => {
      const assignment = assignmentsStore.assignmentsPage.entities.find((a) => a.id === assignmentId);
      if (!assignment) return;
      const respondent = assignment.respondents.find((r) => r.employeeId === respondentId);
      if (!respondent) return;

      selectedAssignmentId.value = assignmentId;
      selectedRespondentId.value = respondentId;
      respondentForm.value = { employeeId: respondent.employeeId, roleId: respondent.roleId };
      respondentDialog.value = true;
    };

    const saveRespondent = async () => {
      respondentDialog.value = false;
      if (!respondentForm.value.employeeId || !respondentForm.value.roleId || !selectedAssignmentId.value) return;
      if (selectedRespondentId.value === '') {
        await assignmentsStore.addRespondent(selectedAssignmentId.value, {
          employeeId: respondentForm.value.employeeId,
          roleId: respondentForm.value.roleId,
        });
      } else {
        await assignmentsStore.changeRespondentRole(selectedAssignmentId.value, {
          employeeId: respondentForm.value.employeeId,
          roleId: respondentForm.value.roleId,
        });
      }
      setAssignmentPage(assignmentsStore.assignmentsPage.page);
    };

    const removeRespondent = async (assignmentId: string, respondentId: string) => {
      await assignmentsStore.removeRespondent(assignmentId, respondentId);
      setAssignmentPage(assignmentsStore.assignmentsPage.page);
    };

    const setAssignmentPage = (page: number) => assignmentsStore.loadPagedProjectAssignments(page, assignmentsStore.assignmentsPage.pageSize);

    expose({
      addRespondent,
      editRespondent,
      removeRespondent,
    });

    return {
      allRoles,
      filteredRoles,
      employees,
      employeeSearch,
      employeesPageSize,
      selectedRespondentId,
      respondentForm,
      respondentDialog,
      changeAssignmentRole,
      addRespondent,
      editRespondent,
      removeRespondent,
      saveRespondent,
    };
  },
});
