<template>
  <div class="page">
    <van-nav-bar title="账号" fixed />
    <!-- <div style="height: 46px"></div> -->
    <!-- <van-pull-refresh v-model="loading" @refresh="onRefresh" :disabled="pullRefreshDisabled"> -->
    <div class="container">
      <!-- <div style="height: 20px"></div> -->
      <!-- <van-sticky :offset-top="'22px'"> -->
      <van-cell-group inset class="current-character">
        <van-cell title="当前角色" :value="currentCharacter.name || '未选择'" :class="changeClass" />
      </van-cell-group>
      <!-- </van-sticky> -->

      <van-collapse v-model="activeName" accordion>
        <van-collapse-item title="主号" name="1">
          <van-cell class="account" :title="mainAccount?.username" :value="mainAccount?.password" v-if="mainAccount?.username" />
          <van-cell
            class="character"
            :key="character.id"
            :title="character.name"
            v-for="character in mainAccount?.tokenInfo.characters"
            :border="false"
          >
            <template #right-icon>
              <van-button
                v-if="character.id !== currentCharacter.id"
                class="delete"
                size="mini"
                plain
                type="success"
                @click="selectCharacter(character, mainAccount)"
                >选择角色</van-button
              >
              <van-tag v-else color="#ffe1e1" text-color="#ad0000">当前角色</van-tag>
              <van-button
                class="delete"
                size="mini"
                plain
                :type="character.cantTransfer ? 'danger' : 'success'"
                @click="switchCantTransfer(character)"
                >{{ character.cantTransfer ? "不可被转移通货" : "可被转移通货" }}</van-button
              >
              <!-- <van-button v-else class="delete" size="mini" plain type="primary">已选择</van-button> -->
            </template>
          </van-cell>
        </van-collapse-item>

        <van-collapse-item title="小号" name="2">
          <van-cell-group :border="false" class="group">
            <transition-group
              :duration="450"
              leave-active-class="animate__animated animate__slideOutLeft"
              enter-active-class="animate__animated animate__slideInRight"
              tag="div"
            >
              <RecycleScroller
                ref="scroller"
                :items="characterAncillaryAccounts"
                :minItemSize="minItemSize"
                :style="{ height: dynamicHeight + 'px' }"
                key="name"
                key-field="username"
                v-slot="{ item }"
              >
                <!-- <van-cell-group :border="true" v-for="item in characterAncillaryAccounts" :key="item.username"> -->

                <van-cell-group ref="cellGroup" :border="true" :key="item.username">
                  <van-cell class="account" :title="item.username" :value="item.password">
                    <template #right-icon>
                      <van-button class="delete" size="mini" plain type="danger" @click="deleteAccount(item)">删除</van-button>
                    </template></van-cell
                  >

                  <van-cell
                    class="character"
                    :key="character.id"
                    :title="character.name"
                    v-for="character in item.tokenInfo.characters"
                    :border="false"
                  >
                    <template #right-icon>
                      <van-button
                        v-if="character.id !== currentCharacter.id"
                        class="delete"
                        size="mini"
                        plain
                        type="success"
                        @click="selectCharacter(character, item)"
                        >选择角色</van-button
                      >
                      <van-tag v-else color="#ffe1e1" text-color="#ad0000">当前角色</van-tag>
                      <van-button
                        class="delete"
                        size="mini"
                        plain
                        :type="character.cantTransfer ? 'danger' : 'success'"
                        @click="switchCantTransfer(character)"
                        >{{ character.cantTransfer ? "不可被转移通货" : "可被转移通货" }}</van-button
                      >
                    </template>
                  </van-cell>
                </van-cell-group>
              </RecycleScroller>
            </transition-group>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <!-- <div style="display: flex; flex-direction: row; justify-content: space-between; margin: 10px"> -->
      <van-button style="margin: 10px" plain type="primary" icon="plus" @click="addSubAccount">添加小号</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="updateMainAccount">更新主号</van-button>
      <van-button style="margin: 10px" plain type="primary" icon="plus" @click="addMultipleSubAccount">批量添加小号</van-button>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider>
      <van-button style="margin: 10px" plain type="primary" @click="deleteAllAccounts">删除所有账号</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="deleteSubAccounts">删除所有小号</van-button>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider>
      <van-button style="margin: 10px" plain type="primary" @click="ShowTransferAllCurrencies">转移所有通货到当前角色</van-button>
      <van-button style="margin: 10px" plain type="primary" @click="ShowTransferCurrenciesTo">当前角色通货转移</van-button>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider>
      <van-button style="margin: 10px" plain type="primary" @click="toEquipment">装备列表</van-button>
    </div>
    <!-- <van-popup v-model:show="show" round position="bottom">
      <van-picker title="请选择目标角色" :columns="options" @confirm="onConfirm" @cancel="onCancel" swipe-duration="300" />
    </van-popup> -->
    <van-popup v-model:show="show" round position="bottom">
      <van-cascader v-model="cascaderValue" active-color="#ee0a24" title="请选择目标角色" :options="options" @close="onCancel" @finish="onConfirm" />
    </van-popup>
  </div>

  <!-- </van-pull-refresh> -->
</template>
<script setup>
import { useLoadingStore, useAccountStore, useTokenStore } from "@/stores";
import { getCurrency, sell, buy, getMarket, getBackpack } from "@/api";
import { showConfirmDialog, showToast, showSuccessToast, showFailToast, showDialog, Toast } from "vant";
import { DialogModeEnum } from "@/enums/appEnum";
import AccountAddDialog from "@/components/AccountAddDialog.vue";
import { useRouter } from "vue-router";
import { onActivated, onDeactivated, ref, watch, h } from "vue";
import { nextTick } from "vue";

// const pullRefreshDisabled = ref(true);
const activeName = ref("0");
const minItemSize = ref(180);
const dynamicHeight = ref(400);
const show = ref(false);
const loadingStore = useLoadingStore();
const accountStore = useAccountStore();
const tokenStore = useTokenStore();
const scroller = ref();
const cellGroup = ref();
const loading = ref(false);
const router = useRouter();
const dialogRef = ref(null);
const mode = ref("");
const isChange = ref(false);
const cascaderValue = ref("");
const options = ref([]);
const changeClass = computed(() => {
  return isChange.value ? "animate__animated animate__bounce" : "";
});

const mainAccount = computed(() => useAccountStore().getMainAccount);
const characterAncillaryAccounts = computed(() => {
  // itemsUpdateTime = new Date().getMilliseconds();
  nextTick(() => {
    scroller?.value?.updateVisibleItems();
  });

  console.log("🚀 ~ characterAncillaryAccounts ~ scroller?:", scroller?.value);
  return useAccountStore().getSubAccounts;
});
const currentCharacter = computed(() => {
  return useAccountStore().getCurrentCharacter;
});

watch(currentCharacter, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    // tokenStore.setCurrentToken(newValue.token);
    // -----------给角色添加动画效果-----------
    isChange.value = true;
    setTimeout(() => {
      isChange.value = false;
    }, 1000);
    // -----------给角色添加动画效果-----------
  }
});
watch(activeName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (newVal == 2) {
      cellGroup.value &&
        nextTick(() => {
          minItemSize.value = cellGroup.value.$el.offsetHeight + 5;
          dynamicHeight.value = minItemSize.value * 2.2;
        });
    }
  }
});
onBeforeRouteUpdate((from, to) => {
  console.log("onBeforeRouteUpdate", from, to);
});
onMounted(async () => {
  console.log("onMounted");
});
onActivated(async () => {
  console.log("onActivated");
});
onDeactivated(async () => {
  console.log("onDeactivated");
});
const toEquipment = () => {
  if (!tokenStore.getToken) {
    showDialog({ message: "请先选择角色" });

    return;
  }
  router.push({
    name: "equipment",
  });
};
const beforeClose = (action) =>
  new Promise((resolve) => {
    if (action === "confirm") {
      if (dialogRef.value.isMatched()) {
        let username = dialogRef.value.username;
        let password = dialogRef.value.password;

        // 拦截确认操作
        if (mode.value === DialogModeEnum.SUB_SINGLE_ADD) {
          //添加账号
          addAccountAndToken({ username, password })
            .then(() => {
              // dialogRef.value.clearFields();

              tokenStore.setToken(currentCharacter.value.token);
              activeName.value = "2";
              showSuccessToast("添加成功");
            })

            .finally(() => {
              // dialogRef.value.clearFields();
              resolve(true);
            });
        } else if (mode.value === DialogModeEnum.MAIN_UPDATE) {
          //更新主号
          setMainAccountAndToken({ username, password })
            .then(() => {
              // dialogRef.value.clearFields();

              showSuccessToast("更新成功");
              tokenStore.setToken(currentCharacter.token);
              activeName.value = "1";
            })
            .finally(() => {
              // dialogRef.value.clearFields();
              resolve(true);
            });
        } else if (mode.value === DialogModeEnum.SUB_MULTIPLE_ADD) {
          //批量添加账号
          let start = dialogRef.value.start;
          let end = dialogRef.value.end;
          let accounts = [];
          for (let i = start; i <= end; i++) {
            accounts.push({ username: username + i, password });
          }
          addAccounts(accounts)
            .then(() => {
              // dialogRef.value.clearFields();

              useTokenStore().setToken(currentCharacter.value.token);
              activeName.value = "2";
            })
            .finally(() => {
              // dialogRef.value.clearFields();
              resolve(true);
            });
        }
      } else {
        dialogRef.value.getForm().validate();
        resolve(false);
      }
    } else {
      // dialogRef.value.getForm().resetValidation();
      // 拦截取消操作
      resolve(true);
    }
  });
const packetPrice = (currentCurrency) => {
  return {
    1: currentCurrency.jewellerOrb,
    2: currentCurrency.chromaticOrb,
    3: currentCurrency.orbOfFusing,
    4: currentCurrency.orbOfTransmutation,
    5: currentCurrency.orbOfChance,
    6: currentCurrency.orbOfAlchemy,
    7: currentCurrency.orbOfAugmentation,
    8: currentCurrency.orbOfAlteration,
    9: currentCurrency.exaltedOrb,
    10: currentCurrency.chaosOrb,
    11: currentCurrency.regalOrb,
    12: currentCurrency.orbOfScouring,
    13: currentCurrency.divineOrb,
    14: currentCurrency.vaalOrb,
    15: currentCurrency.mirrorOfKalandra,
    16: currentCurrency.whetstone,
    17: currentCurrency.armourersScrap,
  };
};

const onCancel = () => {
  show.value = false;
  cascaderValue.value = "";
};
const onConfirm = async (value) => {
  show.value = false;
  cascaderValue.value = "";
  let [id, token, cantTransfer] = value.value.split("|");
  // let [id, token, cantTransfer] = value.selectedValues[1].split("|");
  // console.log(token);
  if (currentCharacter.value.cantTransfer) {
    showFailToast("当前角色不可转移通货");
    return;
  }
  await TransferCurrenciesOneToOne(currentCharacter.value, { token }, []);

  showSuccessToast("转移完成");
  // 切换回当前角色
  tokenStore.setToken(currentCharacter.value.token);
};

const TransferCurrenciesOneToOne = async (orgin, dist, distBackpacks) => {
  // 将源头角色的通货转移到目标角色上
  // 将角色切换至源头角色
  // 获取源头角色的通货信息
  // 将角色切换至目标角色
  // 上架物品
  // 将角色切换至源头角色
  // 先根据物品的ID来确定是哪个物品，然后根据物品的市场ID来购买物品
  let currentSellItem = {};
  let packetPriceObj = {};

  if (orgin.token === dist.token) {
    console.log("源头角色和目标角色相同，不能转移");
    return;
  }

  tokenStore.setToken(orgin.token);
  await getCurrency().then((res) => {
    packetPriceObj = packetPrice(res);
  });
  tokenStore.setToken(dist.token);
  // 判断packetPriceObj对象的属性是否全为0，如果全为0，就不上架物品了，直接跳过上架物品的步骤
  let isAllZero = true;
  for (let key in packetPriceObj) {
    if (packetPriceObj[key] != 0) {
      isAllZero = false;
      break;
    }
  }
  if (isAllZero) {
    // 给出提示哪个角色为空
    console.log("当前角色通货为空");
    return;
  }
  // 上架物品前先确定物品列表是否为空，如果为空，就请求一次物品列表
  if (distBackpacks.length === 0) {
    await getBackpack().then((data) => {
      distBackpacks = data.items;
    });
  }

  await sell(distBackpacks[0].id, packetPriceObj).then(async () => {
    currentSellItem = distBackpacks.shift();

    // 转移目标角色购买物品
    tokenStore.setToken(orgin.token);
    // 上架物品后会生成一个物品的市场ID，这个ID是唯一的，所以需要获取市场物品，通过物品的ID来确定是哪个物品，然后根据物品的市场ID来购买物品
    await getMarket().then(async (res) => {
      let marketId = res.items.find((item) => item.equipmentId == currentSellItem.id).id;
      await buy(marketId);
    });
  });
};
const ShowTransferCurrenciesTo = async () => {
  options.value = accountStore.getOtherAccountTokenInfoOptions();

  show.value = true;
};
const ShowTransferAllCurrencies = async () => {
  // 加一个确认弹窗
  showConfirmDialog({
    title: "确认转移",
    message: "确认转移所有角色的通货到当前角色吗？",
    beforeClose: async (action) => {
      if (action === "confirm") {
        // resolve(true);
        // transferAllCurrencies();
        transferAllCurrenciesToCurrentCharacter();
      }
      return true;
    },
  });
  // await transferAllCurrencies();
};
const transferAllCurrenciesToCurrentCharacter = async () => {
  // 流程：先获取所有账号信息，然后遍历所有角色，获取角色的通货信息，然后将通货转移到当前角色上。
  // 转移通货的过程是通过被转移的角色上架物品，然后转移目标角色购买物品来实现的。切换角色的过程是通过切换token来实现的。等所有通货都转移完毕后，再将token切换回来。
  // 因为转移通货的过程是通过上架物品来实现的，所以需要先获取当前角色的物品信息，然后再上架物品。
  let accounts = accountStore.getAllAccountTokenInfo();
  let currentFirstBackpacks = [];

  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    for (let accIndex = 0; accIndex < account.tokenInfo.characters.length; accIndex++) {
      let character = account.tokenInfo.characters[accIndex];
      // 如果是当前角色，跳过
      if (character.id === currentCharacter.value.id) {
        continue;
      }
      // 如果是不可转移通货的角色，跳过
      if (character.cantTransfer) {
        continue;
      }
      showToast({
        message: `正在转移${character.name}的通货`,
      });
      console.log(`正在转移${character.name}的通货`);

      await TransferCurrenciesOneToOne(character, currentCharacter.value, currentFirstBackpacks);
    }
  }
  // for (let account of accounts) {
  //   for (let character of account.tokenInfo.characters) {
  //     // 如果是当前角色，跳过
  //     if (character.id === currentCharacter.value.id) {
  //       continue;
  //     }
  //     // 如果是不可转移通货的角色，跳过
  //     if (character.cantTransfer) {
  //       continue;
  //     }
  //     showToast({
  //       message: `正在转移${character.name}的通货`,
  //     });
  //     console.log(`正在转移${character.name}的通货`);

  //     await TransferCurrenciesOneToOne(character.token, currentCharacter.value.token, currentFirstBackpacks);
  //   }
  // }
  // 转移完成后，切换回当前角色
  tokenStore.setToken(currentCharacter.value.token);
  showToast({
    message: `转移完成`,
  });
};
const deleteAllAccounts = () => {
  showConfirmDialog({
    title: "确认删除",
    message: "确认删除所有账号吗？",
    beforeClose: async (action) => {
      if (action === "confirm") {
        accountStore.deleteAllAccounts();
      }
      return true;
    },
  });
};
const deleteSubAccounts = () => {
  showConfirmDialog({
    title: "确认删除",
    message: "确认删除所有小号吗？",
    beforeClose: async (action) => {
      if (action === "confirm") {
        accountStore.deleteAllSubAccounts();
      }
      return true;
    },
  });
};
const deleteAccount = (account) => {
  accountStore.deleteSubAccount(account);
  showSuccessToast("删除成功");
};
const selectCharacter = (character, { username, password }) => {
  accountStore.setCurrentCharacter({ username, password, ...character });
  activeName.value = "0";
};
const switchCantTransfer = (character) => {
  character.cantTransfer = !character.cantTransfer;
};
const addAccountAndToken = async (account) => {
  await accountStore.addSubAccount(account);
};
const addAccounts = async (accounts) => {
  for (let account of accounts) {
    // 创建账号的个数大于10个才提示
    if (accounts.length > 8) {
      showToast({
        message: `正在添加${account.username}`,
      });
    }
    await addAccountAndToken(account);
  }
};
const setMainAccountAndToken = async (account) => {
  await accountStore.setMainAccount(account);
};

const addSubAccount = () => {
  showAccountDialog("添加小号", DialogModeEnum.SUB_SINGLE_ADD);
};
const updateMainAccount = () => {
  showAccountDialog("更新主号", DialogModeEnum.MAIN_UPDATE);
};
const addMultipleSubAccount = () => {
  showAccountDialog("批量添加小号", DialogModeEnum.SUB_MULTIPLE_ADD);
};
const showAccountDialog = (title, Mode) => {
  mode.value = Mode;

  showConfirmDialog({
    title,
    message: () => {
      return h(AccountAddDialog, {
        ref: dialogRef,
        mode: Mode,
      });
    },

    beforeClose,
  });
};

watch(loading, (newValue) => {
  if (newValue) {
    loadingStore.showLoading();
  } else {
    loadingStore.hideLoading();
  }
});
</script>

<style rel="stylesheet/scss" scoped lang="scss">
// @import "@/assets/scss/_common.scss";
:deep(.van-cell-group) {
  // background: var(--van-background);
  background: var(--van-background);
}

:deep(.van-collapse-item__content) {
  padding: 0px 10px;
  background: transparent;
}

.container {
  // min-height: calc(100vh - 96px);
  // height: 100%;
  // padding-top: 46px;

  // overflow: auto;
  :deep(.current-character) {
    margin: 24px;
    span {
      margin: 0 20px;
      color: var(--van-orange);
    }
  }

  :deep(.character),
  :deep(.account) {
    color: var(--van-gray-4);
  }
}
.delete {
  margin-left: 20px;
}
.account {
  position: relative;
  border-left: 1px solid var(--van-border-color);
  border-right: 1px solid var(--van-border-color);
  /* border-bottom: 1px solid var(--van-border-color); */
  /* border: 1px solid var(--van-cell-border-color); */
  &::after {
    content: "";
    background-color: var(--van-border-color);
    position: absolute;
    left: 10%; /* 从左边开始的位置 */
    bottom: 0;
    height: 1px;
    width: 80%; /* 边框宽度 */
    // border-bottom: 1px solid var(--van-border-color);
  }
}
// .account::after {
//     content: "";
//     position: absolute;
//     left: 10%; /* 从左边开始的位置 */
//     bottom: 0;
//     width: 80%; /* 边框宽度 */
//     border-bottom: 1px solid var(--van-border-color);
// }
.van-cell:after {
  border: none;
}
.character {
  font-size: 12px;
  padding: 10px 40px;

  border-left: 1px solid var(--van-border-color);

  border-right: 1px solid var(--van-border-color);
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
