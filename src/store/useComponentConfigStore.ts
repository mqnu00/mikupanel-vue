// src/store/useRouteStore.ts
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

export const useComponentConfigStore = defineStore('route', {
  state: () => ({
    componentConfig: [] as any[],
  }),
  actions: {
    setComponentConfig(routes: any[]) {
      this.componentConfig = routes;
    },
  },
});