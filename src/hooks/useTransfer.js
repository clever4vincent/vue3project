import { sell, buy, getMarket } from "@/api";
import { sleep } from "@/utils";
// 当前的角色上架物品，然后将Token切换成选择的角色，再购买物品，购买物品后，再切回Token.
export async function startEquipmentTransfer({ sellToken, buyToken, equipment, price = { 4: 1 } }) {
  // 上架物品后会生成一个物品的市场ID，这个ID是唯一的，所以需要获取市场物品，通过物品的ID来确定是哪个物品，然后根据物品的市场ID来购买物品

  await sell(equipment.id, price, { thirdToken: sellToken }).then(async (res) => {
    // 购买物品
  });
  let marketId;
  // 上架后，需要等待一段时间，才能在市场上找到物品，所以这里需要等待一段时间
  // 请求3次，每次间隔1秒，如果没有找到，就不再找了
  // 找前2页的市场物品，如果没有找到，就不再找了
  for (let x = 0; x < 3; x++) {
    for (let i = 0; i < 2; i++) {
      await getMarket({ page: i + 1 }, { thirdToken: buyToken }).then(async (res) => {
        let marketEquip = res.items.find((item) => item.equipmentId == equipment.id);
        if (marketEquip) {
          marketId = marketEquip.id;
        }
      });
      if (marketId) {
        break;
      }
    }
    if (marketId) {
      break;
    }
    await sleep(1000);
  }

  if (!marketId) {
    console.log("没有找到物品");
    return;
  }

  await buy(marketId, { thirdToken: buyToken }).then(() => {
    console.log("转移成功");
  });
}
