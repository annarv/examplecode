import { useIntegrationApi } from '@/network/integration/IntegrationApi';
import { useCompanyStore } from '@/stores/CompanyStore';
import { defineComponent, ref } from 'vue';

interface Adapter {
  title: string,
  key: string,
  accountId: number,
  secretKey: string,
  connected: boolean
}

export const AllAdapters: { [key: string]: string } = {
  service: 'Service',
}

export default defineComponent({
  setup() {
    const { selectedCompany } = useCompanyStore();
    const apiIntegration = useIntegrationApi();
    const adapters = ref<Adapter[]>([]);

    const loadAdapters = async () => {
      if (!selectedCompany) return;
      const result = await apiIntegration.getAdapters(selectedCompany.id);
      adapters.value = [];

      if (!result.errors) {
        Object.keys(AllAdapters)
          .forEach(key => {
            const details = (result.adaptersProperties && Object.hasOwn(result.adaptersProperties, key)) ?
              result.adaptersProperties[key] :
              null;
            adapters.value.push({
              title: AllAdapters[key],
              key: key,
              accountId: details ? details.AccountId : '',
              secretKey: '',
              connected: !!details,
            });
          })
      }
    }

    const setAdapter = async (adapter: Adapter) => {
      if (!selectedCompany) return;
      await apiIntegration.setAdapter(selectedCompany.id, adapter.key, adapter.accountId, adapter.secretKey);

      loadAdapters();
    }

    loadAdapters();

    return {
      adapters,
      setAdapter
    }
  },
});
