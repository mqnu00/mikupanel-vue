// src/router/dynamicRoutes.ts
import router, { routes } from './index';
import { useComponentConfigStore } from '@/store/useComponentConfigStore';
import type { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';



export const generateDynamicRoutes = (menuData: any[]) => {
  const routeStore = useComponentConfigStore();
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

  router.getRoutes().forEach(route => {
    router.removeRoute(route.name as string);
  });

  dynamicRoutes.push(...processRoutes(menuData));

   // 存储到 Pinia 状态管理中
  // routeStore.setDynamicRoutes(dynamicRoutes);
  dynamicRoutes.forEach((route) => {
    router.addRoute(route)
    
  }); // 动态添加到路由实例中
  routes.forEach((route) => {
    router.addRoute(route)
  })
  console.log(router.getRoutes()); // 打印当前路由列表
  // 重新导航到当前路由
router.replace(router.currentRoute.value.fullPath);
  // 强制刷新路由
// router.push(router.currentRoute.value.path);
};