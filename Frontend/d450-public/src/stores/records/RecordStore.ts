import { Page, TransformPage, emptyPage } from '@/common/Page';
import { EmployeeRecordInfo } from '@/network/record/Models';
import { useRecordApi } from '@/network/record/RecordApi';
import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { useProjectsStore } from '../projects/ProjectsStore';

// const emptyScopeRecordInfo = () =>
//   ({
//     id: '',
//     projectId: '',
//     competenceCalculations: [],
//     isCalculated: false,
//   }) as ScopeRecordInfo;

export interface RecordStoreState {
  // selectedScope: ScopeRecordInfo;
  employeeRecordsPage: Page<EmployeeRecordInfo>;
}

export const useRecordStore = defineStore('record', {
  state: (): RecordStoreState => ({
    // selectedScope: emptyScopeRecordInfo(),
    employeeRecordsPage: emptyPage<EmployeeRecordInfo>(),
  }),

  // getters: {
  //   selectedScopeId: (state) => state.selectedScope.id,
  // },

  actions: {
    // async loadScopeByProject() {
    //   const { selectedCompany } = useCompanyStore();
    //   const { selectedProject } = useProjectsStore();
    //   // TODO: hack because of 404 common redirect
    //   if (selectedProject.publicState !== 'activated') {
    //     this.selectedScope = emptyScopeRecordInfo();
    //     return;
    //   }

    //   const apiRecord = useRecordApi();
    //   var res = await apiRecord.getScopeRecordForProject(selectedCompany!.id, selectedProject.id);
    //   if (!res.errors) this.selectedScope = res;
    // },

    async loadSelectedProjectEmployeeRecords(currentPage: number, pageSize: number) {
      const { selectedCompany } = useCompanyStore();
      const { selectedProjectId } = useProjectsStore();
      const apiRecord = useRecordApi();

      var res = await apiRecord.findEmployeeRecordsForProject(selectedCompany!.id, selectedProjectId, currentPage - 1, pageSize);

      if (!res.errors) this.employeeRecordsPage = TransformPage(res, true, (a) => a);
    },

    async requestPersonalReport(employeeRecordId: string) {
      const apiRecord = useRecordApi();
      const { selectedCompany } = useCompanyStore();

      await apiRecord.requestPersonalReport(selectedCompany!.id, employeeRecordId);
    },
  },
});
