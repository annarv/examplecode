import router from '@/routers';
import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { storeToRefs } from 'pinia';
import { defineComponent, Ref, ref } from 'vue';
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
    const pageSize = 10;
    const searchText = ref('');
    const profileTitle = ref('');
    const profileStore = useProfileStore();

    const { profilesPage } = storeToRefs(profileStore);

    const setPage = (page: number) => profileStore.loadPagedProfiles(searchText.value, page, pageSize);

    const onSearchInputEvent = () => setPage(1);

    const createProfile = async () => {
      router.push({ name: 'route-profile-details', params: { id: null } });
    };

    profileStore.selectProfile('');
    setPage(profilesPage.value.page);

    return {
      profilesPage,
      profileTitle,
      searchText,

      onSearchInputEvent,
      setPage,

      createProfile,
    };
  },
});
