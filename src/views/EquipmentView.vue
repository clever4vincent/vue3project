<template>
  <div class="page">
    <van-nav-bar title="装备列表" left-text="返回" left-arrow @click-left="onClickLeft" fixed>
      <template #right>
        <van-icon name="replay" @click="onLoad" />
      </template>
    </van-nav-bar>
    <div class="container" ref="container">
      <!-- <van-tabs v-model:active="active" :sticky="true" offset-top="1.2267rem"> -->
      <!-- <van-tab title="装备背包"> -->
      <!-- <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" ref="listRef"> -->
      <!-- <van-cell title="刷新装备" center is-link @click="onLoad"></van-cell> -->
      <!-- <form action="/">
          <van-search v-model="filterWord" show-action placeholder="搜词缀" @search="onSearch" />
          <van-search v-model="filterName" show-action placeholder="搜名称" @search="onSearch" />
        </form> -->
      <div ref="search">
        <van-dropdown-menu active-color="#ee0a24">
          <van-dropdown-item v-model="equipmentFilterType" :options="option1" @change="onTypeChange" />
          <van-dropdown-item v-model="statusType" :options="option2" @change="onTypeChange" />
          <!-- <van-dropdown-item v-model="value2" :options="option2" /> -->
        </van-dropdown-menu>
        <van-cell-group :border="true" style="padding-bottom: 0.48rem">
          <div class="p-1 flex flex-wrap gap-1 text-[12px]">
            <van-checkbox v-model="needCorruptedMagics" icon-size="12px">腐化有词条</van-checkbox>
          </div>
          <van-field v-model="filterName" placeholder="搜索装备名称" autocomplete="off" />
          <van-field v-model="filterWord" placeholder="搜索词缀" autocomplete="off" />
          <van-field v-model="filterFixedWord" placeholder="搜索物品自带词缀" autocomplete="off" />
          <van-field v-model="filterLevel" placeholder="装备等级" autocomplete="off" />
          <van-field v-model="filterItemLevel" placeholder="物品等级" autocomplete="off" />
          <van-field v-if="statusType == '断裂'" v-model="filterFractured" placeholder="破裂词条等级" autocomplete="off" />
          <van-button style="margin-top: 0" size="small" plain type="danger" icon="searsh" block @click="onSearch">搜索</van-button>
          <p class="mt-1">
            <van-button size="mini" type="danger" @click="addHead">一键头盔改造</van-button
            ><van-button size="mini" type="danger" @click="addStorage">一键存储</van-button>
            <van-button size="mini" type="danger" @click="addNeck">一键项链改造</van-button>
            <van-button size="mini" type="danger" @click="addDrop">一键丢弃</van-button>
          </p>
        </van-cell-group>
      </div>

      <van-list :loading="false" :finished="true" ref="listRef" v-if="false">
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
      </van-list>
      <RecycleScroller
        ref="scroller"
        :items="list"
        :minItemSize="minItemSize"
        :style="{ height: dynamicHeight + 'px' }"
        key-field="id"
        v-slot="{ item }"
      >
        <van-cell
          ref="cell"
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
            <van-button class="delete" size="mini" plain type="danger" @click.stop="storageEquipment(item)" v-if="!item.storage">储存</van-button>
          </template>
        </van-cell>
      </RecycleScroller>
      <!-- </van-tab> -->
      <van-tab title="储存背包" v-if="false">
        <!-- <van-list v-model:loading="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2" ref="listRef2"> -->
        <van-list :loading="false" :finished="true" ref="listRef2">
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
              <van-button class="delete" size="mini" plain type="danger" @click.stop="storage(item)" v-if="!item.storage">储存</van-button>
            </template>
          </van-cell>
        </van-list></van-tab
      >
      <!-- </van-tabs> -->

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
</template>
<script setup>
import { rarityClass } from "@/lib/data";
import { useAccountStore, useTokenStore, useLoadingStore, useStore, useConditionStore } from "@/stores";
import { sell, buy, getMarket, getBackpack, storage, destroy } from "@/api";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { showDialog, showSuccessToast, showConfirmDialog } from "vant";
import { getEquipmentLocal, getEquipmentNetwork, batchProcessPromises, updateEquipmentItemLocal, removeEquipmentItemsLocal } from "@/hooks";
import { magics } from "@/lib/data";
import EquipmentDetailDialog from "@/components/EquipmentDetailDialog.vue";
import { CurrencyBeanEnum } from "@/enums/appEnum";
import { useDark } from "@vueuse/core";
import { CosmeticBrush } from "@icon-park/vue-next";
const list = ref([]);
const list2 = ref([]);
const filterWord = ref("");
const filterLevel = ref("");
const filterName = ref("");
const filterFractured = ref("");
const filterItemLevel = ref("");
const filterFixedWord = ref("");
const scroller = ref();
const minItemSize = ref(72);
const dynamicHeight = ref(500);
const cell = ref();
const container = ref();
const search = ref();
const needCorruptedMagics = ref(false);
const loading = ref(false);
const loading2 = ref(false);
const listRef = ref();
const listRef2 = ref();
const active = ref(0);
const show = ref(false);
const finished = ref(false);
const finished2 = ref(false);
const currentEquipment = ref(null);
const router = useRouter();
const options = ref([]);
const cascaderValue = ref("");
let orginList = [];
let isFisrt = true;
let isFisrt2 = true;
let page = 1;
let page2 = 1;
const maxModifyCount = 20;
const equipmentFilterType = ref("所有类型");
const statusType = ref("正常");
const value2 = ref("a");
const themeVars = reactive({
  dropdownMenuContentMaxHeight: "40%",
});

const option1 = [
  { text: "所有类型", value: "所有类型" },
  { text: "单手剑", value: "单手剑" },
  { text: "单手斧", value: "单手斧" },
  { text: "法杖", value: "法杖" },
  { text: "爪", value: "爪" },
  { text: "匕首", value: "匕首" },
  { text: "细剑", value: "细剑" },
  { text: "单手锤", value: "单手锤" },
  { text: "短杖", value: "短杖" },
  { text: "符文匕首", value: "符文匕首" },
  { text: "弓", value: "弓" },
  { text: "长杖", value: "长杖" },
  { text: "双手剑", value: "双手剑" },
  { text: "双手斧", value: "双手斧" },
  { text: "双手锤", value: "双手锤" },
  { text: "战杖", value: "战杖" },
  { text: "手套", value: "手套" },
  { text: "鞋子", value: "鞋子" },
  { text: "胸甲", value: "胸甲" },
  { text: "头部", value: "头部" },
  { text: "盾牌", value: "盾牌" },
  { text: "箭袋", value: "箭袋" },
  { text: "腰带", value: "腰带" },
  { text: "项链", value: "项链" },
  { text: "戒指", value: "戒指" },
];

const option2 = [
  { text: "正常", value: "正常" },
  { text: "断裂", value: "断裂" },
  { text: "腐化", value: "腐化" },
];

const onClickLeft = () => router.go(-1);
const accountStore = useAccountStore();

const onTypeChange = (value) => {
  // console.log(value);
  onSearch();
};
const onCancel = () => {
  show.value = false;
  cascaderValue.value = "";
};
const onConfirm = (value) => {
  show.value = false;
  cascaderValue.value = "";
  // let [characterId, token] = value.value.split("|");
  let character = value.value;
  // let [characterId, token] = value.selectedValues[1].split("|");
  startEquipmentTransfer(character.id, character.token);
};

const onLoad = async () => {
  getEquipmentNetwork({ thirdToken: accountStore.currentCharacter.token, character: accountStore.currentCharacter }).then((res) => {
    orginList = res;
    useConditionStore().equipmentModifys.forEach((item) => {
      if (!item.isModifyRunning) {
        orginList.forEach((equipment) => {
          if (item.equipment.id == equipment.id) {
            item.equipment = equipment;
          }
        });
      }
    });
    // list.value = orginList;
    // scroller?.value?.updateVisibleItems();
    onSearch();
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
      page2++;
      finished2.value = list2.value.length >= res.total;
    })
    .finally(() => {
      loading2.value = false;
    });
};
const addHead = () => {
  showConfirmDialog({
    title: "确认操作",
    message: "确定要一键头盔改造吗？",
    beforeClose: async (action) => {
      if (action === "confirm") {
        let temp = list.value.slice(0, 10);
        let content = "";
        temp.forEach((item) => {
          if (useConditionStore().equipmentModifys.filter((a) => a.equipment.id == item.id).length <= 0) {
            useConditionStore().equipmentModifys.push({
              equipment: item,
              makeType: CurrencyBeanEnum.chromaticOrb.value,
              red: 1,
              green: 1,
              blue: 2,
              retryCount: 80000,
            });
            content += item.name + "|";
            // showSuccessToast("加入改造列表成功");
          } else {
            // showSuccessToast("已经在改造列表中");
          }
        });
        showSuccessToast("加入改造列表成功" + content);
      }
      return true;
    },
  });
};
const addNeck = () => {
  showConfirmDialog({
    title: "确认操作",
    message: "确定要一键项链改造吗？",
    beforeClose: async (action) => {
      if (action === "confirm") {
        await addStorage();
        let temp = list.value.slice(0, maxModifyCount);
        let content = "";
        temp.forEach((item) => {
          if (useConditionStore().equipmentModifys.filter((a) => a.equipment.id == item.id).length <= 0) {
            useConditionStore().equipmentModifys.push({
              equipment: item,
              makeType: CurrencyBeanEnum.orbOfAlteration.value,
              conditions: useConditionStore().conditionGroups["项链单属性"],
              // 改造石
              retryCount: 80000,
              termCount: 1,
            });
            content += item.name + "|";
            // showSuccessToast("加入改造列表成功");
          } else {
            // showSuccessToast("已经在改造列表中");
          }
        });
        showSuccessToast("加入改造列表成功" + content);
      }
      return true;
    },
  });
};
const addDrop = () => {
  showConfirmDialog({
    title: "确认操作",
    message: "确定要一键丢弃吗？",
    beforeClose: async (action) => {
      if (action === "confirm") {
        let temp = list.value;
        console.log(temp);
        const pagePromises = [];
        temp.forEach((item) => {
          pagePromises.push(() => destroy(item.id));
        });
        await batchProcessPromises(pagePromises);
        //将本地的数据删除

        orginList = orginList.filter((item) => !temp.includes(item));

        await removeEquipmentItemsLocal({ thirdToken: accountStore.currentCharacter.token, character: accountStore.currentCharacter }, temp);
        list.value = [];
      }
      return true;
    },
  });
};
const addStorage = async () => {
  let temp = list.value.slice(0, maxModifyCount);
  console.log(temp);
  const pagePromises = [];
  temp.forEach((item) => {
    if (!item.storage && !item.corrupted) {
      console.log(item.id);
      pagePromises.push(() => storageEquipment(item));
    }
  });
  console.log(pagePromises);
  await batchProcessPromises(pagePromises);
};
const showDetail = (item) => {
  const itemRef = ref(item);
  // useConditionStore().equipmentModifys = [];
  showDialog({
    // title: "装备详情",
    showCancelButton: true,
    confirmButtonText: "改造",
    lockScroll: false,
    confirmButtonColor: "var(--error-color)",
    message: () => {
      return h(EquipmentDetailDialog, {
        equipment: itemRef.value,
      });
    },
  }).then(() => {
    if (useConditionStore().equipmentModifys.filter((a) => a.equipment.id == item.id).length <= 0) {
      useConditionStore().equipmentModifys.push({
        equipment: item,
        makeType: CurrencyBeanEnum.chaosOrb.value,
        openEEE: true,
        termCount: 3,
        retryCount: 80000,
      });
      showSuccessToast("加入改造列表成功");
    } else {
      showSuccessToast("已经在改造列表中");
    }

    // router.push({
    //   name: "equipmentModify",
    // });
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
const storageEquipment = async (item) => {
  await storage({ equipmentId: item.id }).then(async (res) => {
    // orginList = orginList.filter((item) => item.id != item.id);
    // console.log(orginList);
    let item1 = orginList.find((itema) => itema.id == item.id);
    item1.storage = true;
    await updateEquipmentItemLocal({ character: accountStore.currentCharacter }, toRaw(item1));

    showSuccessToast("储存成功");
  });
};
const parseList = (list) => {
  return list.map((item) => {
    item.magicsText = "";
    for (const k in item.magics) {
      item.magicsText += magics[k](item.magics[k]) + "|";
    }
    for (const k in item.fixedMagics) {
      item.magicsText += magics[k](item.fixedMagics[k]) + "|";
    }
    return item;
  });
};
const onSearch = (value) => {
  // corruptedMagics
  // console.log(value);
  let resultList = [];
  let conditions = filterWord.value.split("|");
  conditions = conditions.map((item) => {
    let result = item.split("-");
    return {
      key: result[0],
      value: result[1] || 0,
    };
  });
  if (equipmentFilterType.value == "所有类型") {
    resultList = orginList;
  } else {
    resultList = orginList.filter((item) => {
      return item.typeText == equipmentFilterType.value;
    });
  }

  if (statusType.value == "断裂") {
    resultList = resultList.filter((item) => {
      return item.isFractured;
    });
  }
  if (statusType.value == "腐化") {
    resultList = resultList.filter((item) => {
      return item.corrupted;
    });
    if (needCorruptedMagics.value) {
      resultList = resultList.filter((item) => {
        return !!item.corruptedMagics;
      });
    } else {
      resultList = resultList.filter((item) => {
        return !item.corruptedMagics;
      });
    }
  } else {
    resultList = resultList.filter((item) => {
      return !item.corrupted;
    });
  }
  if (filterFractured.value) {
    resultList = resultList.filter((item) => {
      return item.affixes.some((affix) => {
        return affix.isLocked && affix.tier == filterFractured.value;
      });
    });
  }

  if (filterFixedWord.value) {
    let conditions = filterFixedWord.value.split("-");
    let condition = {
      key: conditions[0],
      value: conditions[1] || 0,
    };
    console.log(condition);
    resultList = resultList.filter((item) => {
      // console.log(item.fixedMagicsText);
      let magicsTexts = item.fixedMagicsText.split("|");
      let isMatch = true;
      let magicsText = magicsTexts.find((item) => item.indexOf(condition.key) > -1);

      if (!magicsText) {
        isMatch = false;
        return;
      }
      let match = magicsText.match(/\d+-\d+|\d+/g);

      let numbers = match ? match.map((str) => (str.includes("-") ? str.split("-").map(Number) : Number(str))) : [];

      if (numbers.length == 1) {
        isMatch = isMatch && numbers[0] >= condition.value;
      } else if (numbers.length == 2) {
        isMatch = isMatch && numbers[1] >= condition.value;
      }

      return isMatch;
    });
  }
  // console.log(resultList);
  resultList = resultList.filter((item) => {
    // let name = item.name;
    let magicsTexts = item.magicsText.split("|");
    let isMatch = true;

    conditions.forEach((condition) => {
      let name = item.name;
      if (name.indexOf(filterName.value) > -1) {
        isMatch = isMatch && true;
      } else {
        isMatch = false;
        return;
      }

      if (filterItemLevel.value) {
        if (item.itemLevel < filterItemLevel.value) {
          isMatch = false;
          return;
        }
      }
      if (filterLevel.value) {
        if (!item.requirements) {
          isMatch = true;
        } else {
          isMatch = isMatch && item.requirements.level <= filterLevel.value;
        }
      }
      if (magicsTexts[0] == "" && !condition.key) {
        return true;
      }
      let magicsText = magicsTexts.find((item) => item.indexOf(condition.key) > -1);
      if (!magicsText) {
        isMatch = false;
        return;
      }
      let match = magicsText.match(/\d+-\d+|\d+/g);
      let numbers = match ? match.map((str) => (str.includes("-") ? str.split("-").map(Number) : Number(str))) : [];
      if (numbers.length == 1) {
        isMatch = isMatch && numbers[0] >= condition.value;
      } else if (numbers.length == 2) {
        isMatch = isMatch && numbers[1] >= condition.value;
      }
    });
    return isMatch;
    // return name.indexOf(condition[0]) > -1 && magicsText.indexOf(condition[1]) > -1;
  });
  list.value = resultList;
};
onMounted(async () => {
  await getEquipmentLocal({ thirdToken: accountStore.currentCharacter.token, character: accountStore.currentCharacter }).then((res) => {
    orginList = res;
    list.value = orginList;
  });
  // console.log(orginList);
  dynamicHeight.value = container.value.clientHeight - search.value.clientHeight; // 获取 container 的高度

  nextTick(() => {
    if (cell.value.$el.offsetHeight !== minItemSize.value) {
      minItemSize.value = cell.value.$el.offsetHeight;
    }
  });
});
onActivated(async () => {
  console.log("onActivated");
  await getEquipmentLocal({ thirdToken: accountStore.currentCharacter.token, character: accountStore.currentCharacter }).then((res) => {
    orginList = res;
    onSearch();
  });
});
onDeactivated(async () => {});
</script>

<style scoped lang="scss">
.page {
  min-height: 100%;

  height: 100%;
  // overflow: auto;
}
.container {
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  height: 100%;
  // padding-top: 46px;
}
:deep(.van-dropdown-item__content) {
  max-height: 40%;
}
// :deep(.van-cell__value) {
//   flex: 0.5;
// }
:deep(.magic) {
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
