export const DialogModeEnum = {
  SUB_SINGLE_ADD: "sub_single_add",
  SUB_MULTIPLE_ADD: "sub_multiple_add",
  MAIN_UPDATE: "main_update",
  CREATE_ACCOUNT: "create_account",
};
export const CurrencyEnum = {
  jewellerOrb: 1,
  chromaticOrb: 2,
  orbOfFusing: 3,
  orbOfTransmutation: 4,
  orbOfChance: 5,
  orbOfAlchemy: 6,
  orbOfAugmentation: 7,
  orbOfAlteration: 8,
  exaltedOrb: 9,
  chaosOrb: 10,
  regalOrb: 11,
  orbOfScouring: 12,
  divineOrb: 13,
  vaalOrb: 14,
  mirrorOfKalandra: 15,
  whetstone: 16,
  armourersScrap: 17,
  orbOfAnnulment: 18,
  fracturingOrb: 19,
};
// const needCurrency = ["改造石", "破溃宝珠", "混沌石", "卡兰德的魔镜", "富豪石", "神圣石", "崇高石", "瓦尔宝珠", "剥离石"];
const needCurrency = [
  "破溃宝珠",
  "混沌石",
  "卡兰德的魔镜",
  "神圣石",
  "崇高石",
  "剥离石",
  "重铸石",
  // "改造石",
  // "富豪石",
  // "瓦尔宝珠",
  // "蜕变石",
  // "增幅石",
  // "机会石",
  // "点金石",
  // "工匠石",
  // "幻色石",
];
export const CurrencyBeanEnum = {
  jewellerOrb: {
    value: 1,
    name: "工匠石",
  },

  chromaticOrb: {
    value: 2,
    name: "幻色石",
  },
  orbOfFusing: {
    value: 3,
    name: "链结石",
  },
  orbOfTransmutation: {
    value: 4,
    name: "蜕变石",
  },
  orbOfChance: {
    value: 5,
    name: "机会石",
  },
  orbOfAlchemy: {
    value: 6,
    name: "点金石",
  },
  orbOfAugmentation: {
    value: 7,
    name: "增幅石",
  },
  orbOfAlteration: {
    value: 8,
    name: "改造石",
  },
  exaltedOrb: {
    value: 9,
    name: "崇高石",
  },
  chaosOrb: {
    value: 10,
    name: "混沌石",
  },
  regalOrb: {
    value: 11,
    name: "富豪石",
  },
  orbOfScouring: {
    value: 12,
    name: "重铸石",
  },
  divineOrb: {
    value: 13,
    name: "神圣石",
  },
  vaalOrb: {
    value: 14,
    name: "瓦尔宝珠",
  },
  mirrorOfKalandra: {
    value: 15,
    name: "卡兰德的魔镜",
  },
  whetstone: {
    value: 16,
    name: "磨刀石",
  },
  armourersScrap: {
    value: 17,
    name: "护甲片",
  },
  orbOfAnnulment: {
    value: 18,
    name: "剥离石",
  },
  fracturingOrb: {
    value: 19,
    name: "破溃宝珠",
  },
  lockPre: {
    value: 98,
    type: 1,
    name: "锁前缀",
  },
  lockBack: {
    value: 99,
    type: 2,
    name: "锁后缀",
  },
};
Object.keys(CurrencyBeanEnum).forEach((key) => {
  if (needCurrency.includes(CurrencyBeanEnum[key].name)) {
    CurrencyBeanEnum[key].need = true;
  }
});
