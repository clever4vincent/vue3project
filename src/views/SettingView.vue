<template>
  <van-nav-bar title="设置" safe-area-inset-top/>  

  <van-cell-group>
    <van-cell title="夜间模式" center value="内容"> <van-switch center :model-value="checked" @update:model-value="onUpdateValue"/></van-cell>
  </van-cell-group>
</template>
<script setup>

import { ref} from 'vue'
import { store } from '../stores/store'
import {getPrefersColorScheme,getTheme} from '../utils/theme'
import { showToast } from 'vant';

const checked = ref(getTheme() === 'dark' || (getTheme() === 'auto' && getPrefersColorScheme() === 'dark'))

function onUpdateValue (value)  {
  // document.body.
  // let isDark = getTheme() === 'dark' || (getTheme() === 'auto' && getPrefersColorScheme() === 'dark')
  let isDark = document.body.classList.contains('theme-dark')
  checked.value = value
  showToast({
    message: '切换成功',
  });

  if (isDark) {
    document.body.classList.remove('theme-dark')
    store.toLight()
    localStorage.setItem('theme', 'light')
 
  } else {
    document.body.classList.add('theme-dark')
    store.toDark()
    localStorage.setItem('theme', 'dark')
 
  }
};

</script>
<style>
.van-switch {
  vertical-align: middle;
}

.theme-dark .van-nav-bar__content,
.theme-dark .van-cell {
  background-color:var(--vt-c-black);
  background:var(--vt-c-black);
  border: var(--vt-c-divider-dark-2);
  color:var(--vt-c-text-dark-2);
  transition:
    color 0.5s,
    background-color 0.5s;

}
.theme-dark .van-nav-bar__title {
  color:var(--vt-c-text-dark-2);
}


</style>
