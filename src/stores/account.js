import { defineStore } from "pinia";
import { store, useTokenStore } from "@/stores";
import { login, getCharacterList, switchCharacter } from "@/api";
import { cloneDeep } from "lodash-es";

export const useAccountStore = defineStore({
  id: "app-account",
  state: () => ({
    mainAccountTokenInfo: [],
    accountTokenInfo: [],
    currentCharacter: {},
  }),
  getters: {
    getMainAccount() {
      return this.mainAccountTokenInfo[0];
    },
    getSubAccounts() {
      return this.accountTokenInfo.sort((a, b) => a.username.localeCompare(b.username));
    },
    getCurrentCharacter() {
      return this.currentCharacter;
    },
  },
  actions: {
    deleteAllAccounts() {
      this.accountTokenInfo = [];
      this.currentCharacter = {};
      this.mainAccountTokenInfo = [];
      useTokenStore().setToken("");
    },
    deleteAllSubAccounts() {
      // 判断当前角色是否在子账号中，如果在，删除当前角色且清空token，用some是为了提高效率
      this.accountTokenInfo.some((account) => {
        for (const character of account.tokenInfo.characters) {
          if (this.currentCharacter.id === character.id) {
            this.currentCharacter = {};
            useTokenStore().setToken("");
          }
        }
        return true;
      });
      this.accountTokenInfo = [];
    },
    getOtherAccountTokenInfo() {
      let allTokenInfo = [];
      allTokenInfo = allTokenInfo.concat(this.mainAccountTokenInfo).concat(this.accountTokenInfo);

      let temp = cloneDeep(allTokenInfo);
      // 需要删除当前角色，所以复制数据，不要直接操作 allTokenInfo,删除当前角色所在的账号的数据
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].tokenInfo.characters.length; j++) {
          if (temp[i].tokenInfo.characters[j].id === this.currentCharacter.id) {
            temp[i].tokenInfo.characters.splice(j, 1);
          }
        }
      }
      return temp;
    },
    getOtherAccountTokenInfoOptions() {
      return this.parseAccounts(this.getOtherAccountTokenInfo());
    },
    async addSubAccount(account) {
      await this.getAccountTokenInfo(account);
    },
    deleteSubAccount(account) {
      const index = this.accountTokenInfo.findIndex((subAccount) => subAccount.username === account.username);
      if (index !== -1) {
        for (const character of this.accountTokenInfo[index].tokenInfo.characters) {
          if (this.currentCharacter.id === character.id) {
            this.currentCharacter = {};
            useTokenStore().setToken("");
          }
        }

        this.accountTokenInfo.splice(index, 1);
      }
    },
    setCurrentCharacter(character) {
      this.currentCharacter = character;
      useTokenStore().setToken(character.token);
    },
    parseAccounts(accounts) {
      return accounts.map((account) => {
        return {
          text: account.username,
          value: account.username,
          children: account.tokenInfo.characters.map((character) => {
            return {
              text: character.name,
              value: character.id + "|" + character.token + "|" + character.cantTransfer,
            };
          }),
        };
      });
    },
    async setMainAccount(account) {
      if (account.username && account.password) {
        await this.getMainAccountTokenInfo(account);
      }
    },
    async getAccountTokenInfo(account) {
      const index = this.accountTokenInfo.findIndex((item) => item.username === account.username);

      if (index !== -1) {
        // return this.accountTokenInfo[index];
      } else {
        // 获取 tokenInfo
        const tokenInfo = await this.requestAccountTokenInfo(account);
        tokenInfo &&
          this.accountTokenInfo.push({
            username: account.username,
            password: account.password,
            tokenInfo,
          });
        this.accountTokenInfo.sort((a, b) => a.username.localeCompare(b.username));
        // return this.accountTokenInfo[this.accountTokenInfo.length - 1];
      }
    },
    async getMainAccountTokenInfo(account) {
      const index = this.mainAccountTokenInfo.findIndex((item) => item.username === account.username);

      if (index !== -1) {
        return this.mainAccountTokenInfo[index];
      } else {
        // 获取 tokenInfo
        const tokenInfo = await this.requestAccountTokenInfo(account);
        tokenInfo &&
          (this.mainAccountTokenInfo[0] = {
            username: account.username,
            password: account.password,
            tokenInfo,
          });
        return this.mainAccountTokenInfo[0];
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
