// // src/router/index.ts
// import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/terminal',
//     name: 'Terminal',
//     component: () => import('../views/terminal/TerminalView.vue')
//   },
//   {
//     path: '/file',
//     name: 'FileManager',
//     component: () => import('../views/fileManager/FileManager.vue')
//   },
// //   {
// //     path: '/',
// //     name: 'Home',
// //     component: () => import('../views/terminal/index.vue')
// //   }
// ];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// });

// export default router;

// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { generateDynamicRoutes } from './dynamicRoutes';

const routes: RouteRecordRaw[] =  [
    {
      path: '/terminal',
      name: 'Terminal',
      component: () => import('../views/terminal/TerminalView.vue')
    },
    {
      path: '/file',
      name: 'FileManager',
      component: () => import('../views/fileManager/FileManager.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../../dist/plugins/FileManager/FileManager.js')
    },
  //   {
  //     path: '/',
  //     name: 'Home',
  //     component: () => import('../views/terminal/index.vue')
  //   }
  ];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const initDynamicRoutes = () => {
  const wsUrl = 'ws://192.168.177.129:8000/RouterConfig';
  const socket = new WebSocket(wsUrl);
  socket.onopen = () => {
    console.log('路由设置open')
  }
  socket.onmessage = (ev: any) => {
    if (ev.data) {
      console.log(ev.data)
      generateDynamicRoutes(JSON.parse(ev.data)["routes"])
    }
  }
};
// initDynamicRoutes()
export default router;