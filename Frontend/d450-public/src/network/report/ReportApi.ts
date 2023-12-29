import { api } from '../apis/api';

export interface ReportApi {
  downloadPersonalReport(companyId: string, employeeRecordId: string): Promise<MaybeError<Blob>>;
}

export function useReportApi(): ReportApi {
  return {
    downloadPersonalReport: async (companyId, employeeRecordId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/reports/employees/byrecord/${employeeRecordId}`, { responseType: 'blob' });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
  };
}
