import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/blog/index.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'post',
    component: () => import('@/views/post/index.vue'),
    props: true,
  },
  {
    path: '/about',
    redirect: { name: 'home' },
  },
  {
    path: '/notes/:pathMatch(.*)*',
    redirect: { name: 'blog' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/notFound/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
