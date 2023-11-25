<template>
  <div class="page">
    <van-nav-bar title="Test" left-text="返回" left-arrow @click-left="onClickLeft" fixed />
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const onClickLeft = () => router.go(-1);
</script>
<style scoped lang="scss">
.page {
  min-height: 100%;
  // overflow: hidden;
}
</style>
