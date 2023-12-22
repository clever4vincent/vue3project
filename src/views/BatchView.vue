<template>
  <div class="page">
    <van-nav-bar title="批量操作" safe-area-inset-top fixed />
    <div class="container">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="批量账号列表" name="1">
          <van-button style="margin: 10px" plain type="primary" @click="toggleAll" class=":f">反选</van-button>
          <van-button style="margin: 10px" plain type="primary" @click="checkAll">全选</van-button>
          <van-checkbox-group v-model="checkedResult" ref="checkboxGroup" @change="checkedResultChange">
            <van-grid :border="false" :column-num="3" :center="false" class="text-xxs">
              <van-grid-item v-for="item in allAccount" :key="item.username">
                <van-checkbox :name="item.username">{{ item.username }}</van-checkbox>
              </van-grid-item>
            </van-grid>
          </van-checkbox-group>
          <!-- <van-checkbox v-model="isCheckAll" :indeterminate="isIndeterminate" @change="checkAllChange"> 全选 </van-checkbox> -->
        </van-collapse-item>
      </van-collapse>
      <van-button style="margin: 10px" plain type="primary" @click="showPicker = true">切换地图</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="showDialogOptions('UPDATE_STONE')">升级衣服技能石</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="showDialogOptions('DESTROY_ALL')">丢弃所有装备</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="showDialogOptions('SYCN_TREE')">同步当前角色天赋</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="showFilterJson = true">同步过滤规则</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="showSkillJson = true">同步天赋JSON</van-button>
    </div>
    <van-action-sheet v-model:show="showFilterJson" title="导入过滤JSON" @open="open" @close="close">
      <van-field v-model="filterJson" placeholder="导入过滤JSON" type="textarea" rows="8" autosize :border="false" />
      <div class="flex justify-around mb-2">
        <van-button plain type="primary" @click="addGoodsRuleConfirm">确认</van-button>
      </div>
    </van-action-sheet>
    <van-action-sheet v-model:show="showSkillJson" title="导入技能JSON" @open="open" @close="close">
      <van-field v-model="skillJson" placeholder="导入技能JSON" type="textarea" rows="8" autosize :border="false" class="skill" />
      <div class="flex justify-around mb-1 mt-1">
        <van-button plain type="primary" @click="skillJson = ''">清空</van-button>
        <van-button plain type="primary" @click="sycnTree(skillJson)">确认</van-button>
      </div>
      <div class="flex justify-between mb-2 space-y-2 flex-wrap px-2">
        <van-button plain type="primary" class="first-skill" @click="skillJson = JSON.stringify(skilltree.passives20)">导入20</van-button>
        <van-button plain type="primary" @click="skillJson = JSON.stringify(skilltree.passives40)">导入40</van-button>
        <van-button plain type="primary" @click="skillJson = JSON.stringify(skilltree.passives50)">导入50</van-button>
        <van-button plain type="primary" @click="skillJson = JSON.stringify(skilltree.passives60)">导入60</van-button>
        <van-button plain type="primary" @click="skillJson = JSON.stringify(skilltree.passives86)">导入86</van-button>
      </div>

      <div class="flex justify-start mb-2"></div>
    </van-action-sheet>
    <van-popup v-model:show="showPicker" round position="bottom" @open="open" @close="close">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
  </div>
</template>
<script setup>
import { useLoadingStore, useAccountStore, useStore } from "@/stores";
import { skilltree } from "@/lib/data";
import { showConfirmDialog, showToast, showFailToast, showSuccessToast } from "vant";
import { getAllMap, chooseMap, updateSkilltree, destroyAll, getSkillTree, addGoodsRule } from "@/api";
import { upgradeAllStoneOnEquipment, updateSkilltreeComb } from "@/hooks";
import { onMounted } from "vue";
import { nextTick } from "vue";
import { onDeactivated } from "vue";
const DIALOG_TYPE = {
  DESTROY_ALL: "destroyAll",
  DESTROY_ALL_TEXT: "丢弃所有装备",
  UPDATE_STONE: "updateStone",
  UPDATE_STONE_TEXT: "升级技能石",
  SYCN_TREE: "sycnTree",
  SYCN_TREE_TEXT: "同步当前角色天赋",
};
const accountStore = useAccountStore();
const activeNames = ref(["0"]);
const filterJson = ref("");
const skillJson = ref("");
const showPicker = ref(false);
const showFilterJson = ref(false);
const showSkillJson = ref(false);
let checkedResult = ref([]);
const columns = accountStore.getMapListOptions() || [];
const checkboxGroup = ref(null);
const allAccount = computed(() => {
  return useAccountStore().getAllAccountTokenInfo();
});

const checkAll = () => {
  checkboxGroup.value.toggleAll(true);
};
const toggleAll = () => {
  checkboxGroup.value.toggleAll();
};
/***************修复ios z-index************** */
const open = () => {
  useStore().setIsFooterHideen(true);
};
const close = () => {
  useStore().setIsFooterHideen(false);
};
/***************修复ios z-index************** */
const checkedResultChange = (value) => {
  accountStore.setBatchAccounts(value);
};

const swtichMap = (value) => {
  // 批量操作所有账号选择地图
  accountStore.batchAccountsOperation((thirdToken) => {
    return chooseMap(value, thirdToken);
  });
};
const showDialogOptions = (type) => {
  showConfirmDialog({
    title: "温馨提示",
    message: `确认${DIALOG_TYPE[type + "_TEXT"]}吗？`,
    beforeClose: async (action) => {
      if (action === "confirm") {
        if (DIALOG_TYPE[type] === DIALOG_TYPE.DESTROY_ALL) {
          accountStore.batchAccountsOperation(destroyAll);
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.SYCN_TREE) {
          sycnTree();
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.UPDATE_STONE) {
          accountStore.batchAccountsOperation(upgradeAllStoneOnEquipment);
        }
      }
      return true;
    },
  });
};

const sycnTree = (skillJson) => {
  showSkillJson.value = false;
  if (skillJson) {
    try {
      const skillJsonObj = JSON.parse(skillJson);

      if (skillJsonObj.length) {
        accountStore.batchAccountsOperation((thirdToken) => {
          return updateSkilltreeComb(skillJsonObj, thirdToken);
        });
      }
    } catch (error) {
      showFailToast("JSON格式错误");
    }
    return;
  }

  getSkillTree().then((res) => {
    if (res.skills) {
      accountStore.batchAccountsOperation((thirdToken) => {
        return updateSkilltreeComb(res.skills, thirdToken);
      });
    }
  });
};

const onConfirm = ({ selectedOptions }) => {
  showPicker.value = false;
  swtichMap(selectedOptions[0].value);
};

const addGoodsRuleConfirm = () => {
  try {
    const filterJsonObj = JSON.parse(filterJson.value);
    if (filterJsonObj.length) {
      accountStore.batchAccountsOperation((thirdToken) => {
        return addGoodsRule(filterJsonObj, thirdToken);
      });
    }
  } catch (error) {
    showFailToast("JSON格式错误");
  }

  showFilterJson.value = false;
  filterJson.value = "";
};
// [{"rarity":3},{"rarity":4}]
onMounted(() => {
  checkedResult.value = accountStore.getBatchAccounts || [];
  if (accountStore.getMapListOptions().length === 0) {
    getAllMap().then((res) => {
      res && accountStore.setMapList(res);
    });
  }
  // 每天刷新一次token,如果accountStore.tokenDate不等于今天则刷新

  if (accountStore.tokenDate !== new Date().toLocaleDateString()) {
    if (accountStore.refreshAllAccountTokenInfo()) {
      accountStore.setTokenDate(new Date().toLocaleDateString());
    }
  }
});
</script>

<style scoped>
:deep(.skill) {
  padding: 0 30px;
}
:deep(.first-skill) {
  margin: 0.5rem 0;
}
</style>
