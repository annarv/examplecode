import { emptyEmployeePage, useEmployeeApi } from '@/network/employee/EmployeeApi';
import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { EmployeePage } from '@/network/employee/Models';
import { EmployeeInfo } from '@/stores/employees/models/EmployeeInfo';
import { ApiMappedCache, useApiMappedCache } from '../ApiMappedCache';

export interface EmployeeStoreState {
  employeesPage: EmployeePage;
  cachedEmployees: ApiMappedCache<EmployeeInfo>;
}

export const useEmployeeStore = defineStore('employees', {
  state: (): EmployeeStoreState => ({
    employeesPage: emptyEmployeePage(),
    cachedEmployees: useApiMappedCache<EmployeeInfo>(
      (employeeId: string) => useEmployeeApi().getEmployee(useCompanyStore().selectedCompany!.id, employeeId),
      100,
    ),
  }),

  actions: {
    async loadPagedEmployees(searchText: string, currentPage: number, pageSize: number) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiEmpl.findEmployees(selectedCompany.id, searchText, currentPage, pageSize);
      if (!result.errors)
        this.employeesPage = result;

      return result.errors || [];
    },

    async createEmployee(model: EmployeeInfo) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiEmpl.createEmployee(selectedCompany.id, {
        email: model.email,
        middleName: model.middleName,
        name: model.name,
        surname: model.surname,
      });

      return result.errors || [];
    },

    async updateEmployee(model: EmployeeInfo) {
      const apiEmpl = useEmployeeApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !model.id) return [];

      const result = await apiEmpl.updateEmployee(selectedCompany.id, model.id, {
        email: model.email,
        middleName: model.middleName,
        name: model.name,
        surname: model.surname,
      });

      return result.errors || [];
    },
  },
});
