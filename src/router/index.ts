// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
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
//   {
//     path: '/',
//     name: 'Home',
//     component: () => import('../views/terminal/index.vue')
//   }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;