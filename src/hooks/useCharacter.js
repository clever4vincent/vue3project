import {
  upgradeStone,
  getCharacterInfo,
  changeClass,
  updateSkilltree,
  login,
  loginThrid,
  getCharacterList,
  getCharacterListThird,
  createAccount,
} from "@/api";
import { useTokenStoreWithOut, useAccountStore, useStore } from "@/stores";
export async function upgradeAllStoneOnEquipment(thirdToken) {
  await getCharacterInfo(thirdToken).then(async (data) => {
    // 获取无尽之衣的id
    let bodyArmor = data.equipmentSlots.bodyArmor;
    let stones = bodyArmor.sockets[0];
    for (let index = 0; index < stones.length; index++) {
      let item = stones[index];
      if (item.exp > item.levelUpExp) {
        let canUpgrade = true;
        while (canUpgrade) {
          await upgradeStone(item.stoneId, thirdToken)
            .then(async (res) => {
              canUpgrade = res;
            })
            .catch(() => (canUpgrade = false));
        }
      }
    }
  });
}
export async function updateSkilltreeComb(skills, thirdToken) {
  await getCharacterInfo(thirdToken).then(async (data) => {
    // 如果职业是2也就是贵族的话 characterClasses
    if (data.class != 2) {
      await changeClass({ class: 2 }, thirdToken);
    }
    await updateSkilltree(skills, thirdToken);
  });
}
export async function createAccountProgress(account) {
  let accountToken;
  await loginThrid(account).then(async (res) => {
    if (res.token) {
      //    await
      accountToken = res.token;
      useTokenStoreWithOut().setToken(res.token);
      // await useTokenStore()
    } else {
      throw new Error("登录失败");
    }
    await getCharacterListThird().then(async (res) => {
      console.log("获取角色列表成功", res);
      if (res.length === 0) {
        for (let index = 0; index < 3; index++) {
          let params = {
            name: parseAccountName(account.username, index),
            class: 2,
          };
          await createAccount(params).then((res) => {
            // console.log(`创建${parseAccountName(account.name, index)}成功`);
            console.log(`创建成功`, res);
          });
        }
      }
    });
  });
}

export async function initAccountProgress(accountItem) {
  // 1 登录账号
  // 2 获取角色列表 如果角色列表为空，创建角色
  // https://poe.faith.wang/api/character/create {"name":"t331","class":2}
  // 3 选择角色
  // 4 选择层数挂机 https://poe.faith.wang/api/battle/start {"mapId":"1_1_1"}
  // for (let index = 0; index < 3; index++) {
  //   await loginAndSelectCharacter(accountItem.name, accountItem.pwd, index).then(async () => {
  //     console.log(`角色${index}登录成功`);
  //     // 选择地图
  //     await API.chooseMap("1_1_1").then(() => {
  //       console.log(`角色${index}选择地图成功`);
  //     });
  //   });
  // }
  // await API.addGoodsRule().then(() => {
  //   console.log("添加筛选规则成功");
  // });
  // 1 登录账号
  // 2 选择角色
  // 3 选择层数挂机 https://poe.faith.wang/api/battle/start {"mapId":"1_1_1"
}
function parseAccountName(accountName, index) {
  // 将a666985233变化成t33
  return accountName.replace(/a6669852(\d+)/, (match, p1) => "t" + p1 + index);
}
