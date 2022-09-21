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
      path: '/about',
      name: 'about',
      meta: { title: 'About page' },
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
