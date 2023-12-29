import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { useCompetenceApi } from '@/network/competence/CompetenceApi';
import { CompetenceInfo } from './models/CompetenceInfo';
import { Page, TransformPage, emptyPage } from '@/common/Page';
import { CompetenceChangeRequest } from '@/network/competence/Models';
import { useProfileStore } from '../profiles/ProfileStore';

const emptyCompetenceInfo = () =>
  ({
    id: '',
    code: '',
    name: '',
    description: '',
    profileIds: [],
    indicators: [],
  }) as CompetenceInfo;

export interface CompetenceStoreState {
  competencesPage: Page<CompetenceInfo>;
  selectedCompetence: CompetenceInfo;
  selectedProfileCompetences: CompetenceInfo[];
}

export const useCompetenceStore = defineStore('competences', {
  state: (): CompetenceStoreState => ({
    competencesPage: emptyPage<CompetenceInfo>(),
    selectedCompetence: emptyCompetenceInfo(),
    selectedProfileCompetences: [],
  }),

  getters: {
    selectedCompetenceId: (state) => state.selectedCompetence.id,
  },

  actions: {
    async selectCompetence(competenceId: string) {
      if (competenceId !== this.selectedCompetenceId) {
        this.selectedCompetence.id = competenceId;
        await this.loadSelectedCompetence();
      }
    },

    async loadSelectedCompetence() {
      const { selectedCompany } = useCompanyStore();

      if (!this.selectedCompetenceId) {
        this.selectedCompetence = emptyCompetenceInfo();
        return;
      }

      const apiCompetence = useCompetenceApi();

      const result = await apiCompetence.getCompetence(selectedCompany!.id, this.selectedCompetenceId);
      if (!result.errors) this.selectedCompetence = result;
    },

    async loadSelectedProfileCompetences() {
      const { selectedCompany } = useCompanyStore();
      const { selectedProfile } = useProfileStore();

      const apiCompetence = useCompetenceApi();

      const result = await apiCompetence.findCompetencesByList(selectedCompany!.id, selectedProfile.competenceIds);
      if (!result.errors) this.selectedProfileCompetences = result;
    },

    async loadPagedCompetences(searchText: string, currentPage: number, pageSize: number) {
      const api = useCompetenceApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return;

      const res = await api.findCompetences(selectedCompany.id, searchText, currentPage - 1, pageSize);
      if (!res.errors) this.competencesPage = TransformPage(res, true, (e) => e);
    },

    async saveCompetence(name: string, description: string, indicatorsToKeep: { id: string; name: string }[]) {
      const api = useCompetenceApi();
      const { selectedCompany } = useCompanyStore();

      const competenceChangeRequest: CompetenceChangeRequest = {
        code: '',
        description: description,
        name: name,
      };

      let competenceId = this.selectedCompetenceId;

      if (competenceId) {
        await api.updateCompetence(selectedCompany!.id, competenceId, competenceChangeRequest);
      } else {
        const result = await api.createCompetence(selectedCompany!.id, competenceChangeRequest);
        if (!result.errors) competenceId = result;
      }

      const indicatorToKeepIds = indicatorsToKeep.map((i) => i.id).filter((id) => id);
      const indicatorsToRemove = this.selectedCompetence.indicators
        .map((i) => i.id)
        .filter((id) => !indicatorToKeepIds.includes(id));

      for (let i = 0; i < indicatorsToRemove.length; i++)
        await api.removeIndicator(selectedCompany!.id, competenceId, indicatorsToRemove[i]);

      for (let i = 0; i < indicatorsToKeep.length; i++) {
        const ind = indicatorsToKeep[i];
        if (ind.id) {
          await api.changeIndicator(selectedCompany!.id, competenceId, ind.id, { name: ind.name });
        } else {
          await api.addIndicator(selectedCompany!.id, competenceId, { name: ind.name });
        }
      }
    },
  },
});
