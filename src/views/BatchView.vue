<template>
  <div class="page">
    <van-nav-bar title="批量操作" safe-area-inset-top fixed />
    <div class="container">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="批量账号列表" name="1">
          <van-button style="margin-right: 12px" size="small" plain type="primary" @click="toggleAll" class=":f">反选</van-button>
          <van-button style="margin-right: 8px" size="small" plain type="primary" @click="checkAll">全选</van-button>
          <van-checkbox-group v-model="checkedResult" ref="checkboxGroup" @change="checkedResultChange">
            <van-grid :border="false" :column-num="3" :center="false" class="text-xs">
              <van-grid-item v-for="item in allAccount" :key="item.username">
                <van-checkbox :name="item.username" icon-size="16px">{{ item.username }}</van-checkbox>
              </van-grid-item>
            </van-grid>
          </van-checkbox-group>
          <!-- <van-checkbox v-model="isCheckAll" :indeterminate="isIndeterminate" @change="checkAllChange"> 全选 </van-checkbox> -->
        </van-collapse-item>
      </van-collapse>
      <van-popover v-model:show="showPopover" theme="dark" :actions="actions" @select="onSelect" :offset="[24, 8]">
        <template #reference>
          <van-button style="margin: 10px" size="small" type="primary">装备选项</van-button>
        </template>
      </van-popover>
      <van-popover v-model:show="showInitPopover" theme="dark" :actions="initActions" @select="onInitSelect">
        <template #reference>
          <van-button style="margin: 10px" size="small" type="primary">初始选项</van-button>
        </template>
      </van-popover>
      <van-cell title="无尽集中地角色" :value="endlessGarmentCharacterName" is-link @click="showEquipAction(ACTION_TYPE.ENDLESSGARMENT)"></van-cell>
      <van-cell title="戒指集中地角色" :value="ringCharacterName" is-link @click="showEquipAction(ACTION_TYPE.RING)"></van-cell>
      <van-cell title="鞋子集中地角色" :value="shoeCharacterName" is-link @click="showEquipAction(ACTION_TYPE.SHOE)"></van-cell>
      <van-cell title="手套集中地角色" :value="gloveCharacterName" is-link @click="showEquipAction(ACTION_TYPE.GLOVE)"></van-cell>

      <van-button style="margin: 10px" plain size="small" type="primary" @click="showPicker = true">切换地图</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="showDialogOptions('UPDATE_STONE')">升级衣服技能石</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="showDialogOptions('DESTROY_ALL')">丢弃所有装备</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="showDialogOptions('SYCN_TREE')">同步当前角色天赋</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="showFilterJson = true">同步过滤规则</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="showSkillJson = true">同步天赋JSON</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="tokenCheck">token状态验证</van-button>
      <van-button style="margin: 10px" plain size="small" type="primary" @click="sendMessage">发送轮询等级</van-button>
      <!-- <van-button style="margin: 10px" plain size="small" type="primary" @click="getEndlessGarment">获取无尽</van-button> -->
      <!-- <van-button style="margin: 10px" plain type="primary" @click="showDialogOptions('INIT_CURRENCY')">获取初始通货</van-button> -->
    </div>
    <van-action-sheet
      v-model:show="showAction"
      :actions="actionsEquip"
      cancel-text="取消"
      :title="`${ACTION_TYPE[currentActionType + '_TEXT']}`"
      close-on-click-action
      @select="onEquipSelect"
      @open="open"
      @close="close"
    />
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
    <van-popup v-model:show="showCharacter" round position="bottom" @open="open" @close="close">
      <van-cascader
        v-model="cascaderValue"
        active-color="#ee0a24"
        title="请选择目标角色"
        :options="options"
        @close="onCharacterCancel"
        @finish="onCharacterConfirm"
      />
    </van-popup>
  </div>
</template>
<script setup>
import { useLoadingStore, useAccountStore, useStore } from "@/stores";
import { skilltree } from "@/lib/data";
import { showConfirmDialog, showToast, showFailToast, showSuccessToast } from "vant";
import {
  getAllMap,
  chooseMap,
  updateSkilltree,
  destroyAll,
  getSkillTree,
  addGoodsRule,
  getBackpack,
  getMarket,
  equip,
  getCharacterInfo,
} from "@/api";
import { EventBus } from "@/lib/EventBus";
import {
  upgradeAllStoneOnEquipment,
  updateSkilltreeComb,
  buySkillStone,
  Character,
  getEquipmentList,
  startEquipmentTransfer,
  getTokenInfo,
} from "@/hooks";
import { onMounted } from "vue";
import { nextTick } from "vue";
import { onDeactivated } from "vue";

const ACTION_TYPE = {
  ENDLESSGARMENT: "ENDLESSGARMENT",
  ENDLESSGARMENT_TEXT: "无尽集中地",
  RING: "RING",
  RING_TEXT: "戒指集中地",
  SHOE: "SHOE",
  SHOE_TEXT: "鞋子集中地",
  GLOVE: "GLOVE",
  GLOVE_TEXT: "手套集中地",
};
const DIALOG_TYPE = {
  DESTROY_ALL: "destroyAll",
  DESTROY_ALL_TEXT: "丢弃所有装备",
  UPDATE_STONE: "updateStone",
  UPDATE_STONE_TEXT: "升级技能石",
  SYCN_TREE: "sycnTree",
  SYCN_TREE_TEXT: "同步当前角色天赋",
  EQUIP_HELMET: "equipHelmet",
  EQUIP_HELMET_TEXT: "装备头盔",
  EQUIP_AMULET: "equipAmulet",
  EQUIP_AMULET_TEXT: "装备项链",
  EQUIP_GLOVE: "equipGlove",
  EQUIP_GLOVE_TEXT: "装备手套",
  EQUIP_SHOE: "equipShoe",
  EQUIP_SHOE_TEXT: "装备鞋子",
  EQUIP_BELT: "equipBelt",
  EQUIP_BELT_TEXT: "装备腰带",
  EQUIP_RING: "equipRing",
  EQUIP_RING_TEXT: "装备戒指",
  EQUIP_WEAPON: "equipWeapon",
  EQUIP_WEAPON_TEXT: "装备武器",
  EQUIP_ALL: "equipAll",
  EQUIP_ALL_TEXT: "装备所有",
  INIT_ALL: "initAll",
  INIT_ALL_TEXT: "初始处理",
  INIT_STONE: "initStone",
  INIT_STONE_TEXT: "初始宝石",
  INIT_CURRENCY: "initCurrency",
  INIT_CURRENCY_TEXT: "初始通货",
};
const skillStoneList = [
  "Multistrike_Support",
  "Sweep",
  "Faster_Attacks_Support",
  "Melee_Physical_Damage_Support",
  "Increased_Critical_Strikes_Support",
  "Haste",
];
const accountStore = useAccountStore();
const activeNames = ref(["0"]);
const filterJson = ref(`[{"rarity":3},{"rarity":4}]`);
const skillJson = ref("");
let currentActionType;
// const currentActionType = ref("");
const showPicker = ref(false);
const showFilterJson = ref(false);
const showSkillJson = ref(false);
const checkedResult = ref([]);
const columns = accountStore.getMapListOptions() || [];
const checkboxGroup = ref(null);
const showPopover = ref(false);
const showInitPopover = ref(false);
const showCharacter = ref(false);
const showAction = ref(false);
const options = ref([]);
const cascaderValue = ref("");
const endlessGarmentCharacterName = ref("");
const ringCharacterName = ref("");
const shoeCharacterName = ref("");
const gloveCharacterName = ref("");
// 通过 actions 属性来定义菜单选项
const actions = [
  { text: "所有", value: "EQUIP_ALL" },
  { text: "头盔", value: "EQUIP_HELMET" },
  { text: "武器", value: "EQUIP_WEAPON" },
  { text: "项链", value: "EQUIP_AMULET" },
  { text: "手套", value: "EQUIP_GLOVE" },
  { text: "鞋子", value: "EQUIP_SHOE" },
  { text: "腰带", value: "EQUIP_BELT" },
  { text: "戒指", value: "EQUIP_RING" },
];
const initActions = [
  { text: "所有", value: "INIT_ALL" },
  { text: "初始宝石", value: "INIT_STONE" },
  { text: "初始通货", value: "INIT_CURRENCY" },
];
const actionsEquip = [
  { name: "收集装备", value: "collectEquip" },
  { name: "获取装备", value: "getEquip" },
  { name: "选择集中点角色", value: "selectCharacter" },
];
const showEquipAction = (type) => {
  showAction.value = true;
  currentActionType = type;
};
const onSelect = (action) => {
  showPopover.value = false;
  showDialogOptions(action.value);
};
const onInitSelect = (action) => {
  showInitPopover.value = false;
  showDialogOptions(action.value);
};
const onEquipSelect = (action) => {
  showAction.value = false;
  // if (currentActionType == ACTION_TYPE.ENDLESSGARMENT) {
  if (action.value == "selectCharacter") {
    // 选择角色
    showCharacter.value = true;
    options.value = accountStore.getAllAccountTokenInfoOptions();
  } else if (action.value == "collectEquip") {
    collectEquipment();
  } else if (action.value == "getEquip") {
    getEquipment(currentActionType);
  }

  // showDialogOptions(action.value);
};
const allAccount = computed(() => {
  return useAccountStore().getAllAccountTokenInfo();
});
const sendMessage = () => {
  EventBus.emit("startQueryLevelThread");
};
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

const collectEquipment = () => {
  accountStore.batchAccountsOperation((thirdToken) => {
    if (currentActionType == ACTION_TYPE.ENDLESSGARMENT) {
      Character.findEndlessGarment(thirdToken);
    } else if (currentActionType == ACTION_TYPE.RING) {
      Character.findRing(thirdToken);
    } else if (currentActionType == ACTION_TYPE.SHOE) {
      Character.findShoe(thirdToken);
    } else if (currentActionType == ACTION_TYPE.GLOVE) {
      Character.findGlove(thirdToken);
    }
  });
};
const getEquipment = async (actionType) => {
  let sellCharacter;
  let query = {};
  if (actionType == ACTION_TYPE.ENDLESSGARMENT) {
    sellCharacter = accountStore.endlessGarmentCharacter;
    query = { type: 17045651456, rarity: 4 };
  } else if (actionType == ACTION_TYPE.RING) {
    sellCharacter = accountStore.ringCharacter;
    query = { keyword: "英灵", type: 562949953421312, rarity: 4 };
  } else if (actionType == ACTION_TYPE.SHOE) {
    sellCharacter = accountStore.shoeCharacter;
    query = { type: 132120576, rarity: 4 };
  } else if (actionType == ACTION_TYPE.GLOVE) {
    sellCharacter = accountStore.gloveCharacter;
    query = { keyword: "意识", type: 2064384, rarity: 4 };
  }

  let sellToken = sellCharacter.token;
  if (!sellToken) {
    showFailToast("请先选择装备集中地角色");
    return;
  }
  let list = await getEquipmentList(query, sellToken);

  accountStore.batchAccountsOperation(async ({ thirdToken }) => {
    // return Character.findEndlessGarment(thirdToken);
    if (list.length === 0) {
      console.log("没有装备了");
      return;
    }
    if (sellToken === thirdToken) {
      console.log("不能自己给自己转移装备");
      return;
    }

    await startEquipmentTransfer({ sellToken, buyToken: thirdToken, equipment: list[0] });
    if (actionType == ACTION_TYPE.ENDLESSGARMENT) {
      await Character.insertStoneToEndlessGarment(skillStoneList, { thirdToken }, list[0]);
    }
    // await Character.insertStoneToEndlessGarment(skillStoneList, { thirdToken }, list[0]);
    await equip(list[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
    list.shift();
  }, false);
};
const getCurrency = async () => {
  let accounts = useAccountStore().getAllAccountTokenInfo();
  // 找到角色为t20的账号
  let account = accounts.find((item) => item.username == "a666985211");

  let buyCharacter = account.tokenInfo.characters[2];
  let buyToken = buyCharacter.token;
  await accountStore.batchAccountsOperation(async ({ thirdToken }) => {
    let result = [];
    await getBackpack(1, {}, { thirdToken }).then((data) => {
      result = data.items;
    });
    if (!result) {
      console.log("没有装备了");
      return;
    }
    await startEquipmentTransfer({ sellToken: thirdToken, buyToken, equipment: result[0], price: { 8: 5, 10: 1, 4: 4 } });
  });
};
const getEndlessGarment = async () => {
  getEquipment(ACTION_TYPE.ENDLESSGARMENT);
  // let sellCharacter = accountStore.endlessGarmentCharacter;
  // let sellToken = sellCharacter.token;
  // if (!sellToken) {
  //   showFailToast("请先选择无尽集中地角色");
  //   return;
  // }
  // let list = await getEquipmentList({ type: 17045651456, rarity: 4 }, sellToken);

  // accountStore.batchAccountsOperation(async ({ thirdToken }) => {
  //   // return Character.findEndlessGarment(thirdToken);
  //   if (list.length === 0) {
  //     console.log("没有装备了");
  //     return;
  //   }
  //   if (sellToken === thirdToken) {
  //     console.log("不能自己给自己转移装备");
  //     return;
  //   }

  //   await startEquipmentTransfer({ sellToken, buyToken: thirdToken, equipment: list[0] });
  //   await Character.insertStoneToEndlessGarment(skillStoneList, { thirdToken }, list[0]);
  //   await equip(list[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
  //   list.shift();
  // }, false);
};

const swtichMap = async (value) => {
  // 批量操作所有账号选择地图
  await accountStore.batchAccountsOperation((thirdToken) => {
    return chooseMap(value, thirdToken);
  });
  showSuccessToast("切换地图成功");
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
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_HELMET) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipHelmet(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_AMULET) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipAmulet(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_GLOVE) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipGlove(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_SHOE) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipShoe(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_BELT) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipBelt(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_RING) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipRing(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_WEAPON) {
          accountStore.batchAccountsOperation((thirdToken) => {
            return Character.equipWeapon(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.EQUIP_ALL) {
          accountStore.batchAccountsOperation(async (thirdToken) => {
            await Character.equipWeapon(thirdToken);
            await Character.equipRing(thirdToken);
            await Character.equipBelt(thirdToken);
            await Character.equipShoe(thirdToken);
            await Character.equipGlove(thirdToken);
            await Character.equipAmulet(thirdToken);
            await Character.equipHelmet(thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.INIT_ALL) {
          await initCharacterAll();
          showSuccessToast("初始处理成功");
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.INIT_STONE) {
          // 购买初始宝石
          await accountStore.batchAccountsOperation(async (thirdToken) => {
            await buySkillStone(skillStoneList, thirdToken);
          });
        } else if (DIALOG_TYPE[type] === DIALOG_TYPE.INIT_CURRENCY) {
          // 获取通货
          await getCurrency();
        }
      }
      return true;
    },
  });
};
const initCharacterAll = async () => {
  // 获取通货
  await getCurrency();
  // 购买初始宝石
  await accountStore.batchAccountsOperation(async (thirdToken) => {
    await buySkillStone(skillStoneList, thirdToken);
  });
  // 获取无尽
  // await getEndlessGarment();
  await getEquipment(ACTION_TYPE.ENDLESSGARMENT);
  await getEquipment(ACTION_TYPE.SHOE);
  await getEquipment(ACTION_TYPE.GLOVE);
  // 选择地图 1_1_3a
  await accountStore.batchAccountsOperation(async (thirdToken) => {
    await chooseMap("1_1_3a", thirdToken);
  });
  await accountStore.batchAccountsOperation(async (thirdToken) => {
    //[{rarity:3},{rarity:4}]
    await addGoodsRule([{ rarity: 3 }, { rarity: 4 }], thirdToken);
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
const onCharacterCancel = () => {
  showCharacter.value = false;
  cascaderValue.value = "";
};
const onCharacterConfirm = (value) => {
  showCharacter.value = false;
  cascaderValue.value = "";
  let character = value.value;
  if (currentActionType == ACTION_TYPE.ENDLESSGARMENT) {
    accountStore.endlessGarmentCharacter = character;
    endlessGarmentCharacterName.value = character.name;
  } else if (currentActionType == ACTION_TYPE.RING) {
    accountStore.ringCharacter = character;
    ringCharacterName.value = character.name;
  } else if (currentActionType == ACTION_TYPE.SHOE) {
    accountStore.shoeCharacter = character;
    shoeCharacterName.value = character.name;
  } else if (currentActionType == ACTION_TYPE.GLOVE) {
    accountStore.gloveCharacter = character;
    gloveCharacterName.value = character.name;
  }

  // console.log(value.value.name);
  // let [characterId, token] = value.value.split("|");
  // let [characterId, token] = value.selectedValues[1].split("|");
  // startEquipmentTransfer(characterId, token);
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
  // filterJson.value = "";
};
const tokenCheck = () => {
  accountStore.refreshAllAccountTokenInfo();
};
watch(
  () => accountStore.getBatchAccounts,
  (value) => {
    checkedResult.value = value || [];
  },
  { deep: true }
);
// [{"rarity":3},{"rarity":4}]
onMounted(() => {
  EventBus.on("initCharacterAll", async () => {
    console.log("initCharacterAll");
    await initCharacterAll();
    // showSuccessToast("初始化成功");
  });
  // 初始化选中的账号
  checkedResult.value = accountStore.getBatchAccounts || [];

  // 初始化集中地角色
  endlessGarmentCharacterName.value = accountStore.endlessGarmentCharacter.name;
  ringCharacterName.value = accountStore.ringCharacter.name;
  shoeCharacterName.value = accountStore.shoeCharacter.name;
  gloveCharacterName.value = accountStore.gloveCharacter.name;
  // 初始化地图
  if (accountStore.getMapListOptions().length === 0) {
    getAllMap().then((res) => {
      res && accountStore.setMapList(res);
    });
  }
  // 每天刷新一次token,如果accountStore.tokenDate不等于今天则刷新
  // accountStore.refreshAllAccountTokenInfo();
  if (accountStore.tokenDate !== new Date().toLocaleDateString()) {
    if (accountStore.refreshAllAccountTokenInfo()) {
      accountStore.setTokenDate(new Date().toLocaleDateString());
    }
  }
});
onUnmounted(() => {
  console.log("onUnmounted");
  EventBus.off("initCharacterAll");
});
</script>

<style scoped>
:deep(.skill) {
  padding: 0 30px;
}
:deep(.van-grid-item__content) {
  padding: 8px 0;
}
:deep(.first-skill) {
  margin: 0.5rem 0;
}
</style>
