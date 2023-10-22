<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'

const images = [
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
]
function swipeImgClick(image) {
  showToast({
    message: image
  })
}
const count = ref(0)
const loading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功')
    loading.value = false
    count.value++
  }, 1000)
}
</script>

<template>
  <van-nav-bar title="首页" fixed />

  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <div class="container">
      <van-notice-bar left-icon="volume-o" :scrollable="false" background="#ecf9ff" color="#1989fa">
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
      </van-notice-bar>
      <van-swipe :autoplay="3000" lazy-render :touchable="false">
        <van-swipe-item v-for="image in images" :key="image" @click="swipeImgClick(image)">
          <img :src="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </van-pull-refresh>
</template>

<style scoped>
.container {
  min-height: calc(100vh - 96px);
  margin-top: 46px;
}
.my-swipe .van-swipe-item {
  margin-top: 20px;
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
img {
  width: 100%;
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
