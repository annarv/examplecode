import { api } from '@/network/apis/api';
import {
  EmployeeChangeRequest,
  EmployeeImportPage,
  EmployeeImportedInfo,
  EmployeeInfo,
  EmployeePage,
  ImportSummary,
} from './Models';

export function emptyEmployeePage(): EmployeePage {
  return {
    entities: [],
    page: 0,
    pageSize: 1,
    total: 0,
  };
}

export function emptyEmployeeImportPage(): EmployeeImportPage {
  return {
    entities: [],
    page: 0,
    pageSize: 1,
    total: 0,
  };
}

export interface EmployeeApi {
  findEmployees(companyId: string, search: string, page: number, pageSize: number): Promise<MaybeError<EmployeePage>>;
  getEmployee(companyId: string, employeeId: string): Promise<MaybeError<EmployeeInfo>>;
  createEmployee(companyId: string, employee: EmployeeChangeRequest): Promise<MaybeError<TrueResult>>;
  updateEmployee(
    companyId: string,
    employeeId: string,
    employee: EmployeeChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  uploadEmployeeFile(companyId: string, employeeFile: File): Promise<MaybeError<string>>;
  getImportedEmployees(companyId: string, page: number, pageSize: number): Promise<MaybeError<EmployeeImportPage>>;
  importedFileExists(companyId: string): Promise<MaybeError<string>>;
  getImportSummary(companyId: string): Promise<MaybeError<ImportSummary>>;
  changeImportEmployee(companyId: string, employee: EmployeeImportedInfo): Promise<MaybeError<TrueResult>>;
  processImport(companyId: string, excelEntityId: string): Promise<MaybeError<boolean>>;
  cancelImport(companyId: string, excelEntityId: string): Promise<MaybeError<boolean>>;
}

export const useEmployeeApi = (): EmployeeApi => ({
  getImportSummary: async (companyId) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/employees/import/summary`);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  importedFileExists: async (companyId) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/employees/import`);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  getImportedEmployees: async (companyId, page, pageSize) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/employees/import/employees`, {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  findEmployees: async (companyId, search, page, pageSize) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/employees`, {
        params: { search, page, pageSize },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  getEmployee: async (companyId, employeeId) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  createEmployee: async (companyId, employee) => {
    try {
      await api.post(`/api/v1/companies/${companyId}/employees`, employee);
      return true;
    } catch (error) {
      return <MaybeError<IsError>> { errors: error };
    }
  },

  updateEmployee: async (companyId, employeeId, employee) => {
    try {
      const response = await api.put(`/api/v1/companies/${companyId}/employees/${employeeId}`, employee);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  uploadEmployeeFile: async (companyId, employeeFile) => {
    try {
      let formData = new FormData();
      formData.append('employeeFile', employeeFile);

      const response = await api.post(`/api/v1/companies/${companyId}/employees/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  changeImportEmployee: async (companyId: string, employee: EmployeeImportedInfo) => {
    try {
      await api.put(`/api/v1/companies/${companyId}/employees/import`, employee);
      return true;
    } catch (error) {
      return <MaybeError<IsError>> { errors: error };
    }
  },

  processImport: async (companyId: string, excelEntityId: string) => {
    try {
      let formData = new FormData();
      formData.append('excelEntityId', excelEntityId);

      const response = await api.post(`/api/v1/companies/${companyId}/employees/import/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  cancelImport: async (companyId: string, excelEntityId: string) => {
    try {
      let formData = new FormData();
      formData.append('excelEntityId', excelEntityId);

      const response = await api.post(`/api/v1/companies/${companyId}/employees/import/cancel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },
});
