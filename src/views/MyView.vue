<template>
  <div>
    <van-nav-bar title="我的" />
    <!-- <van-notice-bar left-icon="volume-o" :scrollable="false" background="#ecf9ff" color="#1989fa">
        <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :touchable="false"
          :show-indicators="false"
        >
          <van-swipe-item>明月直入，无心可猜。</van-swipe-item>
          <van-swipe-item>仙人抚我顶，结发受长生。</van-swipe-item>
          <van-swipe-item>今人不见古时月，今月曾经照古人。</van-swipe-item>
        </van-swipe>
      </van-notice-bar> -->
    <!-- <van-swipe :autoplay="3000" lazy-render :touchable="false">
        <van-swipe-item v-for="image in images" :key="image" @click="swipeImgClick(image)">
          <img :src="image" />
        </van-swipe-item>
      </van-swipe> -->
  </div>
</template>
<script setup>
import { onMounted } from "vue";
// const images = [
//   'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
//   'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
//   'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
//   'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
//   'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
// ]
// function swipeImgClick(image) {
//   showToast({
//     message: image
//   })
// }
onMounted(() => {
  console.log("mounted!");
});
</script>

<style></style>
