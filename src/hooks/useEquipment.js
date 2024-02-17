import localforage from "localforage";
import { getBackpack } from "@/api";
import { magics } from "@/lib/data";
export const equipmentFilterTypes = {
  1: "单手剑",
  2: "单手斧",
  4: "法杖",
  8: "爪",
  16: "匕首",
  32: "细剑",
  64: "单手锤",
  128: "短杖",
  256: "符文匕首",
  512: "弓",
  1024: "长杖",
  2048: "双手剑",
  4096: "双手斧",
  8192: "双手锤",
  16384: "战杖",
  32768: "手套",
  65536: "手套",
  131072: "手套",
  262144: "手套",
  524288: "手套",
  1048576: "手套",
  2097152: "鞋子",
  4194304: "鞋子",
  8388608: "鞋子",
  16777216: "鞋子",
  33554432: "鞋子",
  67108864: "鞋子",
  134217728: "胸甲",
  268435456: "胸甲",
  536870912: "胸甲",
  1073741824: "胸甲",
  2147483648: "胸甲",
  4294967296: "胸甲",
  8589934592: "胸甲",
  17179869184: "头部",
  34359738368: "头部",
  68719476736: "头部",
  137438953472: "头部",
  274877906944: "头部",
  549755813888: "头部",
  1099511627776: "盾牌",
  2199023255552: "盾牌",
  4398046511104: "盾牌",
  8796093022208: "盾牌",
  17592186044416: "盾牌",
  35184372088832: "盾牌",
  70368744177664: "箭袋",
  140737488355328: "腰带",
  281474976710656: "项链",
  562949953421312: "戒指",
};
export const getEquipmentNetwork = async (thirdToken) => {
  let result = [];
  let pageCount = 1;
  let allPromise = [];
  for (let index = 0; index < 2; index++) {
    let query = {};
    if (index == 1) {
      query.storage = true;
    }
    await getBackpack(1, query, thirdToken).then((data) => {
      let total = parseInt(data.total);
      pageCount = parseInt(total / 30) + 1;
      data.items && result.push(...data.items);
    });
    if (pageCount > 1) {
      for (let index = 2; index <= pageCount; index++) {
        allPromise.push(getBackpack(index, query, thirdToken));
      }
    }
  }
  await Promise.all(allPromise).then((res) => {
    res.forEach((data) => {
      data.items && result.push(...data.items);
    });
  });
  let parseList = parseMagics(result);
  // list.value = orginList;
  // scroller?.value?.updateVisibleItems();
  // 更新装备改造列表中的装备。如果该装备不在改造中才更新

  localforage.setItem(thirdToken.character.name, parseList).catch((err) => {
    // 处理错误
    console.error(err);
  });
  return parseList;
};
export const updateEquipmentLocal = async (thirdToken, list) => {
  await localforage.setItem(thirdToken.character.name, list).catch((err) => {
    // 处理错误
    console.error(err);
  });
};
export const getEquipmentLocal = async (thirdToken) => {
  let result = await localforage.getItem(thirdToken.character.name);
  if (!result) {
    result = await getEquipmentNetwork(thirdToken);
  }
  return result;
};
export const updateEquipmentItemLocal = async (thirdToken, equipment) => {
  let result = await localforage.getItem(thirdToken.character.name);
  let isUpdate = false;
  if (result) {
    // 将传过来的equipment替换本地数据
    result.forEach((item, index) => {
      if (item.id == equipment.id && (item.name != equipment.name || item.isModifying != equipment.isModifying)) {
        result.splice(index, 1, parseItemMagics(equipment));
        isUpdate = true;
      }
    });
    // 设置回去
    isUpdate &&
      (await localforage.setItem(thirdToken.character.name, result).catch((err) => {
        // 处理错误
        console.error(err);
      }));
  }
};
export function parseMagics(list) {
  return list.map((item) => {
    return parseItemMagics(item);
  });
}
export function parseItemMagics(item) {
  item.magicsText = "";
  item.magicsFilterText = "";
  item.magics = {};
  for (const k in item.affixes) {
    for (const j in item.affixes[k].magics) {
      item.magics[j] = item.affixes[k].magics[j];
      item.magicsText += magics[j](item.magics[j]) + "|";
    }
  }

  item.typeText = equipmentFilterTypes[item.equipmentType] || "";
  for (const k in item.magics) {
    // item.magicsText += magics[k](item.magics[k]) + "|";
    let arr = ["#"];
    if (item.magics[k].length > 1) {
      arr = ["#", "#"];
    }
    item.magicsFilterText += magics[k](arr) + "|";
  }
  // for (const k in item.fixedMagics) {
  //   item.magicsText += magics[k](item.fixedMagics[k]) + "|";
  // }
  return item;
}
