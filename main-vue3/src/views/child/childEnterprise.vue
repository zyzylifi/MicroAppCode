<script setup>
import microApp from '@micro-zoe/micro-app'

let globalData = microApp.getGlobalData()

microApp.setData('childEnterprise', globalData)
</script>

<template>
  <div>
    <micro-app
      name="childEnterprise"
      url="http://localhost:3002/main/findEnterprise"
      iframe
    ></micro-app>
  </div>
</template>

<style></style>
