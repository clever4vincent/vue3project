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
        <!-- <KeepAlive :include="['HomeView', 'MyView', 'SettingView', 'BatchView']"> -->
        <KeepAlive :include="include">
          <component :is="Component" :key="route.name" :class="isMainRouter ? 'is-main-page' : ''" />
        </KeepAlive>

        <!-- <component v-else :is="Component" :key="route.name" /> -->
      </Transition>
    </router-view>

    <!-- </transition> -->

    <van-tabbar v-model="active" v-show="isMainRouter && !isFooterHideen" class="tab-bottom van-safe-area-bottom" route>
      <van-tabbar-item replace icon="home-o" to="/">账号</van-tabbar-item>
      <!-- <van-tabbar-item replace icon="search" to="/about">关于</van-tabbar-item> -->
      <van-tabbar-item replace icon="contact-o" to="/batch">批量操作</van-tabbar-item>
      <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>
    </van-tabbar>
    <LoadingMask ref="PageLoadingMask" :show="canShowLoading" class="page-loading-mask"></LoadingMask>
  </van-config-provider>
</template>
<script setup>
import { RouterView, useRoute } from "vue-router";
import { useDark } from "@vueuse/core";
import { useThemeStore, useLoadingStore, useRouterStore, useStore } from "./stores";
import { initUseInterval, destroyUseInterval } from "@/hooks";
import { ref } from "vue";
import { nextTick } from "vue";
import { EventBus } from "@/lib/EventBus";
const active = ref(0);
const route = useRoute();
const themeStore = useThemeStore();
const appStore = useStore();
const theme = ref("");

const loadV3Script = () => {
  return new Promise((resolve) => {
    if (typeof window.vaptcha === "function") {
      resolve();
    } else {
      const script = document.createElement("script");
      // script.src = "https://v-cn.vaptcha.com/v3.js";
      script.src = "https://turing.captcha.qcloud.com/TCaptcha.js";
      // script.src = "https://v.vaptcha.com/v3.js";
      script.async = true;
      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
          resolve();
          script.onload = script.onreadystatechange = null;
        }
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    }
  });
};
onMounted(() => {
  initUseInterval();
  // const config = {
  //   vid: "659c2e85d3784602950e6ec9",
  //   mode: "invisible",
  //   scene: 1,
  //   // container: "#btnLogin",
  //   style: "light",
  //   color: "#00BFFF",
  //   lang: "auto",
  //   area: "auto",
  // };
  loadV3Script().then(() => {
    // console.log("vaptcha", window.vaptcha);
    // window.vaptcha(config).then((vaptchaObj) => {
    //   window.vaptchaObj = vaptchaObj;
    //   vaptchaObj.render();
    //   vaptchaObj.listen("pass", () => {
    //     console.log("验证成功");
    //     EventBus.emit("vaptchaPass", true);
    //     vaptchaObj.reset();
    //   });
    //   vaptchaObj.listen("close", () => {
    //     EventBus.emit("vaptchaPass", false);
    //     vaptchaObj.reset();
    //   });
    // });
  });

  EventBus.on("validate", () => {
    try {
      // 生成一个验证码对象
      // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
      //callback：定义的回调函数
      const captcha = new TencentCaptcha(
        "196751366",
        (res) => {
          // res（用户主动关闭验证码）= {ret: 2, ticket: null}
          // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
          // res（请求验证码发生错误，验证码自动返回terror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
          // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理
          if (res.ret === 0) {
            // 复制结果至剪切板
            EventBus.emit("vaptchaPass", res);
            // login({ ticket: res.ticket, randStr: res.randstr });
          }
        },
        {
          loading: false,
          enableDarkMode: "force",
        }
      );
      // 调用方法，显示验证码
      captcha.show();
    } catch (error) {
      // 加载异常，调用验证码js加载错误处理函数
      // message.error("验证码加载异常, 请刷新重试");
      console.log(error);
      // pending.value = false;
    }
  });
});
onUnmounted(() => {
  EventBus.off("validate");
  destroyUseInterval();
  // window.vaptchaObj && window.vaptchaObj.destroy();
});
useDark({
  onChanged(dark) {
    theme.value = dark ? "dark" : "light";
  },
});
const loadingStore = useLoadingStore();

const canShowLoading = computed(() => loadingStore.loading > 0);
const isMainRouter = computed(() => useRouterStore().isMainRouter);
const isFooterHideen = computed(() => appStore.isFooterHideen);
const transitionName = computed(() => {
  return appStore.transitionName;
});
const include = ref([]);
// const include = computed(() => {
//   // 将name转换为组件名
//   let result = appStore.history
//     .map((item) => {
//       // 将home转换为HomeView
//       return item.name.replace(/^[a-z]/, (s) => s.toUpperCase()) + "View";
//     })
//     .filter((item) => item !== "TestView");
//   console.log(result);
//   return result;
// });
watch(
  () => appStore.history,
  (newHistory) => {
    // 将name转换为组件名
    let result = newHistory
      .filter((item) => item.meta.keepAlive)
      .map((item) => {
        // 将home转换为HomeView
        return item.name.replace(/^[a-z]/, (s) => s.toUpperCase()) + "View";
      });
    // 如果不包含主界面的话，就加上
    if (!result.includes("HomeView")) {
      result.push("HomeView");
    }
    if (!result.includes("BatchView")) {
      result.push("BatchView");
    }
    if (!result.includes("SettingView")) {
      result.push("SettingView");
    }

    include.value = result;
  },
  { deep: true }
);
// console.log(include);
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
