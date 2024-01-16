<template>
  <div class="page" ref="modifyPage">
    <van-nav-bar title="装备改造" left-text="返回" left-arrow @click-left="onClickLeft" fixed />
    <div class="container">
      <div style="height: 8rem; overflow-y: auto">
        <EquipmentDetailDialog :equipment="state.equipment" />
      </div>

      <!-- <van-cell-group> -->
      <van-field v-model="termCount" type="number" label="达标条数" placeholder="请输入达标条数" :border="false" autocomplete="off" />
      <van-field v-model="retryCount" type="number" label="次数" placeholder="默认无限次" :border="false" autocomplete="off" />
      <!-- </van-cell-group> -->
      <div class="addCondition">
        <van-button style="margin: 10px" size="small" plain type="primary" @click="addCondition()">添加条件</van-button>
        <van-button style="margin: 10px" size="small" plain type="primary" @click="selectConditions()">选择条件组</van-button>
        <van-button style="margin: 10px" size="small" plain type="primary" @click="saveConditions()">保存当前条件</van-button>
        <van-button style="margin: 10px" size="small" plain type="primary" @click="startModify">{{
          !useStore().isModifyRunning ? "开始改造" : "停止改造"
        }}</van-button>
      </div>

      <FilterMagicsField
        v-for="(item, index) in items"
        :key="item.time"
        :item="item"
        ref="filterFields"
        :modifyPage="modifyPage"
        @delete="deleteItem"
        :index="index"
      />
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
import { CurrencyBeanEnum } from "@/enums/appEnum";
import EquipmentDetailDialog from "@/components/EquipmentDetailDialog.vue";
import FilterMagicsField from "@/components/FilterMagicsField.vue";
import { cloneDeep } from "lodash-es";
import { showConfirmDialog, showToast, showFailToast, showSuccessToast } from "vant";
import { magics } from "@/lib/data";
import { isMatchCustomAttr, doRenovation } from "@/hooks";
import { useAccountStore, useTokenStore, useConditionStore, useStore } from "@/stores";
const modifyPage = ref(null);
const router = useRouter();
const accountStore = useAccountStore();
const onClickLeft = () => router.go(-1);
const filterMagics = ref("");
const termCount = ref("");
const retryCount = ref("");
const conditionGroupName = ref("");
const filterFields = ref([]);
const conditionGroups = ref(useConditionStore().conditionGroups);
const items = ref([]);
const showConditionGroup = ref(false);
const showSaveDialog = ref(false);
const bodyWidth = ref("");
bodyWidth.value = document.body.clientWidth;

const state = reactive({});
state.equipment = useStore().equipmentModify;
//
// const actions = [
//   { text: "选项一", className: "popupText" },
//   { text: "选项二", className: "popupText" },
//   { text: "选项三", className: "popupText" },
// ];
const startModify = () => {
  //
  if (useStore().isModifyRunning === true) {
    useStore().isModifyRunning = false;
    return;
  }
  if (!termCount.value && termCount.value <= 0) {
    showFailToast("达标条数不能为空或小于0");
    return;
  }
  if (getCurrentCondition().length === 0) {
    showFailToast("当前条件为空");
    return;
  }
  useStore().isModifyRunning = true;
  // 保存当前条件
  useConditionStore().currentGroup = getCurrentCondition();
  useConditionStore().currentRetry = retryCount.value;
  useConditionStore().currentTermCount = termCount.value;

  let conditions = getCurrentCondition();

  if (useStore().isModifyRunning) {
    doRenovation(
      state.equipment,
      {
        customAttrs: conditions,
        termCount: termCount.value,
        retryCount: retryCount.value || Number.MAX_SAFE_INTEGER,
        isOpenMakeup: true,
        type: CurrencyBeanEnum.orbOfAlteration.value,
      },
      { thirdToken: accountStore.currentCharacter.token, character: accountStore.currentCharacter }
    );
  }
  // doRenovation(equipment, { customAttrs, type, termCount, isOpenMakeup, retryCount }, thirdToken)
  // console.log(isMatchCustomAttr(equipment.value, conditions, termCount.value));
  // isMatchCustomAttr
};
const getCurrentCondition = () => {
  let conditions = [];
  filterFields.value.forEach((field) => {
    let obj = field.getMagicText();
    if (obj.name) {
      conditions.push(field.getMagicText());
    }
  });
  return conditions;
};
const addCondition = () => {
  items.value.push({ time: new Date().getTime(), name: "", value: "", value2: "" });
};
const saveConditions = () => {
  if (getCurrentCondition().length === 0) {
    showFailToast("当前条件为空");
    return;
  }
  showSaveDialog.value = true;
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
  items.value = cloneDeep(values);
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
  // getCurrentCondition()
  useConditionStore().conditionGroups[conditionGroupName.value] = getCurrentCondition();
  console.log(useConditionStore().conditionGroups);
  // showSaveDialog.value = false;
  return true;
};
const selectConditions = () => {
  if (Object.keys(conditionGroups.value).length === 0) {
    showFailToast("当前没有条件组");
    return;
  }
  showConditionGroup.value = true;
  // console.log(getCurrentCondition());
};
const deleteItem = (index) => {
  items.value.splice(index, 1);
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

  // 初始化数据
  if (useConditionStore().currentGroup.length > 0) {
    items.value = cloneDeep(useConditionStore().currentGroup);
    termCount.value = useConditionStore().currentTermCount;
    retryCount.value = useConditionStore().currentRetry;
  }
  watch(
    () => useStore().equipmentModify,
    (value) => {
      state.equipment = value;
    },
    { deep: true }
  );
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
    :deep(.van-cell) {
      padding: 2px 12px;
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
:deep(.van-cell__value) {
  text-align: left;
}

:deep(.van-popover__wrapper) {
  display: block;
}
:deep(.van-popover__content) {
  border-radius: 0;
}
</style>
