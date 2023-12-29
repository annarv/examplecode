import { api } from '@/network/apis/api';
import { ScaleDetails, ScaleChangeRequest } from './Models';

export interface ScaleApi {
  findAllScales(companyId: string): Promise<MaybeError<ScaleDetails[]>>;
  getScale(companyId: string, scaleId: string): Promise<MaybeError<ScaleDetails>>;
  createScale(companyId: string, scale: ScaleChangeRequest): Promise<MaybeError<TrueResult>>;
  updateScale(companyId: string, scaleId: string, scale: ScaleChangeRequest): Promise<MaybeError<TrueResult>>;
}

export function useScaleApi(): ScaleApi {
  return {
    findAllScales: async (companyId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/scales`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    getScale: async (companyId, scaleId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/scales/${scaleId}`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    createScale: async (companyId, scale: ScaleChangeRequest) => {
      try {
        await api.post(`/api/v1/companies/${companyId}/scales`, scale);
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error };
      }
    },

    updateScale: async (companyId, scaleId, scale: ScaleChangeRequest) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/scales/${scaleId}`, scale);
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error };
      }
    },
  };
}
