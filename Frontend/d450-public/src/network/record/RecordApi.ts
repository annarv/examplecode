import { Page } from '@/common/Page';
import { EmployeeRecordInfo } from './Models';
import { api } from '@/network/apis/api';

export interface RecordApi {
  // getScopeRecordForProject(companyId: string, projectId: string): Promise<MaybeError<ScopeRecordInfo>>;
  findEmployeeRecordsForProject(companyId: string, projectId: string, page: number, pageSize: number): Promise<MaybeError<Page<EmployeeRecordInfo>>>;

  requestPersonalReport(companyId: string, employeeRecordId: string): Promise<MaybeError<TrueResult>>;
}

export function useRecordApi(): RecordApi {
  return {
    // getScopeRecordForProject: async (companyId, projectId) => {
    //   try {
    //     const response = await api.get(`/api/v1/companies/${companyId}/records/scope/byproject/${projectId}`);
    //     return response.data;
    //   } catch (error) {
    //     return error;
    //   }
    // },

    findEmployeeRecordsForProject: async (companyId, projectId, page, pageSize) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/records/employees/byscope/${projectId}`, {
          params: { page, pageSize },
        });
        return response.data;
      } catch (error) {
        return error;
      }
    },

    requestPersonalReport: async (companyId, employeeRecordId) => {
      try {
        const response = await api.put(`/api/v1/companies/${companyId}/records/employees/byrecord/${employeeRecordId}`);
        return response.data;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
  };
}
