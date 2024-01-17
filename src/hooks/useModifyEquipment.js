import { modify } from "@/api";
import { sleep } from "@/utils";
import { CurrencyBeanEnum } from "@/enums/appEnum";
import { useStoreWithOut } from "@/stores";
import { parseItemMagics } from "@/hooks";
import { updateEquipmentItemLocal } from "@/hooks";
const audio = new Audio("https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3");
// 当前的角色上架物品，然后将Token切换成选择的角色，再购买物品，购买物品后，再切回Token.
export async function doRenovation(equipment, { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount }, thirdToken) {
  let { result, keepCount, equipmentResult } = await startRenovation(
    equipment,
    { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
    thirdToken
  );
  useStoreWithOut().isModifyRunning = false;
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
  await updateEquipmentItemLocal(thirdToken, equipmentResult);
}
export async function startRenovation(
  equipment,
  { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount = Number.MAX_SAFE_INTEGER },
  thirdToken
) {
  let currentEquipment = equipment;
  // 进入循环改造前的处理，将没有词条的装备使用蜕变石改成有词条的装备
  if (currentEquipment.rarity === 1) {
    // 如果是白色装备，使用蜕变石改成蓝色装备
    await modify(currentEquipment.id, CurrencyBeanEnum.orbOfTransmutation.value, thirdToken).then((res) => {
      let equipment = parseItemMagics(res.equipment);
      currentEquipment = equipment;
      useStoreWithOut().equipmentModify = equipment;
    });
  }
  if (currentEquipment.rarity === 3) {
    // 如果黄色装备，先使用重铸石，再使用蜕变石改成蓝色装备
    await modify(currentEquipment.id, CurrencyBeanEnum.orbOfScouring.value, thirdToken).then((res) => {
      let equipment = parseItemMagics(res.equipment);
      currentEquipment = equipment;
      useStoreWithOut().equipmentModify = equipment;
    });
    await modify(currentEquipment.id, CurrencyBeanEnum.orbOfTransmutation.value, thirdToken).then((res) => {
      let equipment = parseItemMagics(res.equipment);
      currentEquipment = equipment;
      useStoreWithOut().equipmentModify = equipment;
    });
  }

  // 进入循环改造
  let result = false;
  while (!result && useStoreWithOut().isModifyRunning && retryCount-- > 0) {
    result = isMatchCustomAttr(currentEquipment, customAttrs, isOpenEEE || isOpenMakeup ? 2 : termCount);
    // 如果不满足条件，就继续改造
    if (!result) {
      await modify(currentEquipment.id, type, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        useStoreWithOut().equipmentModify = equipment;
      });
    }
    // 如果改造后的词缀条数只有1条，就是用增幅石改造
    if (Object.keys(currentEquipment.affixes).length === 1) {
      await modify(currentEquipment.id, CurrencyBeanEnum.orbOfAugmentation.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        useStoreWithOut().equipmentModify = equipment;
      });
      result = isMatchCustomAttr(currentEquipment, customAttrs, isOpenEEE || isOpenMakeup ? 2 : termCount);
    }
  }
  console.log("普通改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
  if (type === CurrencyBeanEnum.orbOfAlteration.value && useStoreWithOut().isModifyRunning && retryCount > 0 && (isOpenMakeup || isOpenEEE)) {
    // 比较增幅之后的词条数量是否满足要求
    if (result) {
      // 使用富豪石
      await modify(currentEquipment.id, CurrencyBeanEnum.regalOrb.value, thirdToken).then((res) => {
        let equipment = parseItemMagics(res.equipment);
        currentEquipment = equipment;
        useStoreWithOut().equipmentModify = equipment;
      });
      console.log("富豪石改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
      // 如果使用富豪石之后，词条数量不满足要求，就重新进入改造流程
      let result = isMatchCustomAttr(currentEquipment, customAttrs, isOpenEEE ? 3 : termCount);
      if (!result) {
        let { result1, equipmentResult } = await startRenovation(
          currentEquipment,
          { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
          thirdToken
        );
        currentEquipment = equipmentResult;
        result = result1;
      } else {
        if (isOpenEEE) {
          // 如果满足要求，连续使用3次崇高石
          for (let i = 0; i < 3; i++) {
            await modify(currentEquipment.id, CurrencyBeanEnum.exaltedOrb.value, thirdToken).then((res) => {
              let equipment = parseItemMagics(res.equipment);
              currentEquipment = equipment;
              useStoreWithOut().equipmentModify = equipment;
            });
          }
          console.log("崇高石改造结果", parseItemMagics(currentEquipment).magicsText.split("|"));
          result = isMatchCustomAttr(currentEquipment, customAttrs, termCount);
          if (!result) {
            let { result1, equipmentResult } = await startRenovation(
              currentEquipment,
              { customAttrs, type, termCount, isOpenMakeup, isOpenEEE, retryCount },
              thirdToken
            );
            currentEquipment = equipmentResult;
            result = result1;
          }
        }
      }
    } else {
      // 重新使用改造石
      let { result1, equipmentResult } = await startRenovation(
        currentEquipment,
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
export function isMatchCustomAttr(equipment, customAttrs, termCount) {
  // 匹配成功的个数
  let count = 0;
  let mustCount = 0;
  parseItemMagics(equipment)
    .magicsText.split("|")
    .forEach((div) => {
      // customAttrs是一个数组
      // 遍历数组，判断是否包含自定义属性中的词条
      let result = customAttrs.some((customAttr) => {
        if (div.replace(/\d+/g, "#").indexOf(customAttr.name) > -1) {
          // 如果有这个，就判断数字是否满足自定义属性中的值
          let match = div.match(/\d+-\d+|\d+/g);
          let numbers = match ? match.map((str) => (str.includes("-") ? str.split("-").map(Number) : Number(str))) : [];
          if (numbers.length > 1) {
            // 这是 10 - 100 的数据类型
            if (numbers[1] >= customAttr.value) {
              // console.log(`满足条件的词条--${customAttr.name} : ${numbers[1]}`);
              if (customAttr.isMust) {
                mustCount++;
              } else {
                count++;
              }
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
              return true;
            }
            return false;
          }
        }
      });
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
