import { Ref, defineComponent, ref, computed } from 'vue';
import { useBrowserLocation } from '@vueuse/core';
import { useRouter } from 'vue-router';

import { useCompanyStore } from '@/stores/CompanyStore';
import { vue3Debounce } from 'vue-debounce';

export default defineComponent({
  directives: {
    debounce: vue3Debounce({
      lock: true,
      fireOnEmpty: true,
      listenTo: 'input',
    }),
  },
  setup() {
    const router = useRouter();
    const companyStore = useCompanyStore();
    const location = useBrowserLocation();
    const pageSize = 10;

    const searchText = ref('');

    const companies = computed(() =>
      companyStore.companyPage.entities.map((e) => {
        return <ListItem>{ value: e.id, title: e.name };
      }),
    );

    const page = computed({
      get() {
        return companyStore.companyPage.page + 1;
      },
      async set(page: number) {
        await setPage(page - 1);
      },
    });

    const isVisiblePaging = () => companyStore.companyPage.total > pageSize;

    const onSearchInputEvent = async (val: any) => {
      await setPage(page.value - 1);
    };

    const totalPage = computed(() => {
      return Math.floor(companyStore.companyPage.total / companyStore.companyPage.pageSize) + 1;
    });

    const choose = async (val: string) => {
      await companyStore.loadSelected(val);
      // await router.push({ name: 'route-projects-list' });
      location.value.href = router.resolve({ name: 'route-root' }).href;
    };

    const dialogCreate = ref(false);
    const dialogEdit = ref(false);
    const dialogDelete = ref(false);
    const nameCompany = ref('');
    const chosenContextId = ref('');

    const create = async (closer: Ref<boolean>) => {
      if (nameCompany.value) {
        await companyStore.createCompany(nameCompany.value);
        await setPage(page.value - 1);
      }
      nameCompany.value = '';
      closer.value = false;
    };
    const editGet = (val: string) => {
      const chosen = companies.value.find((c) => c.value == val);
      if (!chosen) return;

      nameCompany.value = chosen.title;
      chosenContextId.value = chosen.value;

      dialogEdit.value = true;
    };
    const editPost = async () => {
      if (nameCompany.value && chosenContextId.value) {
        await companyStore.updateCompany(chosenContextId.value, nameCompany.value);
        await setPage(page.value - 1);
      }
      nameCompany.value = '';
      chosenContextId.value = '';
      dialogEdit.value = false;
    };

    const setPage = async (page: number) => companyStore.loadPage(searchText.value, page, pageSize);

    setPage(0);

    return {
      searchText,
      page,
      totalPage,
      companies,

      dialogCreate,
      dialogEdit,
      dialogDelete,
      nameCompany,

      choose,
      create,
      editGet,
      editPost,
      onSearchInputEvent,
      isVisiblePaging,
    };
  },
});

//TODO: to common models
// interface Page<TItem> {
//   page: number;
//   totalPage: number;
//   items: TItem[];
// }
interface ListItem {
  value: string;
  title: string;
}
