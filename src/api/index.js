import { defHttp } from "@/utils/http/axios";
// "/character/list"
const Api = {
    login: "/user/login",
    characterList: "/character/list",
    getCharacterInfo: "/character",
    switchCharacter: "/character/switch",
    createAccount: "/character/create",
    getCurrency: "/character/currency",
    getBackpack: "/character/backpack",
    getMarket: "/market",
    sell: "/market/sell",
    buy: "/market/buy",
    buyShop: "/shop/buy",
    updateSkilltree: "/skilltree",
    chooseMap: "/battle/start",
    getSkillStones: "/character/skillstones",
    equip: "/equipment/equip",
    takeOff: "/equipment/takeOff",
    insertStone: "/equipment/insertStone",
    removeStone: "/equipment/removeStone",
    upgradeStone: "/skillstone/upgrade",
    addGoodsRule: "/user/equipment-filter",
    destroyAll: "/equipment/destroyAll",
};

export const login = (params) => {
    return defHttp.post({ url: Api.login, params });
};
export const switchCharacter = (params) => {
    return defHttp.post({ url: Api.switchCharacter, params });
};
export const createAccount = (params) => {
    return defHttp.post({ url: Api.createAccount, params });
};
export const getCharacterList = (params) => {
    return defHttp.get({ url: Api.characterList, params });
};
export const getCharacterInfo = (params) => {
    return defHttp.get({ url: Api.getCharacterInfo, params });
};

export const getCurrency = (params) => {
    return defHttp.get({ url: Api.getCurrency, params });
};
export const getBackpack = (page = 1, params) => {
    return defHttp.get({ url: `${Api.getBackpack}/${page}`, params });
};
export const getSkillStones = (page = 1, params) => {
    return defHttp.get({ url: `${Api.getSkillStones}/${page}`, params });
};
export const getMarket = (params = { page: 1 }) => {
    return defHttp.get({ url: Api.getMarket, params });
};
export const sell = (id, price) => {
    return defHttp.post({ url: Api.sell, params: { itemId: id, price, type: 2 } });
};
export const buy = (id) => {
    return defHttp.post({ url: Api.buy, params: { id: id } });
};
export const buyShop = (itemId) => {
    return defHttp.post({ url: Api.buyShop, params: { itemId: itemId, quantity: 1 } });
};
export const updateSkilltree = (skilltree) => {
    return defHttp.post({ url: Api.updateSkilltree, params: { passives: skilltree } });
};
export const chooseMap = (mapId) => {
    return defHttp.post({ url: Api.chooseMap, params: { mapId: mapId } });
};
export const equip = (equipmentId, characterId) => {
    return defHttp.post({ url: Api.equip, params: { equipmentId, characterId } });
};
export const takeOff = (equipmentId, characterId) => {
    return defHttp.post({ url: Api.takeOff, params: { equipmentId, characterId } });
};
export const insertStone = (equipmentId, socketId, stoneId) => {
    return defHttp.post({ url: Api.insertStone, params: { equipmentId, socketId, stoneId } });
};
export const removeStone = (equipmentId, socketId) => {
    return defHttp.post({ url: Api.removeStone, params: { equipmentId, socketId } });
};
export const upgradeStone = (stoneId) => {
    return defHttp.post({ url: Api.upgradeStone, params: { stoneId } });
};

export const addGoodsRule = (params) => {
    return defHttp.post({ url: Api.addGoodsRule, params });
};
export const destroyAll = () => {
    return defHttp.post({ url: Api.destroyAll, params: { keyword: "", type: null, rarity: null, storage: false } });
};
