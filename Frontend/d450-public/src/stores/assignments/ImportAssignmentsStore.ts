import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { emptyAssignmentImportPage, useAssignmentApi } from '@/network/assignment/AssignmentApi';
import { AssignmentImportPage, AssignmentImportedInfo } from '@/network/assignment/Models';

export interface ImportAssignmentStoreState {
  assignmentsPage: AssignmentImportPage;
}

export const useImportAssignmentsStore = defineStore('importAssignments', {
  state: (): ImportAssignmentStoreState => ({
    assignmentsPage: emptyAssignmentImportPage(),
  }),

  actions: {
    async getImportSummary(projectId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return;

      const result = await apiAssignment.getImportSummary(selectedCompany.id, projectId);
      if (!result.errors) return result;
    },

    async uploadAssignmentsFile(projectId: string, assignmentsFile: any) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return null;

      await apiAssignment.uploadAssignmentsFile(selectedCompany.id, projectId, assignmentsFile);
    },

    async getImportFileId(projectId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return false;

      const result = await apiAssignment.getImportFileId(selectedCompany.id, projectId);
      if (!result.errors) return result;
    },

    async loadPagedAssignments(projectId: string, currentPage: number, pageSize: number) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return;

      const result = await apiAssignment.getImportedAssignments(selectedCompany.id, projectId, currentPage, pageSize);
      if (!result.errors) this.assignmentsPage = result;
    },

    async changeImportAssignment(projectId: string, assignment: AssignmentImportedInfo) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return;

      await apiAssignment.changeImportAssignment(selectedCompany.id, projectId, assignment);
    },

    async processImport(projectId: string, excelEntityId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return;

      const result = await apiAssignment.processImport(selectedCompany.id, projectId, excelEntityId);
      if (!result.errors) return result;
    },

    async cancelImport(projectId: string, excelEntityId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return;

      const result = await apiAssignment.cancelImport(selectedCompany.id, projectId, excelEntityId);
      if (!result.errors) return result;
    },

    async updateProfileId(projectId: string, profileId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !projectId) return;

      const result = await apiAssignment.updateProfileId(selectedCompany.id, projectId, profileId);
      if (!result.errors) return result;
    },
  },
});
