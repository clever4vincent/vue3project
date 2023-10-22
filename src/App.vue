<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { store } from './stores/store'
const active = ref(0)
// const themeVars = ref(document.body.classList.contains('theme-dark')? 'dark' : 'light')

const theme = ref(store.theme)
</script>

<template>
  <van-config-provider :theme="theme">
    <RouterView />
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item replace icon="search" to="/about">关于</van-tabbar-item>
      <van-tabbar-item replace icon="friends-o" to="/my">好友</van-tabbar-item>
      <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
</template>

<style>
/* 夜间模式 */

 .theme-dark .van-tabbar-item {
  background-color: var(--vt-c-black);
  color: var(--vt-c-text-dark-2);
  transition:
    color 0.5s,
    background-color 0.5s;
}
.theme-dark .van-tabbar-item--active {
  color: var(--van-tabbar-item-active-color) ;
}
 

</style>
