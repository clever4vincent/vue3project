<template>
    <van-nav-bar title="账号" fixed />

    <van-pull-refresh v-model="loading" @refresh="onRefresh" :disabled="pullRefreshDisabled">
        <div class="container">
            <van-collapse v-model="activeName" accordion>
                <van-collapse-item title="主号" name="1">
                    <van-cell title="a6669852" value="123456" />
                </van-collapse-item>

                <van-collapse-item title="小号" name="2">
                    <van-cell-group :border="false">
                        <van-cell v-for="item in characterAncillaryAccounts" :key="item.name" :title="item.username" :value="item.password" />
                    </van-cell-group>
                </van-collapse-item>
            </van-collapse>
            <!-- <van-button @click="getToken">点击</van-button> -->
            <van-button class="van-haptics-feedback" @click="addSubAccount">添加小号</van-button>
        </div>
    </van-pull-refresh>
</template>
<script setup>
// import { ref, watch } from "vue";
import { useLoadingStore, useAccountStore, useTokenStore } from "@/stores";
import { getCharacterInfo } from "@/api";
import { showConfirmDialog } from "vant";
const characterAncillaryAccounts = useAccountStore().getSubAccounts;
const count = ref(0);
const pullRefreshDisabled = ref(true);
const activeName = ref("0");
const loadingStore = useLoadingStore();
const accountStore = useAccountStore();
const tokenStore = useTokenStore();
const loading = ref(false);

const beforeClose = (action) =>
    new Promise((resolve) => {
        setTimeout(() => {
            if (action === "confirm") {
                resolve(true);
            } else {
                // 拦截取消操作
                resolve(false);
            }
        }, 1000);
    });
const addSubAccount = () => {
    showConfirmDialog({
        title: "标题",
        message: "如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。",
        beforeClose,
    });
};
const getToken = async () => {
    // let accountInfo = await accountStore.requestAccountTokenInfo(accountStore.getMainAccount);
    // for (let info of accountInfo.characters) {
    //     // console.log(info);
    //     if (info.token) {
    //         tokenStore.setToken(info.token);
    //         await getCharacterInfo().then((res) => {
    //             console.log(res);
    //         });
    //     }
    // }
    // let infos = await accountStore.getAccountTokenInfo(accountStore.getMainAccount);
    // console.log(infos);
    // for (let info of infos.tokenInfo.characters) {
    //     // console.log(info);
    //     if (info.token) {
    //         tokenStore.setToken(info.token);
    //         await getCharacterInfo().then((res) => {
    //             console.log(res);
    //         });
    //     }
    // }

    accountStore.addSubAccount({
        username: "a666985213",
        password: "123456",
    });
    console.log("🚀 ~ getToken ~ getSubAccounts:", toRaw(accountStore.getSubAccounts));
    let infos = await accountStore.getAccountTokenInfo(accountStore.getSubAccounts[1]);
    console.log(infos);
    for (let info of infos.tokenInfo.characters) {
        // console.log(info);
        if (info.token) {
            tokenStore.setToken(info.token);
            await getCharacterInfo().then((res) => {
                console.log(res);
            });
        }
    }
    // getMarket().then((res) => {
    //     console.log(res);
    // });
};
const onRefresh = () => {
    setTimeout(() => {
        // showToast('刷新成功')
        loading.value = false;
        count.value++;
    }, 1000);
};
watch(loading, (newValue) => {
    console.log(newValue);
    if (newValue) {
        loadingStore.showLoading();
    } else {
        loadingStore.hideLoading();
    }
});
</script>
<style scoped>
.container {
    min-height: calc(100vh - 96px);
    height: 100%;
    margin-top: 46px;

    overflow: auto;
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
