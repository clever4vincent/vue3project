<template>
  <transition :duration="550" leave-active-class="animate__animated animate__slideOutLeft">
    <div class="border-rose-600 mb-1 p-1 border-dotted border" :key="item.time">
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
      <div class="flex justify-between items-center">
        <div class="flex">
          <van-field v-model="magicValue1" placeholder="#1" :border="false" autocomplete="off" class="magicValue" />
          <van-field v-if="getFilterMatch() > 1" v-model="magicValue2" placeholder="#2" :border="false" autocomplete="off" class="magicValue" />

          <van-checkbox v-model="isMustChecked" icon-size="16px" checked-color="#e63946">必须满足</van-checkbox>
        </div>
        <van-button style="margin: 10px" size="mini" plain type="primary" @click="deleteItem">删除</van-button>
      </div>
    </div>
  </transition>
</template>

<script>
import { magics } from "@/lib/data";
export default {
  props: ["modifyPage", "index", "item"],
  emits: ["delete"], // 声明 delete 事件
  data() {
    return {};
  },
  methods: {},
  setup(props, { emit }) {
    const popover = ref(null);
    const isMustChecked = ref(false);
    const filterMagics = ref("");
    filterMagics.value = props.item?.name || "";
    const magicValue1 = ref("");
    magicValue1.value = props.item?.value1 || "";
    const magicValue2 = ref("");
    magicValue2.value = props.item?.value2 || "";
    const showPopover = ref(false);
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
    const getFilterMatch = () => {
      const matches = filterMagics.value.match(/#/g);

      return matches?.length || 0;
    };
    const getMagicText = () => {
      let matches = filterMagics.value.match(/#/g);
      let value1 = magicValue1.value || 0;
      let value2 = magicValue2.value || 0;
      let result = "";
      let value;
      if (matches) {
        if (matches.length === 1) {
          result = toRaw(filterMagics.value).replace(/#/, value1);
          value = value1;
        } else if (matches.length >= 2) {
          result = toRaw(filterMagics.value).replace(/#/, value1);
          result = result.replace(/#/, value2);
          value = value2;
        }
      }
      return { name: filterMagics.value, value, value2: magicValue2.value, value1: magicValue1.value, isMust: isMustChecked.value };
    };
    const deleteItem = () => {
      emit("delete", props.index);
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
    onMounted(() => {});
    return {
      popover,
      isMustChecked,
      filterMagics,
      showPopover,
      actions,
      magicValue1,
      magicValue2,
      onSelect,
      onFocus,
      onblur,
      onUpdate,
      deleteItem,
      onclear,
      getFilterMatch,
      getMagicText,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
.magicValue {
  width: 60px;
}
:deep(.van-checkbox__label) {
  line-height: 16px;
  --van-checkbox-label-color: var(--error-color);
}
</style>
