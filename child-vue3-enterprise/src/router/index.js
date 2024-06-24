import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import findEnterprise from '@/views/findEnterprise.vue'
import enterpriseDetail from '@/views/enterpriseDetail.vue'

const routes = [
  {
    path: '/main/findEnterprise',
    name: 'findEnterprise',
    component: findEnterprise,
    meta: {
      title: '',
      keepAlive:false
    }
  },
  {
    path: '/main/enterpriseDetail',
    name: 'enterpriseDetail',
    component: enterpriseDetail,
    meta: {
      title: '',
      keepAlive:false
    }
  }
]

const router = createRouter({
  history: createWebHistory(), // mode:'hash'
  routes
})

export default router