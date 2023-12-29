import { api } from '@/network/apis/api';
import { Page } from '@/common/Page';
import { CompetenceChangeRequest, CompetenceInfo, IndicatorChangeRequest } from './Models';

export interface CompetenceApi {
  findCompetences(
    companyId: string,
    search: string,
    page: number,
    pageSize: number,
  ): Promise<MaybeError<Page<CompetenceInfo>>>;
  findCompetencesByList(companyId: string, competenceIds: string[]): Promise<MaybeError<CompetenceInfo[]>>;
  getCompetence(companyId: string, competenceId: string): Promise<MaybeError<CompetenceInfo>>;
  createCompetence(companyId: string, competence: CompetenceChangeRequest): Promise<MaybeError<string>>;
  updateCompetence(
    companyId: string,
    competenceId: string,
    competence: CompetenceChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  addIndicator(
    companyId: string,
    competenceId: string,
    indicator: IndicatorChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  changeIndicator(
    companyId: string,
    competenceId: string,
    indicatorId: string,
    indicator: IndicatorChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  removeIndicator(companyId: string, competenceId: string, indicatorId: string): Promise<MaybeError<TrueResult>>;
}

export const useCompetenceApi = (): CompetenceApi => ({
  findCompetencesByList: async (companyId, competenceIds) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/competences/bylist`, {
        params: { competenceIds },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  findCompetences: async (companyId, search, page, pageSize) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/competences`, {
        params: { search, page, pageSize },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  getCompetence: async (companyId, competenceId) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/competences/${competenceId}`);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  createCompetence: async (companyId, competence) => {
    try {
      const response = await api.post(`/api/v1/companies/${companyId}/competences`, competence);

      const location: string = response.headers.location;
      if (!location) return '';

      return location?.split('/').findLast((_) => true) ?? '';
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },

  updateCompetence: async (companyId, competenceId, competence) => {
    try {
      await api.put(`/api/v1/companies/${companyId}/competences/${competenceId}`, competence);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },

  addIndicator: async (companyId, competenceId, indicator) => {
    try {
      await api.post(`/api/v1/companies/${companyId}/competences/${competenceId}/indicators`, indicator);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },

  changeIndicator: async (companyId, competenceId, indicatorId, indicator) => {
    try {
      await api.put(`/api/v1/companies/${companyId}/competences/${competenceId}/indicators/${indicatorId}`, indicator);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },

  removeIndicator: async (companyId, competenceId, indicatorId) => {
    try {
      await api.delete(`/api/v1/companies/${companyId}/competences/${competenceId}/indicators/${indicatorId}`);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },
});
