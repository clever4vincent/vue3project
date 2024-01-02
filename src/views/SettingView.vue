<template>
  <div class="page">
    <van-nav-bar title="设置" safe-area-inset-top fixed />

    <van-cell-group>
      <van-cell title="深色模式" center value="内容"> <van-switch center :model-value="isDark" @update:model-value="onUpdateValue" /></van-cell>
      <!-- <van-cell title="测试页面" center value="内容" is-link to="/test"></van-cell> -->

      <!-- <van-button style="margin: 10px" plain type="primary" to="/equipment">装备列表</van-button> -->
      <!-- <icon-park-currency theme="multi-color" size="24" :fill="['#333', '#2F88FF', '#FFF', '#43CCF8']" strokeLinecap="square" /> -->
    </van-cell-group>
  </div>
</template>
<script setup>
import { useThemeStore } from "../stores";
import { useDark, useToggle } from "@vueuse/core";
const themeStore = useThemeStore();
const isDark = useDark();

const toggleDark = useToggle(isDark);
// const checked = ref(themeStore.theme === "dark");
onActivated(async () => {
  console.log("setting onActivated");
});
function onUpdateValue(value) {
  toggleDark();
  // let isDark = document.documentElement.classList.contains("van-theme-dark");
  // checked.value = value;

  // if (isDark) {
  //   themeStore.toLight();
  // } else {
  //   themeStore.toDark();
  // }
}
</script>
<style scoped>
.van-switch {
  vertical-align: middle;
}

/* .van-theme-dark .van-nav-bar__content,
.van-theme-dark .van-cell-group {
  background-color: var(--vt-c-black);
  background: var(--vt-c-black);
  border: var(--vt-c-divider-dark-2);
  color: var(--vt-c-text-dark-2);
  transition: color background-color var(--vt-transition-time);
}
.van-theme-dark .van-nav-bar__title {
  color: var(--vt-c-text-dark-2);
} */
</style>
