import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main/login',
      name: 'login',
      component: () => import('@/views/main/login.vue'),
      meta: {
        title: '',
        keepAlive: false
      }
    },
    {
      path: '/main/childDemo',
      name: 'childDemo',
      component: () => import('@/views/child/childDemo.vue'),
      meta: {
        title: '',
        keepAlive: false
      }
    },
    {
      path: '/main/childHome',
      name: 'childHome',
      component: () => import('@/views/child/childHome.vue'),
      meta: {
        title: '',
        keepAlive: false
      }
    },
    {
      path: '/main/childJob',
      name: 'childJob',
      component: () => import('@/views/child/childJob.vue'),
      meta: {
        title: '',
        keepAlive: false
      }
    },
    {
      path: '/main/childEnterprise',
      name: 'childEnterprise',
      component: () => import('@/views/child/childEnterprise.vue'),
      meta: {
        title: '',
        keepAlive: false
      }
    },
    {
      path: '/main/childAbout',
      name: 'childAbout',
      component: () => import('@/views/child/childAbout.vue'),
      meta: {
        title: '',
        keepAlive: false
      }
    }
  ]
})

export default router
