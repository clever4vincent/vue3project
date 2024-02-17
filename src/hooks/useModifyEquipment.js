import { modify, craft } from "@/api";
import { sleep } from "@/utils";
import { CurrencyBeanEnum } from "@/enums/appEnum";
import { useStoreWithOut } from "@/stores";
import { nextTick, toRaw } from "vue";
import { parseItemMagics } from "@/hooks";
import { updateEquipmentItemLocal } from "@/hooks";
import { cloneDeep } from "lodash-es";
const audio = new Audio("https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3");
// 当前的角色上架物品，然后将Token切换成选择的角色，再购买物品，购买物品后，再切回Token.
export async function doRenovation(equipmentModify, { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount }, thirdToken) {
  // 将装备的状态改成改造中
  // equipmentModify.equipment.isModifying = true;

  // await updateEquipmentItemLocal(thirdToken, toRaw(equipmentModify.equipment));
  let { result, keepCount, equipmentResult, error } = await startRenovation(
    equipmentModify,
    { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
    thirdToken
  );
  equipmentModify.isModifyRunning = false;
  if (error) {
    return;
  }
  // useStoreWithOut().isModifyRunning = false;
  if (keepCount <= 0) {
    audio.play();
    console.log("次数用完了");
    await sleep(100);
    audio.pause();
    audio.currentTime = 0;
  } else {
    if (result) {
      audio.play();
      console.log("达标了");
      await sleep(100);
      audio.pause();
      audio.currentTime = 0;
    } else {
      console.log("中止了！");
    }
  }
  //更新装备列表中的装备
  // equipmentResult.isModifying = false;
  await updateEquipmentItemLocal(thirdToken, equipmentResult);
}
export async function startRenovation(
  equipmentModify,
  { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount = Number.MAX_SAFE_INTEGER },
  thirdToken
) {
  let currentEquipment = equipmentModify.equipment;
  // 进入循环改造前的处理，将没有词条的装备使用蜕变石改成有词条的装备
  if (type === CurrencyBeanEnum.orbOfAlteration.value) {
    if (currentEquipment.rarity === 1) {
      // 如果是白色装备，使用蜕变石改成蓝色装备

      await modify(currentEquipment.id, CurrencyBeanEnum.orbOfTransmutation.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
    }
    if (currentEquipment.rarity === 3) {
      // 如果黄色装备，先使用重铸石，再使用蜕变石改成蓝色装备
      await modify(currentEquipment.id, CurrencyBeanEnum.orbOfScouring.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
      if (currentEquipment.rarity == 1) {
        await modify(currentEquipment.id, CurrencyBeanEnum.orbOfTransmutation.value, thirdToken).then((res) => {
          let equipment = parseItemMagics(res.equipment);
          currentEquipment = equipment;
          equipmentModify.equipment = equipment;
        });
      }
    }
  }
  if (type === CurrencyBeanEnum.chaosOrb.value) {
    if (currentEquipment.rarity !== 3) {
      // 如果不是黄色装备，提示
      // console.log("不是黄色装备，不能使用混沌石改造");
      // return { result: false, keepCount: retryCount, equipmentResult: currentEquipment, error: true };
      if (currentEquipment.rarity == 1) {
        await modify(currentEquipment.id, CurrencyBeanEnum.orbOfTransmutation.value, thirdToken).then((res) => {
          let equipment = parseItemMagics(res.equipment);
          currentEquipment = equipment;
          equipmentModify.equipment = equipment;
        });
      }
      // 使用富豪石改造
      await modify(currentEquipment.id, CurrencyBeanEnum.regalOrb.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
    } else {
      // 如果是黄色装备，先使用混沌石改造
      await modify(currentEquipment.id, CurrencyBeanEnum.chaosOrb.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
    }
  }
  if (type === CurrencyBeanEnum.orbOfAlchemy.value) {
    // 点金石改造
    if (currentEquipment.rarity !== 1) {
      // 如果不是白色装备，重铸石改造
      await modify(currentEquipment.id, CurrencyBeanEnum.orbOfScouring.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
    }
    // 如果是白色装备，先使用点金石改造
    await modify(currentEquipment.id, CurrencyBeanEnum.orbOfAlchemy.value, thirdToken).then((res) => {
      let equipment = parseItemMagics(res.equipment);
      currentEquipment = equipment;
      equipmentModify.equipment = equipment;
    });
  }
  // 进入循环改造
  let result = false;
  while (!result && equipmentModify.isModifyRunning && retryCount-- > 0) {
    result = isMatchCustomAttr(currentEquipment, customAttrs, isOpenEEE || isOpenMakeup ? 2 : termCount);
    // 如果不满足条件，就继续改造
    if (!result) {
      try {
        //如果是点金石改造，就先使用重铸石改造
        if (type === CurrencyBeanEnum.orbOfAlchemy.value) {
          await modify(currentEquipment.id, CurrencyBeanEnum.orbOfScouring.value, thirdToken).then((res) => {
            let equipment = parseItemMagics(res.equipment);
            currentEquipment = equipment;
            equipmentModify.equipment = equipment;
          });
        }
        await modify(currentEquipment.id, type, thirdToken).then((res) => {
          let equipment = parseItemMagics(res.equipment);
          currentEquipment = equipment;
          equipmentModify.equipment = equipment;
        });
      } catch (error) {
        console.log(error);
      }
    }
    // 如果改造后的词缀条数只有1条，就是用增幅石改造
    if (Object.keys(currentEquipment.affixes).length === 1) {
      try {
        await modify(currentEquipment.id, CurrencyBeanEnum.orbOfAugmentation.value, thirdToken).then((res) => {
          let equipment = parseItemMagics(res.equipment);
          currentEquipment = equipment;
          equipmentModify.equipment = equipment;
        });
      } catch (error) {
        console.log(error);
      }

      result = isMatchCustomAttr(currentEquipment, customAttrs, isOpenEEE || isOpenMakeup ? 2 : termCount);
    }
  }
  console.log("普通改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
  if (
    (type === CurrencyBeanEnum.chaosOrb.value || type === CurrencyBeanEnum.orbOfAlchemy.value) &&
    equipmentModify.isModifyRunning &&
    retryCount > 0 &&
    isOpenEEE
  ) {
    // 判断改造后的词条数量，如果大于等于5条，就重新进入改造流程
    if (Object.keys(currentEquipment.affixes).length >= 5) {
      // 先判断改造后的词条数量是否满足要求
      result = isMatchCustomAttr(currentEquipment, customAttrs, termCount);
      if (!result) {
        let { result1, equipmentResult } = await startRenovation(
          equipmentModify,
          { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
          thirdToken
        );
        currentEquipment = equipmentResult;
        result = result1;
      }
    } else {
      // 如果小于5条，就使用崇高石改造到5条
      //先判断当前条数与目标条数的差值
      let diff = 5 - Object.keys(currentEquipment.affixes).length;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          await modify(currentEquipment.id, CurrencyBeanEnum.exaltedOrb.value, thirdToken).then((res) => {
            let equipment = parseItemMagics(res.equipment);
            currentEquipment = equipment;
            equipmentModify.equipment = equipment;
          });
        }
      }

      console.log("崇高石改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
      //判断改造后的词条数量是否满足要求
      result = isMatchCustomAttr(currentEquipment, customAttrs, termCount);
      if (!result) {
        let { result1, equipmentResult } = await startRenovation(
          equipmentModify,
          { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
          thirdToken
        );
        currentEquipment = equipmentResult;
        result = result1;
      }
    }
  }
  if (type === CurrencyBeanEnum.orbOfAlteration.value && equipmentModify.isModifyRunning && retryCount > 0 && (isOpenMakeup || isOpenEEE)) {
    // 比较增幅之后的词条数量是否满足要求
    if (result) {
      // 使用富豪石
      await modify(currentEquipment.id, CurrencyBeanEnum.regalOrb.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
      console.log("富豪石改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
      if (isOpenEEE) {
        // 如果满足要求，连续使用2次崇高石
        for (let i = 0; i < 1; i++) {
          await modify(currentEquipment.id, CurrencyBeanEnum.exaltedOrb.value, thirdToken).then((res) => {
            let equipment = parseItemMagics(res.equipment);
            currentEquipment = equipment;
            equipmentModify.equipment = equipment;
          });
        }
        console.log("崇高石改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
        result = isMatchCustomAttr(currentEquipment, customAttrs, termCount);
        if (!result) {
          let { result1, equipmentResult } = await startRenovation(
            equipmentModify,
            { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
            thirdToken
          );
          currentEquipment = equipmentResult;
          result = result1;
        }
      } else {
        // 如果使用富豪石之后，词条数量不满足要求，就重新进入改造流程
        result = isMatchCustomAttr(currentEquipment, customAttrs, termCount);
        if (!result) {
          let { result1, equipmentResult } = await startRenovation(
            equipmentModify,
            { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
            thirdToken
          );
          currentEquipment = equipmentResult;
          result = result1;
        }
      }
    } else {
      // 重新使用改造石
      let { result1, equipmentResult } = await startRenovation(
        equipmentModify,
        { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
        thirdToken
      );
      currentEquipment = equipmentResult;
      result = result1;
    }
  }
  // 最后再匹配一次结果
  result = isMatchCustomAttr(currentEquipment, customAttrs, termCount);
  return { result, keepCount: retryCount, equipmentResult: currentEquipment };
}

export async function doLockRenovation(equipmentModify, thirdToken) {
  let retryCount = equipmentModify.retryCount;
  console.log("equipmentModify", equipmentModify);
  let result = false;
  if (!(equipmentModify.makeType === CurrencyBeanEnum.lockPre.value || equipmentModify.makeType === CurrencyBeanEnum.lockBack.value)) {
    console.log("不是锁定前缀或者后缀");
    return;
  }
  let type = equipmentModify.makeType === CurrencyBeanEnum.lockPre.value ? 2 : 1;
  let lockType = equipmentModify.makeType === CurrencyBeanEnum.lockPre.value ? CurrencyBeanEnum.lockPre.type : CurrencyBeanEnum.lockBack.type;
  while (equipmentModify.isModifyRunning && retryCount-- > 0) {
    // 先判断当前装备修改的类型

    // 如果是锁定前缀，先判断装备词条中是否有前缀之
    if (equipmentModify.equipment.affixes.filter((affix) => affix.isCrafted && affix.type == type).length > 0) {
      // 有的话判断后缀是否满足要求
      // 先判断除开前缀之这个词条后的后缀的词条数
      let suffixCount = equipmentModify.equipment.affixes.filter((affix) => !affix.isCrafted && affix.type == type).length;

      if (suffixCount > 0) {
        // 根据后缀的词条数判断是否满足要求
        result = isMatchCustomAttr(equipmentModify.equipment, equipmentModify.customAttrs, suffixCount);

        if (result) {
          // 如果后缀的条数等于达标的条数，就说明满足要求，不再改造
          if (suffixCount == equipmentModify.termCount) {
            equipmentModify.isModifyRunning = false;
          } else {
            // 如果后缀的条数小于达标的条数，就使用崇高石改造
            await modify(equipmentModify.equipment.id, CurrencyBeanEnum.exaltedOrb.value, thirdToken).then((res) => {
              equipmentModify.equipment = parseItemMagics(res.equipment);
            });
          }
        } else {
          // 如果后缀的条数不满足要求，就使用进入剥离流程
          await modify(equipmentModify.equipment.id, CurrencyBeanEnum.orbOfAnnulment.value, thirdToken).then((res) => {
            equipmentModify.equipment = parseItemMagics(res.equipment);
          });
        }
      } else {
        // 如果没有后缀，就使用崇高石改造
        await modify(equipmentModify.equipment.id, CurrencyBeanEnum.exaltedOrb.value, thirdToken).then((res) => {
          equipmentModify.equipment = parseItemMagics(res.equipment);
        });
      }
    } else {
      // 如果没有锁定前缀，就锁定前缀
      await craft(equipmentModify.equipment.id, lockType, thirdToken).then((res) => {
        equipmentModify.equipment = parseItemMagics(res.equipment);
      });
    }
  }

  equipmentModify.isModifyRunning = false;
  if (result) {
    console.log("达标了", equipmentModify);
  } else {
    console.log("中止了！", equipmentModify);
  }
  await updateEquipmentItemLocal(thirdToken, toRaw(equipmentModify.equipment));
}
export async function doProcessArea(equipmentModify, thirdToken) {
  let retryCount = equipmentModify.retryCount;
  console.log("equipmentModify", equipmentModify);
  let result = false;

  while (equipmentModify.isModifyRunning && retryCount-- > 0) {
    // 判断是否已经包含工艺台词条，有的话就去除
    let includeCrafted = equipmentModify.equipment?.affixes?.some((affix) => affix.isCrafted);
    if (includeCrafted) {
      // 如果有工艺台词条，就去除词条
      await craft(equipmentModify.equipment.id, 0, thirdToken).then((res) => {
        equipmentModify.equipment = parseItemMagics(res.equipment);
      });
    }
    // 如果没有工艺台词条，就使用工艺台改造
    await craft(equipmentModify.equipment.id, equipmentModify.processArea.craftId, thirdToken).then((res) => {
      equipmentModify.equipment = parseItemMagics(res.equipment);
    });
    // 判断是否满足要求
    let affix = equipmentModify.equipment.affixes.filter((affix) => affix.isCrafted);
    if (affix.length > 0) {
      // equipmentModify.processArea.affix.magics
      for (let key in affix[0].magics) {
        // equipmentModify.equipment.magics[key] = affix[0].magics[key];
        if (affix[0].magics[key][0] == equipmentModify.processArea.affix.magics[key][0].max) {
          result = true;
          equipmentModify.isModifyRunning = false;
          break;
        }
      }
    }
  }
  equipmentModify.isModifyRunning = false;
  if (result) {
    console.log("达标了", equipmentModify);
  } else {
    console.log("中止了！", equipmentModify);
  }
  await updateEquipmentItemLocal(thirdToken, toRaw(equipmentModify.equipment));
}
export function isMatchCustomAttr(equipment, customAttrs, termCount) {
  // 匹配成功的个数
  let count = 0;
  let mustCount = 0;
  let newCustomAttrs = cloneDeep(customAttrs);
  let matchIndex = -1;
  parseItemMagics(equipment)
    .magicsText.split("|")
    .forEach((div) => {
      // customAttrs是一个数组
      // 遍历数组，判断是否包含自定义属性中的词条
      let result = newCustomAttrs.some((customAttr, index) => {
        if (div.replace(/\d+/g, "#").indexOf(customAttr.name) > -1) {
          // 如果有这个，就判断数字是否满足自定义属性中的值
          let match = div.match(/\d+-\d+|\d+(\.\d+)?/g);
          let numbers = match ? match.map((str) => (str.includes("-") ? str.split("-").map(Number) : Number(str))) : [];
          // console.log("numbers", numbers);
          if (numbers.length > 1) {
            // 这是 10 - 100 的数据类型
            if (numbers[1] >= customAttr.value) {
              // console.log(`满足条件的词条--${customAttr.name} : ${numbers[1]}`);
              if (customAttr.isMust) {
                mustCount++;
              } else {
                count++;
              }
              matchIndex = index;
              return true;
            }
            return false;
          } else {
            if (numbers[0] >= customAttr.value) {
              // console.log(`满足条件的词条--${customAttr.name} : ${numbers[0]}`);
              if (customAttr.isMust) {
                mustCount++;
              } else {
                count++;
              }
              // 如果这条自定义属性中被匹配了，下次循环就不再匹配这条
              // customAttrs.splice(index, 1);
              matchIndex = index;
              return true;
            }
            return false;
          }
        }
      });
      // 如果有匹配成功的，就将这个自定义属性从数组中删除
      if (result) {
        newCustomAttrs.splice(matchIndex, 1);
        // console.log("newCustomAttrs", newCustomAttrs);
      }
      // console.log("newCustomAttrs", newCustomAttrs);
      // if (result) {
      //   count++;
      // }
    });
  // 遍历customAttrs，统计对象中isMust为true的个数,其他对象为可选对象，只要有一个满足就算成功。
  // 在mustCount == isMmustCount情况下，如果有可选对象的话 count = 1 就算成功 没有的话，就不管他
  // 比较mustCount 和 customAttrs数组的大小，如果相等说明都是必须的，如果不相等，说明有可选的
  let isMustCount = customAttrs.filter((attr) => attr.isMust).length;
  let isOptionalArr = customAttrs.some((attr) => !attr.isMust);
  let isOptionalCount = isOptionalArr ? 1 : 0;
  if (mustCount === isMustCount) {
    if (isOptionalCount > 0) {
      // console.log("mustCount " + mustCount);
      // console.log("count " + count);
      if (parseInt(mustCount) + parseInt(count) >= termCount) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export async function doLinkAction(equipmentModify, thirdToken) {
  //使用链接石链接装备上的词条
  let currentEquipment = equipmentModify.equipment;
  let result = false;
  if (currentEquipment.sockets.length == 1) {
    console.log("已经达标了");
    equipmentModify.isLinkRunning = false;
    return;
  }
  while (!result && equipmentModify.isLinkRunning) {
    try {
      await modify(currentEquipment.id, CurrencyBeanEnum.orbOfFusing.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        equipmentModify.equipment = equipment;
      });
    } catch (error) {
      console.log(error);
    }
    result = currentEquipment.sockets.length == 1;
  }
  equipmentModify.isLinkRunning = false;
  if (result) {
    console.log("达标了");
  } else {
    console.log("中止了！");
  }
}
