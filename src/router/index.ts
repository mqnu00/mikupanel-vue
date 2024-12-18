import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SysInfo from '../components/SysInfo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: SysInfo
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/SysInfo.vue')
  },
  {
    path: '/terminal',
    name: 'terminal',
    component: () => import(/* webpackChunkName: "about" */ '../components/WebSSH.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
