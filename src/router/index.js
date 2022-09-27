import Login from '@/component/Login.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'blog',
      meta: { title: 'Blog page' },
      component: () => import('@/component/Blog.vue'),
    },
    {
      path: "/login",
      name: "login",
      meta: { title: 'Login form' },
      component: Login,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      meta: { title: 'Dashboard' },
      component: () => import('@/component/Dashboard.vue'),
      // redirect: {path: "dashboard/users"},
      children: [
        {
          path: "users",
          name: "dashboard.users",
          meta: { title: 'Users list' },
          component: () => import('@/component/Dashboard.vue'),
        },

        {
          path: "posts",
          name: "dashboard.posts",
          meta: { title: 'Posts' },
          component: () => import('@/component/Dashboard.vue'),
        },

        {
          path: "comments",
          name: "dashboard.comments",
          meta: { title: 'Comments' },
          component: () => import('@/component/Dashboard.vue'),
        }
      ]
    }
  ]
})

export default router
