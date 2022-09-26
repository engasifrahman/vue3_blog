import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Home page' },
      component: () => import('../component/Home.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { title: 'dashboard page' },
      component: () => import('../component/Dashboard.vue')
    }
  ]
})

export default router
