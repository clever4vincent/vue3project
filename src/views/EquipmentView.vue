<template>
  <div class="page">
    <van-nav-bar title="装备列表" left-text="返回" left-arrow @click-left="onClickLeft" fixed />

    <div class="container">
      <div>
        <van-tabs v-model:active="active" :sticky="true" offset-top="1.2267rem">
          <van-tab title="装备背包"
            ><van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" ref="listRef">
              <van-cell
                v-for="item in list"
                :key="item.id"
                immediate-check="false"
                :title="item.name"
                is-link
                @click="showDetail(item)"
                class="equipment-item"
                :class="rarityClass[item.rarity]"
              >
                <template #right-icon>
                  <van-button class="delete" size="mini" plain type="danger" @click.stop="moveEquipment(item)">转移</van-button>
                </template>
              </van-cell>
            </van-list></van-tab
          >
          <van-tab title="储存背包"
            ><van-list v-model:loading="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2" ref="listRef2">
              <van-cell
                v-for="item in list2"
                :key="item.id"
                immediate-check="false"
                :title="item.name"
                is-link
                @click="showDetail(item)"
                class="equipment-item"
                :class="rarityClass[item.rarity]"
              >
                <template #right-icon>
                  <van-button class="delete" size="mini" plain type="danger" @click.stop="moveEquipment(item)">转移</van-button>
                </template>
              </van-cell>
            </van-list></van-tab
          >
        </van-tabs>

        <!-- <van-popup v-model:show="show" round position="bottom">
          <van-picker title="请选择目标角色" :columns="options" @confirm="onConfirm" @cancel="onCancel" swipe-duration="300" />
        </van-popup> -->
        <van-popup v-model:show="show" round position="bottom">
          <van-cascader
            v-model="cascaderValue"
            active-color="#ee0a24"
            title="请选择目标角色"
            :options="options"
            @close="onCancel"
            @finish="onConfirm"
          />
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script setup>
import { rarityClass } from "@/lib/data";
import { useAccountStore, useTokenStore } from "@/stores";
import { sell, buy, getMarket } from "@/api";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { showDialog, showSuccessToast } from "vant";
import EquipmentDetailDialog from "@/components/EquipmentDetailDialog.vue";
const list = ref([]);
const list2 = ref([]);
const loading = ref(false);
const loading2 = ref(false);
const listRef = ref();
const listRef2 = ref();
const cascaderValue = ref("");
const active = ref(0);
const show = ref(false);
const finished = ref(false);
const finished2 = ref(false);
const currentEquipment = ref(null);
const router = useRouter();
const options = ref([]);
let isFisrt = true;
let isFisrt2 = true;
let page = 1;
let page2 = 1;
import { getBackpack } from "@/api";

const onClickLeft = () => router.go(-1);
const accountStore = useAccountStore();

const onCancel = () => {
  show.value = false;
  cascaderValue.value = "";
};
const onConfirm = (value) => {
  show.value = false;
  cascaderValue.value = "";
  let [characterId, token] = value.value.split("|");
  // let [characterId, token] = value.selectedValues[1].split("|");
  startEquipmentTransfer(characterId, token);
};

const onLoad = () => {
  // 异步更新数据
  if (page == 1 && !isFisrt) {
    loading.value = false;
    return;
  }
  isFisrt = false;
  getBackpack(page)
    .then((res) => {
      list.value = list.value.concat(res.items);
      page++;
      finished.value = list.value.length >= res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const onLoad2 = () => {
  // 异步更新数据
  if (page2 == 1 && !isFisrt2) {
    loading2.value = false;
    return;
  }
  isFisrt2 = false;
  getBackpack(page2, { storage: true })
    .then((res) => {
      list2.value = list2.value.concat(res.items);
      page++;
      finished2.value = list2.value.length >= res.total;
    })
    .finally(() => {
      loading2.value = false;
    });
};
const showDetail = (item) => {
  showDialog({
    // title: "装备详情",
    message: () => {
      return h(EquipmentDetailDialog, {
        equipment: item,
      });
    },
  });
};
const startEquipmentTransfer = (characterId, token) => {
  let equipment = currentEquipment.value;
  // 当前的角色上架物品，然后将Token切换成选择的角色，再购买物品，购买物品后，再切回Token.
  // 上架物品后会生成一个物品的市场ID，这个ID是唯一的，所以需要获取市场物品，通过物品的ID来确定是哪个物品，然后根据物品的市场ID来购买物品

  sell(equipment.id, { 4: 1 }).then((res) => {
    // 上架成功后，切换角色
    useTokenStore().setToken(token);
    // 购买物品
    getMarket().then((res) => {
      let marketId = res.items.find((item) => item.equipmentId == equipment.id).id;
      buy(marketId).then(() => {
        // 购买成功后，切换回原来的角色
        useTokenStore().setToken(accountStore.currentCharacter.token);
        // 从list中删除上架的物品
        list.value = list.value.filter((item) => item.id != equipment.id);
        list2.value = list2.value.filter((item) => item.id != equipment.id);
        showSuccessToast("转移成功");
      });
    });
  });
};

const moveEquipment = (item) => {
  // router.push({
  //   name: "test",
  // });
  //记录当前装备
  currentEquipment.value = item;
  let result = accountStore.getOtherAccountTokenInfoOptions();
  options.value = result;

  show.value = true;
};

onMounted(async () => {});
onActivated(async () => {
  console.log("onActivated");
});
onDeactivated(async () => {});
</script>

<style scoped lang="scss">
.page {
  min-height: 100%;

  height: 100%;
  // overflow: auto;
}
// .container {
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   height: 100vh;
//   padding-top: 46px;
// }
:deep(.van-cell__value) {
  flex: 0.5;
}
:deep(.magics) {
  color: var(--magic-color) !important;
}
:deep(.rare) {
  color: var(--rare-color) !important;
}
:deep(.unique) {
  color: var(--unique-color) !important;
}
.equipment-item {
  padding: 20px;
}
</style>
