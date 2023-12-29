import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { useProfileApi } from '@/network/profile/ProfileApi';
import { ProfileInfo } from './models/ProfileInfo';
import { ApiMappedCache, useApiMappedCache } from '../ApiMappedCache';
import { Page, TransformPage, emptyPage } from '@/common/Page';

export const emptyProfileInfo = () =>
  ({
    id: '',
    name: '',
  }) as ProfileInfo;

export interface ProfileStoreState {
  profilesPage: Page<ProfileInfo>;
  selectedProfile: ProfileInfo;
  cachedProfiles: ApiMappedCache<ProfileInfo>;
}

export const useProfileStore = defineStore('profiles', {
  state: (): ProfileStoreState => ({
    profilesPage: emptyPage<ProfileInfo>(),
    selectedProfile: emptyProfileInfo(),
    cachedProfiles: useApiMappedCache<ProfileInfo>(
      (profileId: string) => useProfileApi().getProfile(useCompanyStore().selectedCompany!.id, profileId),
      100,
    ),
  }),

  getters: {
    selectedProfileId: (state) => state.selectedProfile.id,
  },

  actions: {
    async selectProfile(profileId: string) {
      if (profileId !== this.selectedProfileId) {
        this.selectedProfile.id = profileId;
        await this.loadSelectedProfile();
      }
    },

    async loadSelectedProfile() {
      const { selectedCompany } = useCompanyStore();

      if (!this.selectedProfileId) {
        this.selectedProfile = emptyProfileInfo();
        return;
      }

      const apiProfile = useProfileApi();

      const result = await apiProfile.getProfile(selectedCompany!.id, this.selectedProfileId);
      if (!result.errors) this.selectedProfile = result;
    },

    async loadPagedProfiles(searchText: string, currentPage: number, pageSize: number) {
      const api = useProfileApi();
      const { selectedCompany } = useCompanyStore();

      const res = await api.findProfiles(selectedCompany!.id, searchText, currentPage - 1, pageSize);
      if (!res.errors) this.profilesPage = TransformPage(res, true, (e) => e);
    },

    async saveProfile(name: string) {
      const api = useProfileApi();
      const { selectedCompany } = useCompanyStore();

      if (this.selectedProfileId) {
        const result = await api.updateProfile(selectedCompany!.id, this.selectedProfileId, { name });
        return result.errors || [];
      } else {
        const result = await api.createProfile(selectedCompany!.id, { name });
        return result.errors || result;
      }
    },

    async addCompetence(competenceId: string) {
      if (!this.selectedProfileId) {
        return;
      }

      const { selectedCompany } = useCompanyStore();
      const api = useProfileApi();

      const result = await api.addCompetence(selectedCompany!.id, this.selectedProfileId, { competenceId });
      return result.errors || result;
    },

    async removeCompetence(competenceId: string) {
      if (!this.selectedProfileId) {
        return;
      }

      const { selectedCompany } = useCompanyStore();
      const api = useProfileApi();

      const result = await api.removeCompetence(selectedCompany!.id, this.selectedProfileId, { competenceId });
      return result.errors || result;
    },
  },
});
