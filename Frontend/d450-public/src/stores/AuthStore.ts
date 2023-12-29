import { useBrowserLocation } from '@vueuse/core';
import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { defineStore } from 'pinia';

const host = useBrowserLocation().value.origin;
//window.location.origin;

const userManagerSettings: UserManagerSettings = {
  // Where the tokens will be stored
  // userStore: new WebStorageStateStore({ store: window.localStorage }),
  // URL to the authentication server (including realm)
  authority: import.meta.env.VITE_AUTH_AUTHORITY,
  // The name of the client in Keycloak setup for this service
  client_id: import.meta.env.VITE_AUTH_CLIENT,
  // Where to redirect the user to after successful authentication
  redirect_uri: host + '/login',
  // Where to redirect the user to after logging the user out
  post_logout_redirect_uri: host + '/logout',
  // Indicate the the authorization code flow should be used
  response_type: 'code',
  // "openid" tells the server that this client uses oidc for authentication
  scope: 'openid',
  // Enable automatic (silent) renewal of the access token
  automaticSilentRenew: true,
};

const userManager = new UserManager(userManagerSettings);
userManager.events.addUserLoaded((user) => {
  const as = useAuthStore();
  as.setUser(user);
});

export interface AuthState {
  user?: User;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => {
    return {};
  },

  getters: {
    accessToken: (state) => state.user?.access_token,
    isAuthenticated: (state) => state.user && !state.user.expired,
    initialUrl: (state) => state.user?.state ?? '/',
  },

  actions: {
    setUser(user: User) {
      this.user = user;
    },

    async startLogin(url: string) {
      try {
        const actualUrl = url.startsWith('/login') ? '/' : url;
        await userManager.signinRedirect({ state: actualUrl });
      } catch (error) {
        console.log(error);
      }
    },

    async handleLoginRedirect(): Promise<boolean> {
      try {
        await userManager.signinRedirectCallback();
      } catch (error) {
        return false;
      }
      return true;
    },
  },
});
