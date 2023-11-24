<template>
  <div>
    <van-nav-bar title="账号" fixed />
    <!-- <div style="height: 46px"></div> -->
    <!-- <van-pull-refresh v-model="loading" @refresh="onRefresh" :disabled="pullRefreshDisabled"> -->
    <div class="container">
      <!-- <div style="height: 20px"></div> -->
      <van-sticky :offset-top="'22px'">
        <van-cell-group inset class="current-character">
          <van-cell title="当前角色" :value="currentCharacter.name || '未选择'" :class="changeClass" />
        </van-cell-group>
      </van-sticky>

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
                @click="selectCharacter(character)"
                >选择角色</van-button
              >
              <!-- <van-button v-else class="delete" size="mini" plain type="primary">已选择</van-button> -->
              <van-tag v-else color="#ffe1e1" text-color="#ad0000">已选择</van-tag>
            </template>
          </van-cell>
        </van-collapse-item>

        <van-collapse-item title="小号" name="2">
          <van-cell-group :border="false" class="group">
            <transition-group
              :duration="450"
              leave-active-class="animate__animated animate__slideOutLeft"
              enter-active-class="animate__animated animate__slideInRight"
            >
              <van-cell-group :border="true" v-for="item in characterAncillaryAccounts" :key="item.username">
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
                    <van-button class="delete" size="mini" plain type="success" @click="selectCharacter(character)">选择角色</van-button>
                  </template>
                </van-cell>
              </van-cell-group>
            </transition-group>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <div style="display: flex; flex-direction: row; justify-content: space-between; margin: 10px">
        <van-button style="margin: 10px" plain type="primary" @click="addSubAccount">添加小号</van-button>
        <van-button style="margin: 10px" plain type="primary" @click="updateMainAccount">更新主号</van-button>
        <van-button style="margin: 10px" plain type="primary" @click="addMultipleSubAccount">批量添加小号</van-button>
      </div>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa' }"></van-divider>
      <van-button style="margin: 10px" plain type="primary" to="/equipment">装备列表</van-button>
    </div>
  </div>

  <!-- </van-pull-refresh> -->
</template>
<script setup>
import { useLoadingStore, useAccountStore, useTokenStore } from "@/stores";
import { getCharacterInfo } from "@/api";
import { showConfirmDialog, showToast } from "vant";
import { DialogModeEnum } from "@/enums/appEnum";
import AccountAddDialog from "@/components/AccountAddDialog.vue";

import { h } from "vue";
import { watch } from "vue";
import { ref } from "vue";
const characterAncillaryAccounts = useAccountStore().getSubAccounts;

const count = ref(0);
// const pullRefreshDisabled = ref(true);
const activeName = ref("0");
const loadingStore = useLoadingStore();
const accountStore = useAccountStore();
const tokenStore = useTokenStore();
const loading = ref(false);
const containerRef = ref(null);
const dialogRef = ref(null);
const mode = ref("");
const isChange = ref(false);
const changeClass = computed(() => {
  return isChange.value ? "animate__animated animate__bounce" : "";
});

const mainAccount = computed(() => useAccountStore().getMainAccount);
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
    newVal &&
      newVal.id &&
      getCharacterInfo({ id: newVal.id }).then((res) => {
        console.log(res);
        // tokenStore.setCurrentToken(res.data);
      });
  }
});

onMounted(async () => {
  // 页面挂载后执行初始化请求
  // console
  // 处理返回的数据...
});

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
              showToast({
                message: "更新成功!",
              });
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

const deleteAccount = (account) => {
  accountStore.deleteSubAccount(account);
};
const selectCharacter = (character) => {
  accountStore.setCurrentCharacter(character);
  activeName.value = "0";
};
const addAccountAndToken = async (account) => {
  await accountStore.addSubAccount(account);
};
const addAccounts = async (accounts) => {
  for (let account of accounts) {
    await addAccountAndToken(account);
  }
};
const setMainAccountAndToken = async (account) => {
  await accountStore.setMainAccount(account);
};
const addSubAccount = () => {
  showDialog("添加小号", DialogModeEnum.SUB_SINGLE_ADD);
};
const updateMainAccount = () => {
  showDialog("更新主号", DialogModeEnum.MAIN_UPDATE);
};
const addMultipleSubAccount = () => {
  showDialog("批量添加小号", DialogModeEnum.SUB_MULTIPLE_ADD);
};
const showDialog = (title, Mode) => {
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
<style scoped lang="scss">
:deep(.van-cell-group) {
  // background: var(--van-background);
  background: var(--van-background);
}
:deep(.van-cell) {
  // padding: 0px 10px;
  background: var(--van-background);
  // background: red;
}
:deep(.van-collapse-item__content) {
  padding: 0px 10px;
  background: transparent;
}

.container {
  min-height: calc(100vh - 96px);
  height: 100%;
  padding-top: 46px;

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
