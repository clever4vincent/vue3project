<template>
    <van-config-provider :theme="themeStore.theme" theme-vars-scope="global">
        <RouterView />
        <van-tabbar v-model="active" route>
            <van-tabbar-item replace icon="home-o" to="/">账号</van-tabbar-item>
            <!-- <van-tabbar-item replace icon="search" to="/about">关于</van-tabbar-item>
      <van-tabbar-item replace icon="friends-o" to="/my">好友</van-tabbar-item> -->
            <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>
        </van-tabbar>
        <LoadingMask ref="PageLoadingMask" :show="canShowLoading" class="page-loading-mask"></LoadingMask>
    </van-config-provider>
</template>
<script setup>
import { RouterView } from "vue-router";
import { useStore, useLoadingStore } from "./stores";
const active = ref(0);
const themeStore = useStore();
const loadingStore = useLoadingStore();
const canShowLoading = computed(() => loadingStore.loading > 0);
</script>

<style>
/* @import '@/assets/scss/base.scss'; */
/* 夜间模式 */
/* .van-theme-dark .van-tabbar .van-tabbar--fixed {
  background-color: var(--vt-c-black);
  color: var(--vt-c-text-dark-2);
  transition: color background-color var(--vt-transition-time);
}
.van-theme-dark .van-tabbar-item--active {
  color: var(--van-tabbar-item-active-color);
} */
</style>
