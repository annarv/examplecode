import { computed, defineComponent, Ref, ref } from 'vue';

import { useRoleStore } from '@/stores/RoleStore';

export default defineComponent({
  setup() {
    const roleStore = useRoleStore();
    roleStore.loadRoles();

    const roles = computed(() => {
      return roleStore.allRoles.map(
        (r) => <ListItem>{ value: r.id, title: r.name /* subtitle: r.kind */ },
      );
    });

    const roleName = ref('');

    const create = async (isActive: Ref<boolean>) => {
      isActive.value = false;
      if (roleName.value) {
        await roleStore.createRole(roleName.value);
        await roleStore.loadRoles();
      }
      roleName.value = '';
    };

    const edit = async (isActive: Ref<boolean>, id: string, newName: string) => {
      isActive.value = false;
      if (newName) {
        await roleStore.updateRole(id, newName);
      }
      await roleStore.loadRoles();
    };

    return {
      roles,
      roleName,

      create,
      edit,
    };
  },
});

//TODO: to common models
interface ListItem {
  value: string;
  title: string;
  // subtitle: string;
}
