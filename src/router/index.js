import Blog from '@/component/Blog.vue';
import Login from '@/component/Login.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'blog',
      meta: { title: 'Blog page' },
      component: Blog,
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
      redirect: {name: "dashboard.users"},
      children: [
        {
          path: "users",
          name: "dashboard.users",
          meta: { title: 'Users' },
          component: () => import('@/component/Users.vue'),
        },

        {
          props: true,
          path: "posts/:user_id?",
          name: "dashboard.posts",
          meta: { title: 'Posts' },
          component: () => import('@/component/Posts.vue'),
        },

        {
          path: "comments",
          name: "dashboard.comments",
          meta: { title: 'Comments' },
          component: () => import('@/component/Comments.vue'),
        }
      ]
    }
  ]
})

export default router
