<template>
  <div class="page" ref="page">
    <van-nav-bar title="歌词搜" left-text="返回" left-arrow @click-left="onClickLeft" fixed />

    <form action="/">
      <van-search v-model="value" show-action placeholder="根据明星搜索歌曲" @search="onSearch" @clear="onClear" />
    </form>
    <!-- <RecycleScroller
      :items="songList"
      :minItemSize="minItemSize"
      :style="{ height: dynamicHeight + 'px' }"
      key="name"
      class="recycle-list"
      key-field="song_name"
      v-slot="{ item }"
    > -->
    <van-cell-group :border="false" v-for="item in songList" :key="item._id">
      <!-- <van-cell-group> -->
      <div v-if="item.lyric && item.lyric.length > 20">
        <p class="text-center">
          <a class="text-blue-500 block-inline" target="_blank" :href="item.song_url">{{ item.song_name }}</a>
        </p>

        <van-text-ellipsis rows="5" position="start" :content="item.lyric" expand-text="展开" collapse-text="收起" class="lyric" />
      </div>
    </van-cell-group>
    <van-back-top right="10vh" bottom="10vh" style="position: absolute" />
    <!-- <div :key="item.song_name" class="text-sm max-h-10">
      {{ item.song_name }}
    </div> -->

    <!-- </RecycleScroller> -->
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { findSong } from "@/api";
import { showFailToast } from "vant";
import { nextTick } from "vue";
const router = useRouter();
const page = ref(null);

const songList = ref([]);

const onClickLeft = () => router.go(-1);
// findSong({ singerName: `[ "齐秦" ]` }).then((res) => {
//   console.log(res);
// });
const value = ref("");
const onClear = () => {
  console.log("onClear");
};
const onSearch = (val) => {
  findSong({ singerName: `[ "${val}" ]` }).then((res) => {
    // 修改歌词
    res.forEach((item) => {
      item.lyric = item.lyric?.replace(/(\\n)|(&#\d{2})/g, " ");
    });
    if (res.length === 0) {
      showFailToast("没有找到歌曲!");
    }
    nextTick(() => {
      songList.value = res;
    });
  });
};
</script>
<style scoped>
:deep(input) {
  font-size: 14px;
}
.lyric {
  padding: 15px;
  /* margin-top: 10px; */
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 1.8em;
}
</style>
