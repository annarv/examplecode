import { emptyEmployeeImportPage, useEmployeeApi } from '@/network/employee/EmployeeApi';
import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { EmployeeImportPage, EmployeeImportedInfo } from '@/network/employee/Models';

export interface ImportEmployeeStoreState {
  employeesPage: EmployeeImportPage;
}

export const useImportEmployeeStore = defineStore('importEmployees', {
  state: (): ImportEmployeeStoreState => ({
    employeesPage: emptyEmployeeImportPage()
  }),

  actions: {
    async getImportSummary() {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return false;

      const result = await apiEmpl.getImportSummary(selectedCompany.id);
      if (!result.errors)
        return result;
    },

    async importedFileExists() {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return false;

      const result = await apiEmpl.importedFileExists(selectedCompany.id);
      if (!result.errors)
        return result;
    },

    async getImportedEmployees(currentPage: number, pageSize: number) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return;

      await apiEmpl.getImportedEmployees(selectedCompany.id, currentPage, pageSize);
    },

    async loadPagedEmployees(currentPage: number, pageSize: number) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return;

      let result = await apiEmpl.getImportedEmployees(selectedCompany.id, currentPage, pageSize);
      if (!result.errors)
        this.employeesPage = result;
    },

    async uploadEmployeeFile(employeeFile: any) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return null;

      await apiEmpl.uploadEmployeeFile(selectedCompany.id, employeeFile);
    },

    async changeImportEmployee(employee: EmployeeImportedInfo) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return;

      await apiEmpl.changeImportEmployee(selectedCompany.id, employee);
    },

    async processImport(excelEntityId: string) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return false;

      const result = await apiEmpl.processImport(selectedCompany.id, excelEntityId);
      if (!result.errors)
        return result;
    },

    async cancelImport(excelEntityId: string) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany ) return false;

      const result = await apiEmpl.cancelImport(selectedCompany.id, excelEntityId);
      if (!result.errors)
        return result;
    },
  },
});
