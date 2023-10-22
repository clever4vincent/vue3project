<template>
  <div>
    <van-nav-bar title="关于" fixed/>
    <div>
      <!-- <img v-for="(img, index) in imageList" v-lazy="img" :key="index" /> -->
      <van-image
        width="100%"
        height="auto"
        v-for="(img, index) in imageList" :src="img" :key="index" lazy-load
      />
    </div>
  </div>
</template>
<script setup>
import { showToast } from 'vant';
import { onMounted } from 'vue';
const imageList = [
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
]
onMounted(() => {
  // console.log('mounted!');
  showToast({
    message: '请求网络数据!'
  })
});
</script>
<style>
img {
  max-width: 100%;
}
</style>
