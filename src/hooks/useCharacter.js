import {
  upgradeStone,
  getCharacterInfo,
  changeClass,
  updateSkilltree,
  login,
  loginThrid,
  getCharacterList,
  getCharacterListThird,
  getBackpack,
  buyShop,
  insertStone,
  getSkillStones,
  createAccount,
  takeOff,
  equip,
} from "@/api";
import { useTokenStoreWithOut, useAccountStoreWithOut, useStore } from "@/stores";
import { loginProgress } from "./useLogin";
import { startEquipmentTransfer } from "./useTransfer";
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
  try {
    await loginProgress(account).then(async (res) => {
      if (res.token) {
        //    await
        accountToken = res.token;
        useTokenStoreWithOut().setToken(res.token);
        // await useTokenStore()
      } else {
        throw new Error("登录失败");
      }
      await getCharacterList().then(async (res) => {
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
  } catch (error) {
    throw new Error(error);
  }
}
export async function buySkillStone(skillStoneList, thirdToken) {
  let promises = [];
  skillStoneList.forEach((item) => {
    promises.push(buyShop(item, thirdToken));
  });
  await Promise.all(promises)
    .then(() => console.log("所有石头都购买完成."))
    .catch((err) => {
      console.error("An error occurred:", err);
      throw err;
    });
  // https://poe.faith.wang/api/shop/buy
  //  多重打击 {"itemId":"Multistrike_Support","quantity":1}
  //  横扫 {"itemId":"Sweep","quantity":1}
  //  快速攻击 Faster_Attacks_Support
  //  近战物理伤害 Melee_Physical_Damage_Support
  //  暴击率 Increased_Critical_Strikes_Support
  //  残暴 Brutality_Support
  // await buyShopItem();
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
  return accountName.replace(/a6669852(\d+)/, (match, p1) => "石昊" + p1 + index);
}
export const Character = {
  equipHelmet: async function ({ thirdToken }) {
    // 头盔
    // https://poe.faith.wang/api/character/backpack/1?type=1082331758592
    let pageCount = 1;
    let helmets = [];
    let currentCharacterInfo = await getCharacterInfo({ thirdToken }).then(async (data) => {
      return data;
    });

    // 获取背包和仓库
    for (let index = 0; index < 2; index++) {
      let query = { type: 1082331758592 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && helmets.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && helmets.push(...data.items);
          });
        }
      }
    }

    helmets = filterRequiredItems(helmets, currentCharacterInfo);
    let itemsWithMagic = helmets.filter((item) => item.magics && item.magics["12"]);
    let sortedItems = [...itemsWithMagic].sort((a, b) => {
      let magicA = a.magics && a.magics["12"];
      let magicB = b.magics && b.magics["12"];
      return magicB - magicA; // 降序排序
    });
    if (sortedItems.length > 0) {
      await equip(sortedItems[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
    }
  },
  equipAmulet: async function ({ thirdToken }) {
    // 项链
    // https://poe.faith.wang/api/character/backpack/1?type=281474976710656
    let pageCount = 1;
    let amulets = [];

    let currentCharacterInfo = await getCharacterInfo({ thirdToken }).then(async (data) => {
      return data;
    });
    // 获取背包和仓库
    for (let index = 0; index < 2; index++) {
      let query = { type: 281474976710656 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && amulets.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && amulets.push(...data.items);
          });
        }
      }
    }

    amulets = filterRequiredItems(amulets, currentCharacterInfo);
    // let itemsWithMagic = amulets.filter(
    //   (item) => item.magics && item.magics["8"]
    // );

    let sortedItems = [...amulets].sort((a, b) => {
      let sumA = 0;
      let sumB = 0;
      "78 79 80 81 82".split(" ").forEach((magicId) => {
        (a.magics || {})[magicId] && (sumA += a.magics[magicId][0] + a.magics[magicId][1]);
        (b.magics || {})[magicId] && (sumB += b.magics[magicId][0] + b.magics[magicId][1]);
      });
      return sumB - sumA; // 降序排序
    });
    console.log(sortedItems);
    if (sortedItems.length > 0) {
      await equip(sortedItems[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
    }
  },
  equipGlove: async function ({ thirdToken }) {
    // 手套
    // https://poe.faith.wang/api/character/backpack/1?type=2064384
    let pageCount = 1;
    let gloves = [];

    let currentCharacterInfo = await getCharacterInfo({ thirdToken }).then(async (data) => {
      return data;
    });

    // 获取背包和仓库
    for (let index = 0; index < 2; index++) {
      let query = { type: 2064384 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && gloves.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && gloves.push(...data.items);
          });
        }
      }
    }

    gloves = filterRequiredItems(gloves, currentCharacterInfo);
    let itemsWithMagic = gloves.filter((item) => item.magics && item.magics["15"]);
    let sortedItems = [...itemsWithMagic].sort((a, b) => {
      let magicA = a.magics && a.magics["15"];
      let magicB = b.magics && b.magics["15"];
      return magicB - magicA; // 降序排序
    });
    if (sortedItems.length > 0) {
      await equip(sortedItems[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
    }
  },
  equipShoe: async function ({ thirdToken }) {
    //鞋
    // https://poe.faith.wang/api/character/backpack/1?type=132120576
    let pageCount = 1;
    let shoes = [];

    let currentCharacterInfo = await getCharacterInfo({ thirdToken }).then(async (data) => {
      return data;
    });
    // 获取背包和仓库
    for (let index = 0; index < 2; index++) {
      let query = { type: 132120576 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && shoes.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && shoes.push(...data.items);
          });
        }
      }
    }

    shoes = filterRequiredItems(shoes, currentCharacterInfo);
    let itemsWithMagic = shoes.filter((item) => item.magics && item.magics["54"]);
    let sortedItems = [...itemsWithMagic].sort((a, b) => {
      let magicA = a.magics && a.magics["54"];
      let magicB = b.magics && b.magics["54"];
      return magicB - magicA; // 降序排序
    });
    if (sortedItems.length > 0) {
      await equip(sortedItems[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
    }
  },
  equipBelt: async function ({ thirdToken }) {
    // 腰带
    // https://poe.faith.wang/api/character/backpack/1?type=140737488355328
    let pageCount = 1;
    let belts = [];

    let currentCharacterInfo = await getCharacterInfo({ thirdToken }).then(async (data) => {
      return data;
    });
    // 获取背包和仓库
    for (let index = 0; index < 2; index++) {
      let query = { type: 140737488355328 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && belts.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && belts.push(...data.items);
          });
        }
      }
    }

    belts = filterRequiredItems(belts, currentCharacterInfo);
    let itemsWithMagic45 = belts.filter((item) => item.fixedMagics && item.fixedMagics["45"]);
    let sortedItems = [...itemsWithMagic45].sort((a, b) => {
      let magicA = a.fixedMagics && a.fixedMagics["45"];
      let magicB = b.fixedMagics && b.fixedMagics["45"];
      return magicB - magicA; // 降序排序
    });
    if (sortedItems.length > 0) {
      await equip(sortedItems[0].id, getTokenInfo(thirdToken).characterId, { thirdToken });
    }
  },
  equipRing: async function ({ thirdToken }) {
    // https://poe.faith.wang/api/character/backpack/1?type=562949953421312
    let pageCount = 1;
    let rings = [];
    let currentCharacterInfo;
    // 先脱掉当前戒指
    await getCharacterInfo({ thirdToken }).then(async (data) => {
      currentCharacterInfo = data;
      console.log(data.equipmentSlots);
    });
    let leftRingId = currentCharacterInfo.equipmentSlots.leftRing && currentCharacterInfo.equipmentSlots.leftRing.id;
    let rightRingId = currentCharacterInfo.equipmentSlots.rightRing && currentCharacterInfo.equipmentSlots.rightRing.id;
    leftRingId && (await takeOff(leftRingId, getTokenInfo(thirdToken).characterId, { thirdToken }));
    rightRingId && (await takeOff(rightRingId, getTokenInfo(thirdToken).characterId, { thirdToken }));

    // 获取背包和仓库的戒指
    for (let index = 0; index < 2; index++) {
      let query = { type: 562949953421312 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && rings.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && rings.push(...data.items);
          });
        }
      }
    }

    rings = filterRequiredItems(rings, currentCharacterInfo);
    let itemsWithMagic15 = rings.filter(
      (item) => item.name == "英灵宝环"
      // item.magics &&
      // item.magics["15"] &&
      // (item.magics["78"] || (item.fixedMagics && item.fixedMagics["78"]))
    );
    // console.log(itemsWithMagic15);
    if (itemsWithMagic15.length < 2) {
      itemsWithMagic15 = rings.filter((item) => item.magics && item.magics["15"]);
    }

    itemsWithMagic15[0] && (await equip(itemsWithMagic15[0].id, getTokenInfo(thirdToken).characterId, { thirdToken }));
    itemsWithMagic15[1] && (await equip(itemsWithMagic15[1].id, getTokenInfo(thirdToken).characterId, { thirdToken }));
  },
  equipWeapon: async function ({ thirdToken }) {
    // https://poe.faith.wang/api/character/backpack/1?type=511
    let pageCount = 1;
    let weapons = [];
    let currentCharacterInfo;
    // 先脱掉当前武器
    await getCharacterInfo({ thirdToken }).then(async (data) => {
      currentCharacterInfo = data;
      let mainHandId = data.equipmentSlots.mainHand && data.equipmentSlots.mainHand.id;
      let offHandId = data.equipmentSlots.offHand && data.equipmentSlots.offHand.id;
      mainHandId && (await takeOff(mainHandId, getTokenInfo(thirdToken).characterId), { thirdToken });
      offHandId && (await takeOff(offHandId, getTokenInfo(thirdToken).characterId), { thirdToken });
    });

    for (let index = 0; index < 2; index++) {
      let query = { type: 511 };
      if (index == 1) {
        query.storage = true;
      }
      await getBackpack(1, query, { thirdToken }).then((data) => {
        console.log(data);
        let total = parseInt(data.total);
        pageCount = parseInt(total / 30) + 1;
        data.items && weapons.push(...data.items);
      });
      if (pageCount > 1) {
        for (let index = 2; index <= pageCount; index++) {
          await getBackpack(index, query, { thirdToken }).then((data) => {
            data.items && weapons.push(...data.items);
          });
        }
      }
    }
    weapons = filterRequiredItems(weapons, currentCharacterInfo);
    let sortedWeapons = [...weapons].sort((a, b) => {
      let sumA = a.physicalDamage.max + a.physicalDamage.min;
      let sumB = b.physicalDamage.max + b.physicalDamage.min;
      "78 79 80 81 82".split(" ").forEach((magicId) => {
        (a.magics || {})[magicId] && (sumA += a.magics[magicId][0] + a.magics[magicId][1]);
        (b.magics || {})[magicId] && (sumB += b.magics[magicId][0] + b.magics[magicId][1]);
      });
      return sumB - sumA; // 降序排序
    });

    let maxDamageItem = sortedWeapons[0]; // 最大的item
    let secondMaxDamageItem = sortedWeapons[1]; // 第二大的item
    console.log(maxDamageItem, secondMaxDamageItem);
    await equip(maxDamageItem.id, getTokenInfo(thirdToken).characterId, { thirdToken });
    await equip(secondMaxDamageItem.id, getTokenInfo(thirdToken).characterId, { thirdToken });
  },
  findEndlessGarment: async function ({ thirdToken, character }) {
    // 无尽之衣
    // let result = [];
    // let pageCount = 1;
    // for (let index = 0; index < 2; index++) {
    //   let query = { type: 17045651456, rarity: 4 };
    //   if (index == 1) {
    //     query.storage = true;
    //   }
    //   await getBackpack(1, query, { thirdToken }).then((data) => {
    //     let total = parseInt(data.total);
    //     pageCount = parseInt(total / 30) + 1;
    //     data.items && result.push(...data.items);
    //   });
    //   if (pageCount > 1) {
    //     for (let index = 2; index <= pageCount; index++) {
    //       await getBackpack(index, query, { thirdToken }).then((data) => {
    //         data.items && result.push(...data.items);
    //       });
    //     }
    //   }
    // }
    // if (result.length > 0) {
    //   console.log("当前角色: " + name);
    //   console.log("无尽之衣结果:", result);
    // }

    // return result;
    findEquipment(17045651456, { thirdToken, character });
    // findEquipment(132120576, { thirdToken, character });
  },

  equipEndlessGarment: async function () {
    // 将登录账号的无尽之衣装备上
    // https://poe.faith.wang/api/equipment/equip {"equipmentId": "655017e8282c350be4af7480","characterId": "654fda08282c350be47d3574"}
    // getTokenInfo(currentToken).characterId
    equip(currentSellItem.id, getTokenInfo(currentToken).characterId);
  },
  insertStoneToEndlessGarment: async function (skillStoneList, thirdToken, currentSellItem) {
    // insertStone
    // 获取当前账号的宝石，然后给无尽之衣镶嵌上
    await getSkillStones(1, {}, thirdToken).then(async (data) => {
      // console.log(data);
      // 获取宝石的id
      let promises = [];
      skillStoneList.forEach((skillId, index) => {
        let stoneId = data.items.find((item) => item.skillId === skillId).id;
        promises.push(insertStone(currentSellItem.id, index + 1, stoneId, thirdToken));
      });
      await Promise.all(promises)
        .then(() => console.log("所有石头镶嵌完成."))
        .catch((err) => {
          console.error("An error occurred:", err);
          throw err;
        });
    });
    await equip(currentSellItem.id, getTokenInfo(thirdToken.thirdToken).characterId, thirdToken);
  },
};
async function findEquipment(type, { thirdToken, character }) {
  // 无尽之衣
  let result = [];
  let pageCount = 1;
  for (let index = 0; index < 2; index++) {
    let query = { type, rarity: 4 };
    if (index == 1) {
      query.storage = true;
    }
    await getBackpack(1, query, { thirdToken }).then((data) => {
      let total = parseInt(data.total);
      pageCount = parseInt(total / 30) + 1;
      data.items && result.push(...data.items);
    });
    if (pageCount > 1) {
      for (let index = 2; index <= pageCount; index++) {
        await getBackpack(index, query, { thirdToken }).then((data) => {
          data.items && result.push(...data.items);
        });
      }
    }
  }
  if (result.length > 0) {
    console.log("当前角色: " + character.name);
    console.log("结果:", result);
    if (character.cantTransfer) {
      console.log("当前角色不支持转移");
      return;
    }
    let accounts = useAccountStoreWithOut().getAllAccountTokenInfo();
    // 找到角色为t20的账号
    let account = accounts.find((item) => item.username == "a66698522");

    let buyCharacter = account.tokenInfo.characters[0];
    if (thirdToken == buyCharacter.token) {
      console.log("不能转移给自己");
      return;
    }
    for (let index = 0; index < result.length; index++) {
      const equip = result[index];
      await startEquipmentTransfer({ sellToken: thirdToken, buyToken: buyCharacter.token, equipment: equip });
    }
  }

  return result;
}
export async function getEquipmentList(type) {
  // 17045651456 无尽之衣 132120576 鞋子
  let accounts = useAccountStoreWithOut().getAllAccountTokenInfo();
  // 找到角色为t20的账号
  let account = accounts.find((item) => item.username == "a66698522");

  let sellCharacter = account.tokenInfo.characters[0];
  let sellToken = sellCharacter.token;
  // 无尽之衣
  let result = [];
  let pageCount = 1;
  for (let index = 0; index < 2; index++) {
    let query = { type, rarity: 4 };
    if (index == 1) {
      query.storage = true;
    }
    await getBackpack(1, query, { thirdToken: sellToken }).then((data) => {
      let total = parseInt(data.total);
      pageCount = parseInt(total / 30) + 1;
      data.items && result.push(...data.items);
    });
    if (pageCount > 1) {
      for (let index = 2; index <= pageCount; index++) {
        await getBackpack(index, query, { thirdToken: sellToken }).then((data) => {
          data.items && result.push(...data.items);
        });
      }
    }
  }
  // if (result.length > 0) {
  //   console.log("当前角色: " + character.name);
  //   console.log("结果:", result);
  //   if (character.cantTransfer) {
  //     console.log("当前角色不支持转移");
  //     return;
  //   }
  //   let accounts = useAccountStoreWithOut().getAllAccountTokenInfo();
  //   // 找到角色为t20的账号
  //   let account = accounts.find((item) => item.username == "a66698522");

  //   let buyCharacter = account.tokenInfo.characters[0];
  //   if (thirdToken == buyCharacter.token) {
  //     console.log("不能转移给自己");
  //     return;
  //   }
  //   for (let index = 0; index < result.length; index++) {
  //     const equip = result[index];
  //     await startEquipmentTransfer(thirdToken, buyCharacter.token, equip);
  //   }
  // }

  return result;
}
function filterRequiredItems(items, currentCharacterInfo) {
  // 过滤掉不符合要求的物品
  return items.filter((item) => {
    let result = true;
    if (item.requirements) {
      Object.keys(item.requirements).forEach((key) => {
        result &= currentCharacterInfo[key] >= item.requirements[key];
      });
    }
    return result;
  });
}
function getTokenInfo(token) {
  if (!token) {
    return {};
  }
  const base64Url = token.split(".")[1];
  const base64 = encodeURIComponent(base64Url).replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
}
