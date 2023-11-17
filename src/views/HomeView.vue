<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
const characterAncillaryAccounts = [
  { name: 'a666985211', password: '123456' },
  { name: 'a666985213', password: '123456' },
  { name: 'a666985214', password: '123456' },
  { name: 'a666985215', password: '123456' },
  { name: 'a666985216', password: '123456' },
  { name: 'a666985217', password: '123456' },
  { name: 'a666985218', password: '123456' },
  { name: 'a666985219', password: '123456' },
  { name: 'a666985220', password: '123456' },
  { name: 'a666985221', password: '123456' },
  { name: 'a666985222', password: '123456' },
  { name: 'a666985223', password: '123456' },
  { name: 'a666985224', password: '123456' },
  { name: 'a666985225', password: '123456' },
  { name: 'a666985226', password: '123456' },
  { name: 'a666985227', password: '123456' },
  { name: 'a666985228', password: '123456' },
  { name: 'a666985229', password: '123456' },
  { name: 'a666985230', password: '123456' },
  { name: 'a666985231', password: '123456' },
  { name: 'a666985232', password: '123456' },
  { name: 'a6669850', password: '123456' },
  { name: 'a6669851', password: '123456' }
]
const count = ref(0)
const activeName = ref('0')
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
  <van-nav-bar title="账号" fixed />

  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <div class="container">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item title="主号" name="1">
          <van-cell title="a6669852" value="123456" />
        </van-collapse-item>

        <van-collapse-item title="小号" name="2">
          <van-cell
            v-for="item in characterAncillaryAccounts"
            :key="item.name"
            :title="item.name"
            :value="item.password"
          />
        </van-collapse-item>
      </van-collapse>
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
