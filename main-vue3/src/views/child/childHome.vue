<script setup>
import microApp from '@micro-zoe/micro-app'
// const activeIndex = microApp.getData('childHome')
// localStorage.setItem('activeIndex', activeIndex)
const handleDataChange = (e) => {
  let { activeIndex } = e.detail.data
  localStorage.setItem('activeIndex', activeIndex)
}
</script>

<template>
  <div>
    <micro-app
      @datachange="handleDataChange"
      name="childHome"
      url="http://localhost:3000/childHome/"
      ssr
    ></micro-app>
  </div>
</template>

<style></style>
