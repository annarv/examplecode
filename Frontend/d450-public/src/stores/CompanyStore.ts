import { defineStore } from 'pinia';
import { emptyCompanyPage, useCompanyApi } from "@/network/company/CompanyApi";
import { CompanyStoreState } from "@/network/company/Models";

export const useCompanyStore = defineStore('companies', {
  state: (): CompanyStoreState => {
    return {
      companyPage: emptyCompanyPage(),
      selectedCompany: undefined,
    };
  },

  persist: true,

  actions: {
    async loadPage(search: string, page: number, pageSize: number) {
      const apiCompany = useCompanyApi();
      const result = await apiCompany.getCompanyPage(search, page, pageSize);
      if (!result.errors)
        this.companyPage = result;
    },

    async loadSelected(id: string) {
      const apiCompany = useCompanyApi();
      const result = await apiCompany.getCompanySummary(id);
      if (!result.errors)
        this.selectedCompany = result;
      else {
        this.selectedCompany = undefined;
      }
    },

    async createCompany(name: string) {
      const apiCompany = useCompanyApi();
      await apiCompany.createCompany(name);
      // await this.loadPage('', 0, 10);
    },

    async updateCompany(id: string, name: string) {
      const apiCompany = useCompanyApi();
      await apiCompany.updateCompany(id, name);
      // await this.loadPage('', 0, 10);
    },
  },
});
