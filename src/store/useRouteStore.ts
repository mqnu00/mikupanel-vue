// src/store/useRouteStore.ts
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

export const useRouteStore = defineStore('route', {
  state: () => ({
    dynamicRoutes: [] as RouteRecordRaw[],
  }),
  actions: {
    setDynamicRoutes(routes: RouteRecordRaw[]) {
      this.dynamicRoutes = routes;
    },
  },
});