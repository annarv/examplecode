import { defineStore } from 'pinia';

import { useCompanyStore } from './CompanyStore';
import { ScaleDetails } from '@/network/scale/Models';
import { useScaleApi } from '@/network/scale/ScaleApi';
import { ApiMappedCache, useApiMappedCache } from './ApiMappedCache';

export interface ScaleModel {
  id: string | null;
  name: string;
  nonsense: {
    value: string;
    isActive: boolean;
  };
  labels: Array<string>;
}

export interface ScaleStoreState {
  allScales: ScaleDetails[];
  selectedScale?: ScaleDetails;
  cachedScales: ApiMappedCache<ScaleDetails>;
}

export const useScaleStore = defineStore('scales', {
  state: (): ScaleStoreState => {
    return {
      allScales: [],
      selectedScale: undefined,
      cachedScales: useApiMappedCache<ScaleDetails>(
        (scaleId: string) =>
          useScaleApi().getScale(useCompanyStore().selectedCompany!.id, scaleId),
        10,
      ),
    };
  },

  actions: {
    async loadScales() {
      const apiScale = useScaleApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiScale.findAllScales(selectedCompany.id);
      if (!result.errors)
        this.allScales = result;

      return result.errors || [];
    },

    async loadSelected(scaleId: string) {
      const apiScale = useScaleApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiScale.getScale(selectedCompany.id, scaleId);
      if (!result.errors)
        this.selectedScale = result;
      else
        this.selectedScale = undefined;

      return result.errors || [];
    },

    async createScale(model: ScaleModel) {
      const apiScale = useScaleApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const labels = [];
      if (model.nonsense.isActive) {
        labels.push(model.nonsense.value);
      }
      labels.push(...model.labels);

      const result = await apiScale.createScale(selectedCompany.id, {
        name: model.name,
        hasNonsense: model.nonsense.isActive,
        labels: labels,
      });

      return result.errors || [];
    },

    async updateScale(model: ScaleModel) {
      const apiScale = useScaleApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany || !model.id) return [];

      const labels = [];
      if (model.nonsense.isActive) {
        labels.push(model.nonsense.value);
      }
      labels.push(...model.labels);

      const result = await apiScale.updateScale(selectedCompany.id, model.id, {
        name: model.name,
        hasNonsense: model.nonsense.isActive,
        labels: labels,
      });

      return result.errors || [];
    },
  },
});
