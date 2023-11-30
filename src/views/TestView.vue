<template>
  <div class="page">
    <van-nav-bar title="Test" left-text="返回" left-arrow @click-left="onClickLeft" fixed />
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { getHttpProxy } from "@/api";

const router = useRouter();
const onClickLeft = () => router.go(-1);

onMounted(async () => {
  let ipProxy = {};
  await getHttpProxy().then((data) => {
    ipProxy.host = data.ip;
    ipProxy.port = data.port;
  });

  await getHttpProxy(ipProxy).then((data) => {
    ipProxy = data;
  });
});

onActivated(async () => {
  console.log("onActivated");
});
onDeactivated(async () => {
  console.log("onDeactivated");
});
</script>
<style scoped lang="scss">
.page {
  min-height: 100%;
  // overflow: hidden;
}
</style>
