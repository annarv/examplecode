import { api } from '@/network/apis/api';
import { ProfileChangeRequest, ProfileInfo, ProfileSetCompetence } from './Models';
import { Page } from '@/common/Page';

export function emptyProfilePage(): Page<ProfileInfo> {
  return {
    entities: [],
    page: 1,
    pageSize: 1,
    total: 0,
    totalPages: 1,
  };
}

export interface ProfileApi {
  findProfiles(
    companyId: string,
    search: string,
    page: number,
    pageSize: number,
  ): Promise<MaybeError<Page<ProfileInfo>>>;
  getProfile(companyId: string, profileId: string): Promise<MaybeError<ProfileInfo>>;
  createProfile(companyId: string, profile: ProfileChangeRequest): Promise<MaybeError<ProfileInfo>>;
  updateProfile(companyId: string, profileId: string, profile: ProfileChangeRequest): Promise<MaybeError<TrueResult>>;
  addCompetence(companyId: string, profileId: string, request: ProfileSetCompetence): Promise<MaybeError<TrueResult>>;
  removeCompetence(
    companyId: string,
    profileId: string,
    request: ProfileSetCompetence,
  ): Promise<MaybeError<TrueResult>>;
}

export const useProfileApi = (): ProfileApi => ({
  findProfiles: async (companyId, search, page, pageSize) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/profiles`, {
        params: { search, page, pageSize },
      });
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  getProfile: async (companyId, profileId) => {
    try {
      const response = await api.get(`/api/v1/companies/${companyId}/profiles/${profileId}`);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  createProfile: async (companyId, profile) => {
    try {
      const response = await api.post(`/api/v1/companies/${companyId}/profiles`, profile);
      return response.data;
    } catch (error) {
      return { errors: error };
    }
  },

  updateProfile: async (companyId, profileId, profile) => {
    try {
      await api.put(`/api/v1/companies/${companyId}/profiles/${profileId}`, profile);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },

  addCompetence: async (companyId, profileId, request) => {
    try {
      await api.put(`/api/v1/companies/${companyId}/profiles/${profileId}/addcompetence`, request);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },

  removeCompetence: async (companyId, profileId, request) => {
    try {
      await api.put(`/api/v1/companies/${companyId}/profiles/${profileId}/removecompetence`, request);
      return true;
    } catch (error) {
      return <MaybeError<IsError>>{ errors: error };
    }
  },
});
