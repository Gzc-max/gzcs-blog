import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/Articles.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue')
  },
  {
    path: '/gojs',
    name: 'Gojs',
    component: () => import('../views/Gojs.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/Demo.vue')
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('../views/Resume.vue')
  },
  {
    path: '/interview',
    name: 'Interview',
    component: () => import('../views/Interview.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
