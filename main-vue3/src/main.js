import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/index.scss'
import microApp from '@micro-zoe/micro-app'
import { jobType as jobTypeArr } from '@/assets/js/dictData'
window.jobTypeArr = jobTypeArr

microApp.start({
  preFetchApps: [
    { name: 'childHome', url: 'http://localhost:3000/childHome/', level: 3 },
    { name: 'childJob', url: 'http://localhost:8080', level: 3 },
    {
      name: 'childEnterprise',
      url: 'http://localhost:3002/main/findEnterprise',
      level: 3,
      iframe: true
    }
  ],
  lifeCycles: {
    created(e, appName) {
      console.log(`子应用${appName}被创建`)
    },
    beforemount(e, appName) {
      console.log(`子应用${appName}即将渲染`)
    },
    mounted(e, appName) {
      console.log(`子应用${appName}已经渲染完成`)
    },
    unmount(e, appName) {
      console.log(`子应用${appName}已经卸载`)
    },
    error(e, appName) {
      console.log(`子应用${appName}加载出错`)
    }
  }
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
microApp.router.setBaseAppRouter(router)
app.use(ElementPlus)
app.mount('#app')
