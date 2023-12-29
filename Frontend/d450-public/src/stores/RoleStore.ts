import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCompanyStore } from './CompanyStore';
import { useRoleApi } from '@/network/role/RoleApi';
import { RoleListItem } from '@/network/role/Models';


// export interface RoleStoreState {
//   allRoles: RoleListItem[];
// }

export const useRoleStore = defineStore('roles', () => {
  const companies = useCompanyStore();
  const rolesApi = useRoleApi();

  const allRoles = ref(<RoleListItem[]>[]);

  async function loadRoles() {
    if (!companies.selectedCompany) return;
    const result = await rolesApi.findAllRoles(companies.selectedCompany.id);
    if (!result.errors)
      allRoles.value = result;
  }
  async function createRole(name: string) {
    if (!companies.selectedCompany) return;
    await rolesApi.createRole(companies.selectedCompany.id, name);
  }
  async function updateRole(id: string, name: string) {
    if (!companies.selectedCompany) return;
    await rolesApi.updateRole(companies.selectedCompany.id, id, name);
  }

  return {
    allRoles,

    loadRoles,
    createRole,
    updateRole,
  };
});
