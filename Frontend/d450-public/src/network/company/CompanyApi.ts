import { api } from "@/network/apis/api";
import { CompanyPage, CompanySummary } from "./Models";

export function emptyCompanyPage(): CompanyPage {
  return {
    entities: [],
    page: 0,
    pageSize: 1,
    total: 0,
  };
}

export interface CompanyApi {
  getCompanyPage(search: string, page: number, pageSize: number): Promise<MaybeError<CompanyPage>>;
  getCompanySummary(id: string): Promise<MaybeError<CompanySummary>>;
  createCompany(name: string): Promise<MaybeError<TrueResult>>;
  updateCompany(id: string, name: string): Promise<MaybeError<TrueResult>>;
}

export function useCompanyApi(): CompanyApi {
  return {
    getCompanyPage: async (search, page, pageSize) => {
      try {
        const response = await api.get('/api/v1/companies', {
          params: {
            search,
            page,
            pageSize,
          },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    getCompanySummary: async (id) => {
      try {
        const response = await api.get('/api/v1/companies/' + id);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    createCompany: async (name) => {
      try {
        await api.post('/api/v1/companies', { companyName: name });
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error };
      }
    },

    updateCompany: async (id, name) => {
      try {
        await api.put('/api/v1/companies/' + id, { companyName: name });
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error }
      }
    },
  };
}
