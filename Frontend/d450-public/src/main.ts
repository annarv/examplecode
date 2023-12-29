import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

import './assets/styles/index.scss';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';

import router from './routers';

const app = createApp(App);
const pinia = createPinia();
pinia.use(createPersistedState({ key: (storeId: string) => (import.meta.env.PROD ? storeId : 'stage_' + storeId) }));

app
  //
  .use(pinia)
  .use(createVuetify())
  .use(router);

app.mount('#app');
