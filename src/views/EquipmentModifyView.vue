<template>
  <div class="page" ref="modifyPage">
    <van-nav-bar title="装备改造" left-text="返回" left-arrow @click-left="onClickLeft" fixed />
    <div class="container">
      <EquipmentDetailDialog :equipment="equipment" />
      <div class="condition"></div>
      <div>
        <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" trigger="manual" :teleport="modifyPage">
          <template #reference>
            <van-field
              v-model="filterMagics"
              placeholder="词缀"
              autocomplete="off"
              clearable
              @focus="onFocus"
              @update:model-value="onUpdate"
              @blur="onblur"
              @clear="onclear"
            />
          </template>
        </van-popover>
      </div>
      <van-button style="margin: 10px" size="small" plain type="primary">开始改造</van-button>
    </div>
  </div>
</template>
<!-- --van-popover-action-width -->
<script setup>
import { useRouter } from "vue-router";
import EquipmentDetailDialog from "@/components/EquipmentDetailDialog.vue";
import { magics } from "@/lib/data";
import { useAccountStore, useTokenStore, useLoadingStore, useStore } from "@/stores";
const modifyPage = ref(null);
const router = useRouter();
const onClickLeft = () => router.go(-1);
const filterMagics = ref("");
const showPopover = ref(false);
const bodyWidth = ref("");
bodyWidth.value = document.body.clientWidth;

const equipment = computed(() => useStore().equipmentModify);
// const actions = [
//   { text: "选项一", className: "popupText" },
//   { text: "选项二", className: "popupText" },
//   { text: "选项三", className: "popupText" },
// ];
const onSelect = (action) => {
  filterMagics.value = action.text;
};
const onFocus = () => {
  showPopover.value = true;
};
const onblur = () => {
  showPopover.value = false;
};
const onUpdate = () => {
  showPopover.value = true;
};
const onclear = () => {
  setTimeout(() => {
    showPopover.value = true;
  }, 50);
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
  // popupText
  bodyWidth.value = document.body.clientWidth;
  // console.log("bodyWidth", bodyWidth.value);
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
  // overflow: hidden;
  .container {
    font-size: 12px;
    background: var(--van-cell-background);
  }
}
:deep(.popupText) {
  width: v-bind(bodyWidth);
}
:deep(.van-popover__wrapper) {
  display: block;
}
:deep(.van-popover__content) {
  border-radius: 0;
}
</style>
