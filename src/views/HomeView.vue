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
      <van-cell title="歌词" center is-link to="/music"></van-cell>
      <van-cell title="影视" center is-link to="/movie" class="mb-2"></van-cell>
      <!-- </van-sticky> -->

      <van-collapse v-model="activeName" accordion>
        <van-collapse-item title="主号" name="1" v-if="false">
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

        <van-collapse-item title="账号" name="2">
          <van-cell-group :border="false" class="group">
            <!-- <transition-group
              :duration="450"
              leave-active-class="animate__animated animate__slideOutLeft"
              enter-active-class="animate__animated animate__slideInRight"
              tag="div"
            > -->
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
            <!-- </transition-group> -->
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <!-- <div style="display: flex; flex-direction: row; justify-content: space-between; margin: 10px"> -->
      <van-button style="margin: 10px" size="small" plain type="primary" icon="plus" @click="addSubAccount">添加账号</van-button>
      <!-- <van-button style="margin: 10px" size="small" plain type="primary" @click="updateMainAccount">更新主号</van-button> -->
      <van-button style="margin: 10px" size="small" plain type="primary" icon="plus" @click="addMultipleSubAccount">批量添加账号</van-button>
      <van-button style="margin: 10px" size="small" plain type="primary" icon="plus" to="/createAccount">创建账号</van-button>
      <!-- <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider> -->
      <van-button style="margin: 10px" size="small" plain type="primary" @click="deleteAllAccounts">删除所有账号</van-button>
      <!-- <van-button style="margin: 10px" size="small" plain type="primary" @click="deleteSubAccounts">删除所有小号</van-button> -->
      <!-- <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider> -->
      <van-button style="margin: 10px" size="small" plain type="primary" @click="ShowTransferAllCurrencies">转移所有通货到当前角色</van-button>
      <van-button style="margin: 10px" size="small" plain type="primary" @click="ShowTransferCurrenciesTo">当前角色通货转移</van-button>
      <!-- <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider> -->
      <van-button style="margin: 10px" size="small" plain type="primary" @click="toEquipment">装备列表</van-button>
      <van-button style="margin: 10px" size="small" plain type="primary" @click="toEquipmentModify">改造列表</van-button>
      <!-- <van-button style="margin: 10px" size="small" plain type="primary" @click="startRedpack">集体收红包</van-button>
      <van-button style="margin: 10px" size="small" plain type="primary" @click="closeRedpack">关闭收红包</van-button> -->
      <!-- <van-button style="margin: 10px" size="small" plain type="primary" @click="doThread">测试</van-button> -->
      <!-- <van-button style="margin: 10px" size="small" plain type="primary" @click="doTest">测试匹配</van-button> -->
      <!-- <van-button style="margin: 10px" plain type="primary" @click="validate">验证</van-button> -->
      <!-- <van-cell title="测试页面" center value="内容" is-link to="/test"></van-cell> -->
      <!-- <van-button style="margin: 10px" plain type="primary" @click="test">test</van-button> -->
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
import { useLoadingStore, useAccountStore, useTokenStore, useConditionStore } from "@/stores";
import { getCurrency, sell, buy, getMarket, getBackpack, remove, saveAccountThrid, getAccountThrid, getCharacterInfo, clickRedpacket } from "@/api";
import { showConfirmDialog, showToast, showSuccessToast, showFailToast, showDialog } from "vant";
import { DialogModeEnum, CurrencyBeanEnum } from "@/enums/appEnum";
import AccountAddDialog from "@/components/AccountAddDialog.vue";
import { useRouter } from "vue-router";
import { isMatchCustomAttr } from "@/hooks";
import { onActivated, onDeactivated, ref, watch, h } from "vue";
import { nextTick } from "vue";
import { threadPool } from "@/utils/ThreadPool";
import { EventSourcePolyfill } from "event-source-polyfill";
import { getAppEnvConfig } from "@/utils/env";
import { sleep } from "@/utils";
// const pullRefreshDisabled = ref(true);
const activeName = ref("0");
const scroller = ref();
const minItemSize = ref(210);
const dynamicHeight = ref(400);
const show = ref(false);
const loadingStore = useLoadingStore();
const accountStore = useAccountStore();
const tokenStore = useTokenStore();
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
let eventStream = null;
let maxDemage = 0;
let maxTotalDemage = 0;
const start = () => {
  if (eventStream) eventStream.close();
  eventStream = new EventSourcePolyfill(`${getAppEnvConfig().VITE_GLOB_API_URL}/battle/sse`, {
    headers: {
      Authorization: "Bearer " + currentCharacter.value.token,
    },
  });

  eventStream.addEventListener("error", () => {
    console.log("battle error");
  });
  eventStream.addEventListener("battle_result", (e) => {
    const data = JSON.parse(e.data);

    !data.isWin && console.log(data);
  });
  eventStream.addEventListener("battle_event", (e) => {
    const data = JSON.parse(e.data);
    // console.log(data);
    data.targets.forEach((target) => {
      if (target?.name == currentCharacter.value.name) {
        // 记录伤害超过2000的数值，再记录伤害的类型
        if (target?.damages?.[1] > 1800) {
          console.log(data);
          console.log(`人物收到的伤害：${target?.damages?.[1]}，伤害类型为${data.skill.name}`);
        }
      }
      // 计算所有伤害的总和
      if (target?.damages) {
        let totalDemage = Object.keys(target.damages).reduce((prev, cur) => {
          return prev + target.damages[cur];
        }, 0);
        // console.log(totalDemage);
        if (totalDemage > maxTotalDemage) {
          maxTotalDemage = totalDemage;
          console.log(`最高总伤：${maxTotalDemage}`);
        }
      }
      if (target?.damages?.[4] > maxDemage) {
        maxDemage = target.damages[4];
        console.log(`最高电伤：${maxDemage}`);
      }
    });
  });
  // eventStream.addEventListener("battle_searching", callback);
  eventStream.addEventListener("close", () => {
    console.log("battle sse closed, restart in 1s");
    setTimeout(() => {
      start();
    }, 1000);
  });
  // eventStream.addEventListener("character_update", (e) => {
  //   const data = JSON.parse(e.data);
  //   console.log(data);
  //   // Object.assign(character.value, data);
  // });
};
let eventSource;
let curRedPacketId;
const startRedpack = () => {
  // 连接 sse
  if (eventSource) eventSource.close();
  eventSource = new EventSourcePolyfill(`${getAppEnvConfig().VITE_GLOB_API_URL}/common/events`, {
    headers: {
      Authorization: "Bearer " + currentCharacter.value.token,
    },
  });
  eventSource.addEventListener("red-packet", (e) => {
    const { redPacketId, endTime, count } = JSON.parse(e.data);
    // console.log(redPacketId, endTime, count);
    if (endTime < new Date().getTime()) {
      return;
    }
    if (curRedPacketId !== redPacketId) {
      curRedPacketId = redPacketId;
      // console.log(redPacketId, endTime, count);
      // 操作所有角色点击红包
      clickRedpacketAction(redPacketId, endTime);
    }
    // console.log(redPacketId, endTime, count);
  });
};
const closeRedpack = () => {
  if (eventSource) eventSource.close();
};
const allAccount = computed(() => {
  return useAccountStore()
    .getAllAccountTokenInfo()
    .sort((a, b) => {
      // console.log(a, b);
      let x = parseInt(a.username.replace("a6669852", ""));
      let y = parseInt(b.username.replace("a6669852", ""));
      return x - y;
    });
});
const clickRedpacketAction = async (redPacketId, endTime) => {
  let allUser = allAccount.value.map((item) => {
    return item.username;
  });
  // 将allUser根据自身长度,每份60个分成多份,不足60个的也分成一份
  let parts = Math.ceil(allUser.length / 10);
  for (let i = 0; i < 2; i++) {
    let part1 = allUser.slice(i * 10, (i + 1) * 10);
    // console.log(part1);
    accountStore.setBatchAccounts(part1);
    await accountStore.batchAccountsOperation(async (thirdToken) => {
      await clickRedpacket(redPacketId, thirdToken);
    });
  }
  // 保活完毕后清空批量操作的账号
  accountStore.setBatchAccounts([]);
  // startWhileClick(redPacketId, endTime);
};
const startWhileClick = async (redPacketId, endTime) => {
  if (endTime < new Date().getTime()) {
    return;
  }
  while (endTime > new Date().getTime()) {
    let allPromise = [];
    try {
      for (let i = 0; i < 300; i++) {
        allPromise.push(clickRedpacket(redPacketId));
      }
      Promise.all(allPromise);
      await sleep(400);
    } catch (error) {
      console.log(error);
    }
  }
};
onMounted(async () => {
  // startRedpack();
  useTokenStore().setToken(currentCharacter.value.token);
  // start();
  watch(activeName, (newVal, oldVal) => {
    if (newVal == 2) {
      setTimeout(() => {
        cellGroup.value &&
          nextTick(() => {
            minItemSize.value = cellGroup.value.$el.offsetHeight + 5;
            dynamicHeight.value = minItemSize.value * 2.2;
          });
      }, 100);
    }
  });
});
// const validate = () => {
//   console.log(window.vaptchaObj.validate());
// };

onActivated(async () => {
  console.log("onActivated");
});
onUnmounted(() => {
  if (eventStream) eventStream.close();
  if (eventSource) eventSource.close();
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
const toEquipmentModify = () => {
  if (!tokenStore.getToken) {
    showDialog({ message: "请先选择角色" });
    return;
  }
  router.push({
    name: "equipmentModify",
  });
};
const doThread = async () => {
  // threadPool.run(123);
  // 汇总当前角色的闪电伤害
  let lowAttack = 10 + 17;
  let highAttack = 192 + 267;
  // 攻击技能的元素伤害提高 42%
  let skillElementDamage = 1.3;
  // 闪电伤害提高 20%
  let lightingDamage = 1;
  // 攻击伤害
  let attackDamage = 2.29 + 0.78 - 0.19 + 0.32 - 0.02 + 0.36 + 0.84;
  // 伤害
  let damage = 1;
  // 暴击伤害
  let criticalDamage = 1.55;
  // 异常伤害
  let abnormalDamage = 1.6;
  //辅助技能造成的伤害总增
  let auxiliarySkillDamage = 1.4;
  // 投射物伤害提高
  let projectileDamage = 1;
  await getCharacterInfo().then((res) => {
    for (let item of Object.keys(res.equipmentSlots)) {
      if (item == "offHand") continue;
      let equipment = res.equipmentSlots[item];
      equipment.affixes.forEach((affix) => {
        if (affix?.magics[81]) {
          // 攻击附加 19 - 340 基础闪电伤害
          lowAttack += affix?.magics[81][0];
          highAttack += affix?.magics[81][1];
        }
        if (affix?.magics[9]) {
          // 攻击技能的元素伤害提高 42%
          skillElementDamage += affix?.magics[9][0] / 100;
        }
        if (affix?.magics[135]) {
          //闪电伤害提高 20%
          skillElementDamage += affix?.magics[135][0] / 100;
        }
      });
    }
    criticalDamage += res.physicalCriticalStrikeMultiplier / 100;
  });
  console.log("基础闪电伤害", lowAttack, highAttack);
  console.log("攻击技能的元素伤害", skillElementDamage.toFixed(2));
  console.log("闪电伤害提高 ", lightingDamage.toFixed(2));
  console.log("暴击伤害 ", criticalDamage);
  let lastDamage =
    highAttack *
    skillElementDamage *
    lightingDamage *
    attackDamage *
    damage *
    criticalDamage *
    abnormalDamage *
    auxiliarySkillDamage *
    projectileDamage;
  console.log("闪电最大伤害", lastDamage.toFixed(2));
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
          try {
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
          } catch (error) {
            resolve(true);
          }
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
            accounts.push({ username: username + String(i).padStart(2, "0"), password });
          }
          console.log(accounts);
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
  // CurrencyEnum
  let packetPriceObj = {};
  for (let key in currentCurrency) {
    if (currentCurrency[key] > 0 && CurrencyBeanEnum[key] && CurrencyBeanEnum[key].need) {
      packetPriceObj[CurrencyBeanEnum[key].value] = Math.floor(currentCurrency[key]);
    }
  }
  return packetPriceObj;
};
const doTest = () => {
  let equipmentModifys = useConditionStore().equipmentModifys[0];
  console.log(isMatchCustomAttr(equipmentModifys.equipment, equipmentModifys.conditions, 2));
  // isMatchCustomAttr
};

const test = () => {
  // 6572987795ddf85d1169f87e 虚空之牙 653f849f2a1f0433c8ca1421放电之护身符 657002c795ddf85d11455314手套 6571f06c95ddf85d11df1560鞋子
  // 65461f46836b33b678c83da5 戒指
  //   console.log(res);
  // });
  // sell("654c4adaba145208f7c09edb", { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }).then((res) => {
  //   console.log(res);
  // });
  // buy("6572987795ddf85d1169f87e").then((res) => {
  //   console.log(res);
  // });
};
const onCancel = () => {
  show.value = false;
  cascaderValue.value = "";
};
const onConfirm = async (value) => {
  show.value = false;
  cascaderValue.value = "";
  // let [id, token, cantTransfer] = value.value.split("|");
  let token = value.value.token;
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
      color: var(--rare-color);
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
