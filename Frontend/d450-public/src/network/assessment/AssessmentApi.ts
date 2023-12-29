import { api } from '@/network/apis/api';

import { AssessmentInfo } from './Models';
import { Page } from '@/common/Page';

export interface AssessmentApi {
  findAssessmentsForProject(
    companyId: string,
    projectId: string,
    page: number,
    pageSize: number,
  ): Promise<MaybeError<Page<AssessmentInfo>>>;
}

export function useAssessmentApi(): AssessmentApi {
  return {
    findAssessmentsForProject: async (companyId, projectId, page, pageSize) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assessment/byproject/${projectId}`, {
          params: { page, pageSize },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
  };
}
