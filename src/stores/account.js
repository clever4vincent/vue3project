import { defineStore } from "pinia";
import { store, useTokenStore } from "@/stores";
import { login, getCharacterList, switchCharacter } from "@/api";

export const useAccountStore = defineStore({
    id: "app-account",
    state: () => ({
        mainAccounts: [
            {
                username: "a6669852",
                password: "123456",
            },
        ],
        subAccounts: [],
        accountTokenInfo: [],
    }),
    getters: {
        getMainAccount() {
            return this.mainAccounts[0];
        },
        getSubAccounts() {
            return this.subAccounts;
        },
    },
    actions: {
        addSubAccount(account) {
            const index = this.subAccounts.findIndex((subAccount) => subAccount.username === account.username);
            if (index !== -1 && account.password) {
                // 如果找到了相同的账户，更新它
                this.subAccounts[index] = account;
            } else {
                // 如果没有找到相同的账户，将 account 添加到 subAccounts 中
                this.subAccounts.push(account);
            }
        },
        setMainAccount(account) {
            if (account.username && account.password) {
                this.mainAccounts[0] = account;
            }
        },
        async getAccountTokenInfo(account) {
            const index = this.accountTokenInfo.findIndex((item) => item.username === account.username);
            if (index !== -1) {
                return this.accountTokenInfo[index];
            } else {
                // 获取 tokenInfo
                const tokenInfo = await this.requestAccountTokenInfo(account);
                tokenInfo &&
                    this.accountTokenInfo.push({
                        username: account.username,
                        tokenInfo,
                    });
                return this.accountTokenInfo[this.accountTokenInfo.length - 1];
            }
        },
        async requestAccountTokenInfo(account) {
            let accountToken = null;
            let characters = [];
            await login(account).then((res) => {
                if (res.token) {
                    //    await
                    accountToken = res.token;
                    useTokenStore().setToken(res.token);
                    // await useTokenStore()
                } else {
                    throw new Error("登录失败");
                }
            });
            await getCharacterList().then(async (res) => {
                if (res.length > 0) {
                    for (const character of res) {
                        let characterToken = null;

                        await switchCharacter({ characterId: character.id }).then(async (result) => {
                            if (result) {
                                characterToken = result;
                                // useTokenStore().setToken(result);
                            } else {
                                throw new Error("角色登录失败");
                            }
                        });
                        characters.push({
                            id: character.id,
                            name: character.name,
                            token: characterToken,
                        });
                    }
                } else {
                    throw new Error("获取角色列表失败");
                }
            });

            return {
                accountToken,
                characters,
            };
        },
    },
    persist: true,
});
// Need to be used outside the setup
export function useAccountStoreWithOut() {
    return useAccountStore(store);
}
