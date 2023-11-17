<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from './stores'
const active = ref(0)
const themeStore = useThemeStore()
</script>

<template>
  <van-config-provider :theme="themeStore.theme" theme-vars-scope="global">
    <RouterView />
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace icon="home-o" to="/">账号</van-tabbar-item>
      <!-- <van-tabbar-item replace icon="search" to="/about">关于</van-tabbar-item>
      <van-tabbar-item replace icon="friends-o" to="/my">好友</van-tabbar-item> -->
      <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
</template>

<style>
/* 夜间模式 */

.van-theme-dark .van-tabbar .van-tabbar--fixed {
  background-color: var(--vt-c-black);
  color: var(--vt-c-text-dark-2);
  transition: color background-color var(--vt-transition-time);
}
.van-theme-dark .van-tabbar-item--active {
  color: var(--van-tabbar-item-active-color);
}
</style>
