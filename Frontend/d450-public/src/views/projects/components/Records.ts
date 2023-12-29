import { Ref, computed, defineComponent, watch } from 'vue';
import { TransformPage } from '@/common/Page';
import { useReportApi } from '@/network/report/ReportApi';
import { useCompanyStore } from '@/stores/CompanyStore';
import { useEmployeeStore } from '@/stores/employees/EmployeesStore';
import { EmployeeInfo } from '@/stores/employees/models/EmployeeInfo';
import { useRecordStore } from '@/stores/records/RecordStore';
import { DownloadBlobFile } from '@/common/BlobHelper';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';

interface EmployeeRecordView {
  id: string;
  employeeName: string;
  employeeEmail: string;
  valueInfo: string;
  hasPersonalReport: boolean;
  hasPersonalReportRequested: boolean;
  hasPersonalReportFailed: boolean;
}

export default defineComponent({
  setup() {
    const recordStore = useRecordStore();
    const employeeStore = useEmployeeStore();
    const projectStore = useProjectsStore();

    const employeeRecordPageSize = 10;

    const getName = (employee: Ref<EmployeeInfo | null>) => [employee.value?.surname, employee.value?.name, employee.value?.middleName].join(' ');

    const getAverage = (nums: (number | null)[]) => {
      const sum = nums.reduce((acc, val) => {
        if (val !== null) return (acc ?? 0) + val;
        return acc;
      }, null);
      const length = nums.filter((n) => n !== null).length;
      return length ? ((sum ?? 0) / length).toFixed(2) : null;
    };

    const employeeRecordPage = computed(() =>
      TransformPage(recordStore.employeeRecordsPage, false, (r) => {
        const emp = employeeStore.cachedEmployees.get(r.employeeId);
        const selfValue = getAverage(r.competenceCalculations.map((c) => c.selfValue));
        const othersValue = getAverage(r.competenceCalculations.map((c) => c.otherValue));
        // const currentScope = r.scopeRecords.find((s) => s.scopeRecordId === recordStore.selectedScopeId);

        return <EmployeeRecordView>{
          id: r.id,
          employeeName: getName(emp),
          employeeEmail: emp.value?.email,
          valueInfo: [selfValue, othersValue].join(' | '),
          hasPersonalReport: r.hasPersonalReport,
          hasPersonalReportRequested: r.hasPersonalReportRequested,
          hasPersonalReportFailed: r.hasFailedLastReportRequest,
        };
      }),
    );
    const setEmployeeRecordPage = (page: number) => recordStore.loadSelectedProjectEmployeeRecords(page, employeeRecordPageSize);

    watch(
      () => projectStore.selectedProjectId,
      () => setEmployeeRecordPage(1),
      { immediate: true },
    );

    const downloadPersonalReport = async (index: number) => {
      const employeeRecord = employeeRecordPage.value.entities[index];
      const report = await useReportApi().downloadPersonalReport(
        useCompanyStore().selectedCompany!.id,
        employeeRecord.id,
      );
      if (report.errors) return;
      DownloadBlobFile(report, employeeRecord.employeeName + '.pdf');
    };

    const requestReport = (index: number) => {
      const employeeRecord = employeeRecordPage.value.entities[index];
      recordStore.requestPersonalReport(employeeRecord.id);
    };

    return { employeeRecordPage, setEmployeeRecordPage, downloadPersonalReport, requestReport };
  },
});
