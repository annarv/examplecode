import axios from 'axios';

import { useAuthStore } from '@/stores/AuthStore';
import router from '@/routers';

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  paramsSerializer: { indexes: null },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    if (error.response.status === 401 && !authStore.isAuthenticated) {
      authStore.startLogin('/');
    } else {
      switch (error.response.status) {
        case 400:
        case 401:
          return Promise.reject(error.response.data.reason);
        case 404:
          router.replace({ name: 'page-not-found' });
          return Promise.reject(['Found']);
        default:
          router.replace({ name: 'error-page' });
          return Promise.reject(['Known']);
      }
    }
  },
);
