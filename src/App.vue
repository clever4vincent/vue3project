<template>
  <van-config-provider :theme="theme" theme-vars-scope="global" class="page-root">
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

    <router-view v-slot="{ Component }">
      <Transition :name="transitionName">
        <KeepAlive :include="['home']">
          <component :is="Component" :key="route.name" :name="route.name" :class="isMainRouter ? 'is-main-page' : ''" />
        </KeepAlive>

        <!-- <component v-else :is="Component" :key="route.name" /> -->
      </Transition>
    </router-view>

    <!-- </transition> -->

    <van-tabbar v-model="active" v-show="isMainRouter" class="tab-bottom van-safe-area-bottom" route>
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
import { useDark } from "@vueuse/core";
import { useThemeStore, useLoadingStore, useRouterStore, useStore } from "./stores";
import { ref } from "vue";
import { nextTick } from "vue";

const active = ref(0);
const route = useRoute();
const themeStore = useThemeStore();
const appStore = useStore();
const theme = ref("");

useDark({
  onChanged(dark) {
    theme.value = dark ? "dark" : "light";
  },
});
const loadingStore = useLoadingStore();

const canShowLoading = computed(() => loadingStore.loading > 0);
const isMainRouter = computed(() => useRouterStore().isMainRouter);
const transitionName = computed(() => {
  // nextTick(() => {
  console.log("transitionName", appStore.transitionName);
  return appStore.transitionName;
  // });
});
</script>

<style lang="scss">
// 页眉高度 2.048rem
$art-header-height: 44px;
// 页眉背景
$art-header-bgc: #fafafa;
// $art-header-bgc: $body-bgc;
// 状态栏高度
$app-status-bar-height: 20px;
// 状态栏高度和
$app-status-bar-art-header-height: calc(#{$art-header-height} + #{$app-status-bar-height});
$-app-status-bar-art-header-height: calc(-#{$art-header-height} - #{$app-status-bar-height});
// iPhoneX 的状态栏高度
$iphonex-status-bar-height: 40px;
// iPhoneX 的状态栏高度和
$iphonex-status-bar-art-header-height: calc(#{$art-header-height} + #{$iphonex-status-bar-height});
$-iphonex-status-bar-art-header-height: calc(-#{$art-header-height} - #{$iphonex-status-bar-height});

$art-footer-nav-height: 52px;
// iPhoneX 的底部安全高度
$iphonex-footer-safe-height: 34px;
$iphonex-art-footer-nav-height: calc(#{$art-footer-nav-height} + #{$iphonex-footer-safe-height});
//-------------------- ios 适配 --------------------//
@mixin fix-ios-status-bar-page($status-bar-height: $iphonex-status-bar-height, $status-bar-header-height: $iphonex-status-bar-art-header-height) {
  & > div > .art-page {
    & > .art-header {
      background-origin: border-box;
      border-top: $status-bar-height solid transparent; //height: $status-bar-header-height;
      & > .nav-list-wrapper {
        //top: $status-bar-header-height;
        top: $art-header-height;
      }
    }
  }
}

// 沉浸式且非本地环境
html.immersive.non-local {
  .art-root {
    @include fix-ios-status-bar-page($app-status-bar-height, $app-status-bar-art-header-height);
  }
}
html.ios.wechat {
  // 给容器设置一个底边距，增加底部安全高度
  %iphonex-padding-bottom {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    // padding-bottom: $iphonex-footer-safe-height;
  }
  %iphonex-border-bottom {
    border-bottom: constant(safe-area-inset-bottom) solid transparent;
    border-bottom: env(safe-area-inset-bottom) solid transparent;
    // border-bottom: $iphonex-footer-safe-height solid transparent;
  }
  // 给容器附加一个后置伪元素，增加底部安全高度
  %iphonex-bottom-pad {
    //padding-bottom: $iphonex-footer-safe-height;
    &:after {
      content: " ";
      clear: both;
      display: block;
      height: $iphonex-footer-safe-height;
    }
  }
  // 沉浸式
  &.immersive {
    .art-root {
      @include fix-ios-status-bar-page;
    }
  }
  .page-root {
    // @include fix-ios-status-bar-page;
    bottom: $iphonex-art-footer-nav-height;

    // 当前页面不包含页脚的，都需要增加底部安全高度的伪元素
    &:not(.is-mainpage) {
      & > div > .art-page {
        //> .art-body {
        //  @extend %content-bottom-pad
        //}
        > div.art-page-footer {
          @extend %iphonex-border-bottom;
          &:empty + .art-body {
            & > .art-body-scroller {
              & > .art-body-content {
                @extend %iphonex-bottom-pad;
              }
            }
          }
        }
      }
    }
  }
  .page {
    &.is-main-page {
      .container {
        padding-bottom: $iphonex-art-footer-nav-height;
      }
    }
  }

  .tab-bottom {
    /* prettier-ignore */
    max-width: 768PX;
    @extend %iphonex-border-bottom;
  }
  // 给容器附加一个后置伪元素，增加底部安全高度
  .iphonex-bottom-pad {
    @extend %iphonex-bottom-pad;
  }
  // 给容器设置一个底边距，增加底部安全高度
  .iphonex-bottom-padding {
    @extend %iphonex-padding-bottom;
  }
}

.page-root {
  // @include fix-ios-status-bar-page;
  position: absolute;
  top: 0;
  bottom: 0;
  left: auto;
  right: auto;

  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .tab-bottom {
    /* prettier-ignore */
    max-width: 768PX;
    margin: auto;
    left: auto;
    right: auto;
  }
}

.page {
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  margin: auto;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  width: 100%;
  height: 100%;

  // padding-top: var(--van-nav-bar-height);var(--van-nav-bar-height)
  padding-top: 46px;
  .van-popup {
    /* prettier-ignore */
    max-width: 768PX;
    // background: transparent;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
  .van-nav-bar {
    /* prettier-ignore */
    max-width: 768PX;
    margin: 0 auto;
    left: 0;
    right: 0;
  }

  &.is-main-page {
    .container {
      padding-bottom: $art-footer-nav-height;
    }
  }
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
