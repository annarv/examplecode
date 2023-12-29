import { api } from '@/network/apis/api';

export interface ProjectApi {
  getProjectForUpway(companyId: string, projectId: string): Promise<MaybeError<Blob>>;
  getStatesForUpway(companyId: string, projectId: string): Promise<MaybeError<Blob>>;
  getResultsForUpway(companyId: string, projectId: string): Promise<MaybeError<Blob>>;
  copyReportsToPublic(companyId: string, projectId: string): Promise<MaybeError<TrueResult>>;
}

export function useUpwayApi(): ProjectApi {
  return {
    getProjectForUpway: async (companyId: string, projectId: string) => {
      try {
        const response =  await api.get(`/api/v1/companies/${companyId}/upway/${projectId}`,
          { responseType: 'blob' }
        );
        return response.data;
      } catch (error) {
        return error;
      }
    },
    getStatesForUpway: async (companyId: string, projectId: string) => {
      try {
        const response =  await api.get(`/api/v1/companies/${companyId}/upway/${projectId}/states`,
          { responseType: 'blob' }
        );
        return response.data;
      } catch (error) {
        return error;
      }
    },
    getResultsForUpway: async (companyId: string, projectId: string) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/upway/${projectId}/results`,
          { responseType: 'blob'} 
        );
        return response.data;
      } catch (error) {
        return error;
      }
    },
    copyReportsToPublic: async (companyId: string, projectId: string) => {
      try {
        await api.post(`/api/v1/companies/${companyId}/upway/${projectId}/copyreports`);
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error };
      }
    },
  }
}
