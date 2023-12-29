import { api } from '@/network/apis/api';
import { RoleListItem, RoleDetails } from './Models';

export interface RoleApi {
  findAllRoles(companyId: string): Promise<MaybeError<RoleListItem[]>>;
  getRole(companyId: string, roleId: string): Promise<MaybeError<RoleDetails>>;
  createRole(companyId: string, roleName: string): Promise<MaybeError<TrueResult>>;
  updateRole(companyId: string, roleId: string, roleName: string): Promise<MaybeError<TrueResult>>;
}

export function useRoleApi(): RoleApi {
  return {
    findAllRoles: async (companyId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/roles`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    getRole: async (companyId, roleId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/roles/${roleId}`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },

    createRole: async (companyId, roleName) => {
      try {
        await api.post(`/api/v1/companies/${companyId}/roles`, { roleName });
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error };
      }
    },

    updateRole: async (companyId, roleId, roleName) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/roles/${roleId}`, { roleName });
        return true;
      } catch (error) {
        return <MaybeError<IsError>> { errors: error };
      }
    },
  };
}
