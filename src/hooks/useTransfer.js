import { sell, buy, getMarket } from "@/api";
// 当前的角色上架物品，然后将Token切换成选择的角色，再购买物品，购买物品后，再切回Token.
export async function startEquipmentTransfer({ sellToken, buyToken, equipment, price = { 4: 1 } }) {
  // 上架物品后会生成一个物品的市场ID，这个ID是唯一的，所以需要获取市场物品，通过物品的ID来确定是哪个物品，然后根据物品的市场ID来购买物品

  await sell(equipment.id, price, { thirdToken: sellToken }).then(async (res) => {
    // 购买物品
  });
  let marketId;
  await getMarket({ page: 1 }, { thirdToken: buyToken }).then(async (res) => {
    marketId = res.items.find((item) => item.equipmentId == equipment.id).id;
  });
  await buy(marketId, { thirdToken: buyToken }).then(() => {
    console.log("转移成功");
    // showSuccessToast("转移成功");
  });
}
