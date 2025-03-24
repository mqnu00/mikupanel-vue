// src/router/dynamicRoutes.ts
import router from './index';
import { useRouteStore } from '@/store/useRouteStore';
import type { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';



export const generateDynamicRoutes = (menuData: any[]) => {
  const routeStore = useRouteStore();
  const dynamicRoutes: RouteRecordRaw[] = [];

  const modules = import.meta.glob('@/plugins/*.vue')
  console.log(modules)

  const processRoutes: any = (routes: any[]) => {
   
    return routes.map((item) => {
        console.log(item)
        console.log(import.meta.env.VITE_PLUGIN_PATH)
      const component = () => import(`${item.component}`)
      const route: RouteRecordRaw = {
        path: item.path,
        name: item.name,
        component: component,
      };
      return route;
    });
  };

  dynamicRoutes.push(...processRoutes(menuData));

  routeStore.setDynamicRoutes(dynamicRoutes); // 存储到 Pinia 状态管理中
  dynamicRoutes.forEach((route) => {
    router.addRoute(route)
    console.log(router.getRoutes()); // 打印当前路由列表
  }); // 动态添加到路由实例中
  // 强制刷新路由
router.push(router.currentRoute.value.path);
};