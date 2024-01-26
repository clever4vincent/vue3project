<template>
  <div class="page" ref="modifyPage">
    <van-nav-bar title="装备改造" left-text="返回" left-arrow @click-left="onClickLeft" fixed>
      <template #right>
        <van-icon name="list-switch" @click="toList" />
      </template>
    </van-nav-bar>

    <div class="container">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item
          :title="item.equipment.name"
          :name="itemIndex"
          v-for="(item, itemIndex) in state.equipmentModifys"
          :key="item.id"
          :title-class="rarityClass[item.equipment.rarity]"
        >
          <div style="height: 8rem; overflow-y: auto">
            <EquipmentDetailDialog :equipment="item.equipment" />
          </div>
          <van-dropdown-menu>
            <van-dropdown-item v-model="item.makeType" :options="option1" />
          </van-dropdown-menu>
          <van-field v-model="item.termCount" type="number" label="达标条数" placeholder="请输入达标条数" :border="false" autocomplete="off">
            <template #right-icon>
              <van-checkbox
                v-if="
                  item.makeType == CurrencyBeanEnum.chaosOrb.value ||
                  item.makeType == CurrencyBeanEnum.orbOfAlteration.value ||
                  item.makeType == CurrencyBeanEnum.orbOfAlchemy.value
                "
                v-model="item.openEEE"
                icon-size="16px"
                checked-color="#e63946"
                >崇高</van-checkbox
              >
            </template>
          </van-field>
          <van-field v-model="item.retryCount" type="number" label="次数" placeholder="默认无限次" :border="false" autocomplete="off">
            <template #right-icon>
              <van-checkbox
                v-if="item.makeType == CurrencyBeanEnum.chaosOrb.value || item.makeType == CurrencyBeanEnum.orbOfAlteration.value"
                v-model="item.openMakeup"
                icon-size="16px"
                checked-color="#e63946"
                >富豪</van-checkbox
              >
            </template>
          </van-field>
          <div class="addCondition">
            <van-button style="margin: 10px" size="small" plain type="primary" @click="addCondition(item)">添加条件</van-button>
            <van-button style="margin: 10px" size="small" plain type="primary" @click="selectConditions(itemIndex)">选择条件组</van-button>
            <van-button style="margin: 10px" size="small" plain type="primary" @click="saveConditions(itemIndex)">保存当前条件</van-button>
            <van-button style="margin: 10px" size="small" type="primary" @click="startModify(itemIndex)">{{
              !item.isModifyRunning ? "开始改造" : "停止改造"
            }}</van-button>
            <van-button style="margin: 10px" size="small" type="primary" @click="linkStones(itemIndex)">{{
              !item.isLinkRunning ? "开始链接" : "停止链接"
            }}</van-button>
            <van-button style="margin: 10px" size="small" type="primary" @click="removeEquipment(itemIndex)">移除装备</van-button>
            <FilterMagicsField
              v-for="(condition, index) in item.conditions"
              :key="condition.time"
              :item="condition"
              :ref="
                (el) => {
                  if (el) filterFields[itemIndex][index] = el;
                }
              "
              :modifyPage="modifyPage"
              @delete="deleteItem(item, itemIndex, index)"
              :index="index"
            />
          </div> </van-collapse-item
      ></van-collapse>
      <van-button style="margin: 10px" size="small" plain type="primary" @click="allStart">一键开始</van-button>
      <van-button style="margin: 10px" size="small" plain type="primary" @click="allPause">一键停止</van-button>
    </div>
    <van-dialog v-model:show="showSaveDialog" title="保存当前条件" confirm-button-text="保存" :before-close="saveGroupConfirm" show-cancel-button>
      <div class="p-2">
        <van-field v-model="conditionGroupName" label="条件组名称" placeholder="请输入条件组名称" autocomplete="off" />
      </div>
    </van-dialog>
    <van-action-sheet v-model:show="showConditionGroup" title="选择条件组">
      <div class="group-content p-0 mb-2">
        <van-cell-group :border="false">
          <van-cell
            center
            title="条件组名称"
            :border="false"
            :value="item"
            is-link
            @click="selectConditionGroup(conditionGroups[item])"
            v-for="item in Object.keys(conditionGroups)"
            :key="conditionGroups[item].time"
          >
            <template #right-icon>
              <van-button size="mini" plain type="danger" @click.stop="deleteGroup(item)">删除</van-button>
            </template></van-cell
          >
        </van-cell-group>
      </div>
    </van-action-sheet>
  </div>
</template>
<!-- --van-popover-action-width -->
<script setup>
import { useRouter } from "vue-router";
import { rarityClass } from "@/lib/data";
import { CurrencyBeanEnum } from "@/enums/appEnum";
import EquipmentDetailDialog from "@/components/EquipmentDetailDialog.vue";
import FilterMagicsField from "@/components/FilterMagicsField.vue";
import { cloneDeep } from "lodash-es";
import { showConfirmDialog, showToast, showFailToast, showSuccessToast } from "vant";
import { magics } from "@/lib/data";
import { isMatchCustomAttr, doRenovation, doLockRenovation, doLinkAction } from "@/hooks";
import { useAccountStore, useTokenStore, useConditionStore, useStore } from "@/stores";
import { sleep } from "@/utils";

const modifyPage = ref(null);
const router = useRouter();
const accountStore = useAccountStore();
const onClickLeft = () => router.go(-1);
const filterMagics = ref("");

const activeName = ref("0");
const type = ref("0");
const makeType = ref("0");

const conditionGroupName = ref("");
// const filterFields = ref([[]]);
const option1 = [
  { text: "改造石", value: CurrencyBeanEnum.orbOfAlteration.value },
  { text: "混沌石", value: CurrencyBeanEnum.chaosOrb.value },
  { text: "点金石", value: CurrencyBeanEnum.orbOfAlchemy.value },
  { text: "锁后缀", value: CurrencyBeanEnum.lockBack.value },
  { text: "锁前缀", value: CurrencyBeanEnum.lockPre.value },
];
// const option2 = [
//   { text: "普通", value: "a" },
//   { text: "工艺台", value: "b" },
// ];
const conditionGroups = ref(useConditionStore().conditionGroups);
const items = ref([]);
const showConditionGroup = ref(false);
const showSaveDialog = ref(false);
const bodyWidth = ref("");
const currentEquipmentIndex = ref(0);
bodyWidth.value = document.body.clientWidth;

const state = reactive({});
state.equipment = useStore().equipmentModify;
state.equipmentModifys = useConditionStore().equipmentModifys;
const filterFields = reactive(useConditionStore().equipmentModifys.map(() => []));
const startModify = (itemIndex) => {
  //

  if (useConditionStore().equipmentModifys[itemIndex].isModifyRunning === true) {
    useConditionStore().equipmentModifys[itemIndex].isModifyRunning = false;
    return;
  }

  if (!useConditionStore().equipmentModifys[itemIndex].termCount && useConditionStore().equipmentModifys[itemIndex].termCount <= 0) {
    showFailToast("达标条数不能为空或小于0");
    return;
  }
  if (getCurrentCondition(itemIndex).length === 0) {
    showFailToast("当前条件为空");
    return;
  }
  useConditionStore().equipmentModifys[itemIndex].isModifyRunning = true;
  useConditionStore().equipmentModifys[itemIndex].makeType = state.equipmentModifys[itemIndex].makeType;
  let conditions = getCurrentCondition(itemIndex);
  useConditionStore().equipmentModifys[itemIndex].customAttrs = conditions;
  // useConditionStore().equipmentModifys[itemIndex].conditions = conditions;
  if (useConditionStore().equipmentModifys[itemIndex].isModifyRunning) {
    if (
      useConditionStore().equipmentModifys[itemIndex].makeType == CurrencyBeanEnum.lockPre.value ||
      useConditionStore().equipmentModifys[itemIndex].makeType == CurrencyBeanEnum.lockBack.value
    ) {
      doLockRenovation(useConditionStore().equipmentModifys[itemIndex], {
        thirdToken: accountStore.currentCharacter.token,
        character: accountStore.currentCharacter,
      });
    } else if (
      useConditionStore().equipmentModifys[itemIndex].makeType == CurrencyBeanEnum.orbOfAlteration.value ||
      useConditionStore().equipmentModifys[itemIndex].makeType == CurrencyBeanEnum.orbOfAlchemy.value ||
      useConditionStore().equipmentModifys[itemIndex].makeType == CurrencyBeanEnum.chaosOrb.value
    ) {
      doRenovation(
        useConditionStore().equipmentModifys[itemIndex],
        {
          customAttrs: conditions,
          termCount: useConditionStore().equipmentModifys[itemIndex].termCount,
          retryCount: useConditionStore().equipmentModifys[itemIndex].retryCount || Number.MAX_SAFE_INTEGER,
          isOpenMakeup: useConditionStore().equipmentModifys[itemIndex].openMakeup,
          isOpenEEE: useConditionStore().equipmentModifys[itemIndex].openEEE,
          type: useConditionStore().equipmentModifys[itemIndex].makeType,
        },
        { thirdToken: accountStore.currentCharacter.token, character: accountStore.currentCharacter }
      );
    }
    // doLockRenovation
  }
};

const getCurrentCondition = (itemIndex) => {
  let conditions = [];
  filterFields[itemIndex].forEach((field) => {
    let obj = field.getMagicText();
    if (obj.name) {
      conditions.push(field.getMagicText());
    }
  });
  useConditionStore().equipmentModifys[itemIndex].conditions = conditions;
  return conditions;
};
const addCondition = (item) => {
  // items.value.push({ time: new Date().getTime(), name: "", value: "", value2: "" });
  if (!item.conditions) {
    item.conditions = [];
  }
  item.conditions.push({ time: new Date().getTime(), name: "", value: "", value2: "" });
};
const toList = () => {
  router.push({
    name: "equipment",
  });
};
const allStart = async () => {
  // startModify
  // activeName.value = 1;
  // 依次触发一次界面的更新，然后开始改造
  // useConditionStore().equipmentModifys.forEach(async (item, index) => {
  //   if (item.isModifyRunning === false) {
  //     // 先触发一次界面的更新
  //     activeName.value = index;
  //     // await sleep(1000);
  //     startModify(index);
  //   }
  // });
  for (const [index, item] of useConditionStore().equipmentModifys.entries()) {
    if (item.isModifyRunning === false) {
      // 先触发一次界面的更新
      activeName.value = index;
      await sleep(200);
      startModify(index);
    }
  }
  // useConditionStore().equipmentModifys.forEach((item, index) => {
  //   if (item.isModifyRunning === false) {
  //     // 先触发一次界面的更新
  //     activeName.value = index;
  //     // startModify(index);
  //   }
  // });
};
const allPause = () => {
  useConditionStore().equipmentModifys.forEach((item, index) => {
    item.isModifyRunning = false;
  });
};
const saveConditions = (itemIndex) => {
  if (getCurrentCondition(itemIndex).length === 0) {
    showFailToast("当前条件为空");
    return;
  }
  showSaveDialog.value = true;
};
const removeEquipment = (itemIndex) => {
  showConfirmDialog({
    title: "移除装备",
    message: "确定移除该装备吗？",
  })
    .then(() => {
      // 移动前先将开始改造的装备停止
      if (useConditionStore().equipmentModifys[itemIndex].isModifyRunning) {
        useConditionStore().equipmentModifys[itemIndex].isModifyRunning = false;
      }
      useConditionStore().equipmentModifys.splice(itemIndex, 1);
      showSuccessToast("移除成功");
    })
    .catch(() => {
      // on cancel
    });
};
const linkStones = (itemIndex) => {
  let modify = useConditionStore().equipmentModifys[itemIndex];
  modify.isLinkRunning = !modify.isLinkRunning;
  if (modify.isLinkRunning) {
    doLinkAction(modify, {
      thirdToken: accountStore.currentCharacter.token,
      character: accountStore.currentCharacter,
    });
  }
};
const deleteGroup = (name) => {
  showConfirmDialog({
    title: "删除条件组",
    message: "确定删除该条件组吗？",
  })
    .then(() => {
      delete useConditionStore().conditionGroups[name];
      conditionGroups.value = useConditionStore().conditionGroups;
      showSuccessToast("删除成功");
    })
    .catch(() => {
      // on cancel
    });
};
const selectConditionGroup = (values) => {
  let result = cloneDeep(values).map((item, index) => {
    item.time = new Date().getTime() + "" + index;
    return item;
  });
  state.equipmentModifys[currentEquipmentIndex.value].conditions = result;
  filterFields[currentEquipmentIndex.value] = [];
  // items.value = result;

  showConditionGroup.value = false;
};
const saveGroupConfirm = (action) => {
  if (action === "cancel") {
    return true;
  }
  if (!conditionGroupName.value) {
    showFailToast("名称不能为空");
    return false;
  }
  useConditionStore().conditionGroups[conditionGroupName.value] = getCurrentCondition(activeName.value);

  // showSaveDialog.value = false;
  return true;
};
const selectConditions = (index) => {
  if (Object.keys(conditionGroups.value).length === 0) {
    showFailToast("当前没有条件组");
    return;
  }
  currentEquipmentIndex.value = index;
  showConditionGroup.value = true;
  // console.log(getCurrentCondition());
};
const deleteItem = (item, itemIndex, index) => {
  item.conditions.splice(index, 1);
  filterFields[itemIndex].splice(index, 1);
};
const actions = computed(() => {
  return Object.keys(magics)
    .map((key) => {
      return {
        text: magics[key]("#")
          .replace(/<div>|<\/div>/g, "")
          .replace(/undefined/, "#"),
        className: "popupText",
      };
    })
    .filter((magic) => magic.text.includes(filterMagics.value))
    .slice(0, 7);
});
onMounted(async () => {
  bodyWidth.value = document.body.clientWidth;

  // watch(
  //   () => useAccountStore().equipmentModifys,
  //   (value) => {
  //     state.equipmentModifys = value;
  //   },
  //   { deep: true }
  // );
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
  background: var(--van-cell-background);
  // overflow: hidden;
  .container {
    font-size: 12px;
    background: var(--van-cell-background);
    margin-bottom: 40px;
    .addCondition {
      :deep(.van-cell) {
        padding: 2px 12px;
      }
    }
  }
}
:deep(.popupText) {
  color: var(--magic-color);
  // --van-field-input-text-color
  width: v-bind(bodyWidth);
}
:deep(.van-field__control) {
  color: var(--magic-color);
}
:deep(.van-action-sheet__content) {
  .van-cell__value {
    text-align: left;
  }
}

// padding: var(--van-collapse-item-content-padding);
:deep(.van-popover__wrapper) {
  display: block;
}
:deep(.van-popover__content) {
  border-radius: 0;
}
</style>
