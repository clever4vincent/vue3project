<template>
  <div class="page">
    <van-nav-bar title="创建账号" left-text="返回" left-arrow @click-left="onClickLeft" fixed />
    <div class="container">
      <van-cell title="创建账号" is-link @click="showAccountDialog('创建账号', DialogModeEnum.CREATE_ACCOUNT)" />
      <!-- <van-cell title="test" is-link @click="test" /> -->
      <div>
        {{ count }}
      </div>
      <van-cell title="数字" center value="加1" @click="add"></van-cell>
      <van-cell title="测试页面" center value="内容" is-link to="/test"></van-cell>
    </div>
  </div>
</template>
<script setup>
import { useLoadingStore, useAccountStore, useStore, useTokenStore } from "@/stores";
import { skilltree } from "@/lib/data";
import { useRouter } from "vue-router";
import { showConfirmDialog, showToast, showFailToast, showSuccessToast } from "vant";
import { getCharacterInfo } from "@/api";
import { createAccountProgress } from "@/hooks";
import { DialogModeEnum } from "@/enums/appEnum";
import { ref, watch, h } from "vue";

import AccountAddDialog from "@/components/AccountAddDialog.vue";
import { useThemeStore } from "../stores";

const router = useRouter();
const accountStore = useAccountStore();
const createDialogRef = ref(null);
const mode = ref("");
const count = ref(1);
const onClickLeft = () => router.go(-1);
const test = () => {
  getCharacterInfo().then((res) => {
    console.log(res);
  });
};
const add = () => {
  count.value++;
};
const createBtn = async (account) => {
  for (let index = 0; index < 2; index++) {
    await createAccountProgress(account);
    await accountStore.addSubAccount(account);
    let str = account.username;
    account.username = str.replace(/a6669852(\d+)/, (match, p1) => "a6669852" + (Number(p1) + 1));
    accountStore.accountNo = account.username;
    createDialogRef.value.username = account.username;
  }
  // console.log("getAxios", defHttp.getAxios().defaults);
  showSuccessToast("创建成功");
  // 将切换回当前角色的token
  useTokenStore().setToken(useAccountStore().getCurrentCharacter.token);
};
const beforeClose = (action) =>
  new Promise((resolve) => {
    if (action === "confirm") {
      if (createDialogRef.value.isMatched()) {
        let username = createDialogRef.value.username;
        let password = createDialogRef.value.password;
        // 拦截确认操作
        if (mode.value === DialogModeEnum.CREATE_ACCOUNT) {
          //添加账号
          try {
            createBtn({ username, password })
              .then(() => {})
              .finally(() => {
                resolve(true);
              });
          } catch (error) {
            resolve(true);
          }
        }
      } else {
        createDialogRef.value.getForm().validate();
        resolve(false);
      }
    } else {
      resolve(true);
    }
  });
onActivated(async () => {
  console.log("onActivated");
});
const showAccountDialog = (title, Mode) => {
  mode.value = Mode;
  showConfirmDialog({
    title,
    message: () => {
      return h(AccountAddDialog, {
        ref: createDialogRef,
        mode: Mode,
      });
    },

    beforeClose,
  });
};
</script>
<style scoped></style>
