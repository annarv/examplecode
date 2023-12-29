import { api } from '@/network/apis/api';
import { Adapters } from './Models';

export interface IntegrationApi {
  getAdapters(companyId: string): Promise<MaybeError<Adapters>>;
  setAdapter(companyId: string, adapterKey: string, accountId: number, secretKey: string): Promise<MaybeError<TrueResult>>;
}

export function useIntegrationApi(): IntegrationApi {
  return {
    getAdapters: async (companyId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/integrations`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    setAdapter: async (companyId: string, adapterKey: string, accountId: number, secretKey: string) => {
      try {
        const adapterChangeRequest = {
          "AdapterKey": adapterKey,
          "AdapterSettings":
          {
            "AccountId": Number(accountId),
            "AccountSecret": secretKey
          }
        };
        const response = await api.post(`/api/v1/companies/${companyId}/integrations`, adapterChangeRequest);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
   };
}
