<template>
  <div class="page" ref="page">
    <van-nav-bar title="影视" left-text="返回" left-arrow @click-left="onClickLeft" fixed />

    <form action="/">
      <van-search v-model="value" show-action placeholder="搜电影/电视资源" @search="onSearch" />
    </form>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item :title="`${index + 1}号厅`" :name="index" v-for="(movies, index) in movieList" :key="index">
        <div v-for="(movie, index) in Object.values(movies)" :key="index">
          <a v-for="item in movie" :key="item.id" class="p-1" @click="copyAndRedirect($event, item)">
            <p class="text-blue-500 text-base mb-1">{{ item.movieName }}</p>
            <p class="text-amber-600">{{ item.panSource }}</p>
            <p class="text-amber-600">{{ item.wangPanPassword }}</p>
          </a>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { findMovie } from "@/api";
import { showFailToast, showSuccessToast } from "vant";

const router = useRouter();
const page = ref(null);
const activeName = ref(0);
const movieList = ref([]);

const onClickLeft = () => router.go(-1);
// findSong({ singerName: `[ "齐秦" ]` }).then((res) => {
//   console.log(res);
// });
const value = ref("");
const copyAndRedirect = async (e, item) => {
  e.preventDefault();
  let psd = item.wangPanPassword.replace(/提取码：/g, "").trim();
  if (psd) {
    try {
      const copySuccessful = await copyToClipboard(psd);
      if (copySuccessful) {
        showSuccessToast("复制提取码成功!");
      } else {
        console.error("Failed to copy");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  setTimeout(() => {
    window.open(item.wangPanUrl, "_blank");
  }, 200);
};
const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      resolve(successful);
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
};
const onSearch = (val) => {
  if (!val) {
    showFailToast("请输入电影/电视名称!");
    return;
  }
  findMovie({ movieName: encodeURIComponent(val) }).then((res) => {
    movieList.value = Object.values(res);
    activeName.value = 0;
  });
};
</script>
<style scoped>
:deep(input) {
  font-size: 14px;
}
</style>
