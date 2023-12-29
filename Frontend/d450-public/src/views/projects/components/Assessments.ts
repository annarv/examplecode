import { TransformPage } from '@/common/Page';
import { useRoleStore } from '@/stores/RoleStore';
import { useAssessmentStore } from '@/stores/assessments/AssessmentStore';
import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { useEmployeeStore } from '@/stores/employees/EmployeesStore';
import { EmployeeInfo } from '@/stores/employees/models/EmployeeInfo';
import { Ref, computed, defineComponent, ref, watch } from 'vue';

interface AssessmentView {
  id: string;
  assessedName: string;
  assessedEmail: string;
  respondentName: string;
  respondentEmail: string;
  role: string;
  profile: string;
  statusText: string;
  statusClass: string;
}

export default defineComponent({
  setup() {
    const assessmentStore = useAssessmentStore();
    const employeeStore = useEmployeeStore();
    const profileStore = useProfileStore();
    const rolesStore = useRoleStore();

    const assessmentPageSize = 10;

    const getName = (employee: Ref<EmployeeInfo | null>) =>
      [employee.value?.surname, employee.value?.name, employee.value?.middleName].join(' ');

    const assessmentPage = computed(() =>
      TransformPage(assessmentStore.assessmentsPage, false, (a) => {
        const aEmp = employeeStore.cachedEmployees.get(a.assessedEmployeeId);
        const rEmp = employeeStore.cachedEmployees.get(a.respondentEmployeeId);
        return <AssessmentView>{
          id: a.id,
          assessedName: getName(aEmp),
          assessedEmail: aEmp.value?.email,
          respondentName: getName(rEmp),
          respondentEmail: rEmp.value?.email,
          profile: profileStore.cachedProfiles.get(a.profileId).value?.name,
          role: rolesStore.allRoles.find((r) => r.id === a.roleId)?.name,
          statusClass: a.values.length > 0 ? 'text-green' : 'text-red',
          statusText: a.values.length > 0 ? 'Прошел' : 'Не начал',
        };
      }),
    );
    const setAssessmentPage = (page: number) => assessmentStore.loadPagedProjectAssessments(page, assessmentPageSize);

    watch(
      () => assessmentPage.value.total,
      () => {
        setTimeout(() => {
          setAssessmentPage(assessmentPage.value.page);
        }, 5000);
      },
    );

    rolesStore.loadRoles();
    setAssessmentPage(1);

    return { assessmentPage, setAssessmentPage };
  },
});
