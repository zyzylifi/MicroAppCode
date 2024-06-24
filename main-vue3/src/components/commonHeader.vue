<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import loginApi from '@/api/loginApi'
import microApp from '@micro-zoe/micro-app'
const cacheIndex = localStorage.getItem('activeIndex')
const activeIndex = ref(cacheIndex || 'home')
const router = useRouter()
const globalData = microApp.getGlobalData()
const { proxy } = getCurrentInstance()

const handleSelect = (e) => {
  switch (e) {
    case 'home':
      router.push({ name: 'childHome' })
      break
    case 'job':
      router.push({ name: 'childJob' })
      break
    case 'enterprise':
      router.push({ name: 'childEnterprise' })
      break
    case 'about':
      router.push({ name: 'childAbout' })
      break
  }
}

function logout() {
  loginApi.logout({}).then((res) => {
    const { success, messsage } = res
    if (success) {
      microApp.clearGlobalData()
      proxy.$message.success('退出成功')
      router.go(0)
    } else {
      proxy.$message.error(messsage)
    }
  })
}
</script>

<template>
  <div class="common-header">
    <el-menu
      :default-active="activeIndex"
      background-color="#202329"
      text-color="#ffffff"
      mode="horizontal"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <span class="logo">DOSS直聘</span>
      <el-menu-item index="home">首页</el-menu-item>
      <el-menu-item index="job">找工作</el-menu-item>
      <el-menu-item index="enterprise">找企业</el-menu-item>
      <el-menu-item index="about">关于我们</el-menu-item>
      <el-button
        round
        plain
        size="small"
        v-if="globalData && globalData.token"
        class="login-btn"
        @click="logout"
        >退出</el-button
      >
      <el-button
        round
        plain
        size="small"
        v-else
        class="login-btn"
        @click="() => router.push({ name: 'login' })"
        >登录</el-button
      >
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.common-header {
  background-color: #202329;
  .el-menu {
    display: flex;
    margin: 0 auto;
    width: 1200px;
    border: none;
    padding-left: 200px;
    .el-menu-item {
      height: 46px;
    }
  }
  .login-btn {
    position: absolute;
    right: 15px;
    top: 12px;
    width: 80px;
  }
  .logo {
    color: #ffd04b;
    font-size: 24px;
    font-weight: bold;
    position: absolute;
    line-height: 24px;
    left: 15px;
    top: 10px;
    cursor: pointer;
  }
}
</style>
