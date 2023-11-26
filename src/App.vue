<template>
  <van-config-provider :theme="themeStore.theme" theme-vars-scope="global">
    <!-- <keep-alive :include="('home', 'setting')">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName">
  
          <div :key="route.name">
            <component :is="Component"></component>
          </div>
     
        </transition>
      </router-view>
    </keep-alive> -->
    <!-- <keep-alive>
      <router-view />
    </keep-alive> -->

    <!-- <transition :name="transitionName"> -->

    <div>
      <router-view v-slot="{ Component }">
        <transition :name="transitionName">
          <KeepAlive include="home,equipment">
            <component :is="Component" :key="route.name" :name="route.name" />
          </KeepAlive>
        </transition>

        <!-- <component :is="Component" :key="route.name" v-if="!route.meta.keepAlive" /> -->
      </router-view>
    </div>
    <!-- </transition> -->

    <van-tabbar v-model="active" v-show="isMainRouter" route>
      <van-tabbar-item replace icon="home-o" to="/">账号</van-tabbar-item>
      <!-- <van-tabbar-item replace icon="search" to="/about">关于</van-tabbar-item>
      <van-tabbar-item replace icon="friends-o" to="/my">好友</van-tabbar-item> -->
      <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>
    </van-tabbar>
    <LoadingMask ref="PageLoadingMask" :show="canShowLoading" class="page-loading-mask"></LoadingMask>
  </van-config-provider>
</template>
<script setup>
import { RouterView, useRoute } from "vue-router";

import { useThemeStore, useLoadingStore, useRouterStore, useStore } from "./stores";
import { equip } from "./api";

const active = ref(0);
const route = useRoute();
const themeStore = useThemeStore();
const appStore = useStore();
const loadingStore = useLoadingStore();

const canShowLoading = computed(() => loadingStore.loading > 0);
const isMainRouter = computed(() => useRouterStore().isMainRouter);
const transitionName = computed(() => {
  return appStore.transitionName;
});
</script>

<style>
.page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: #000;
  padding-top: 46px;
}
.router-view {
  position: relative;
}

.slide-right-enter {
  /* transform: translateX(200%); */
}
.slide-right-enter-active {
  transform: translateX(100%);
  transition: all 0.5s ease;
}
.slide-right-enter-to {
  transform: translateX(0%);
}

/* .slide-right-enter-active {
  transform: translateX(0%);
  transition: all 0.5s ease;
}
.slide-right-enter-to {
  transform: translateX(100%);
} */

.slide-right-leave {
  transform: translateX(0%);
}
.slide-right-leave-active {
  transition: all 0.5s ease;
  /* transform: translateX(100%); */
}
.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-left-enter {
  /* transform: translateX(0%);
  z-index: 2; */
}
.slide-left-enter-active {
  transform: translateX(-100%);
  transition: all 0.5s ease;
}
.slide-left-enter-to {
  transform: translateX(0%);
}
.slide-left-leave {
  /* transform: translateX(100%); */
}
.slide-left-leave-active {
  transform: translateX(100%);
  transition: all 0.5s ease;
}
.slide-left-leave-to {
  transform: translateX(200%);
}

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
