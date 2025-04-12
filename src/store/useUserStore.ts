// src/store/useRouteStore.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
  },
});