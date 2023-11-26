<template>
  <div class="page">
    <van-nav-bar title="设置" safe-area-inset-top fixed />

    <van-cell-group>
      <van-cell title="夜间模式" center value="内容"> <van-switch center :model-value="checked" @update:model-value="onUpdateValue" /></van-cell>
      <van-button style="margin: 10px" plain type="primary" to="/equipment">装备列表</van-button>
    </van-cell-group>
  </div>
</template>
<script setup>
import { useThemeStore } from "../stores";

const themeStore = useThemeStore();
const checked = ref(themeStore.theme === "dark");

function onUpdateValue(value) {
  let isDark = document.documentElement.classList.contains("van-theme-dark");
  checked.value = value;

  if (isDark) {
    themeStore.toLight();
  } else {
    themeStore.toDark();
  }
}
</script>
<style scoped>
.page {
  min-height: 100vh;
  height: 100%;
}
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
