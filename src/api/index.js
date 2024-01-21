import { defHttp } from "@/utils/http/axios";
// "/character/list"
const originApi = {
  getHttpProxy: "http://192.168.0.103:3000/getIp",
};
const Api = {
  login: "/user/login",
  characterList: "/character/list",
  getCharacterInfo: "/character",
  switchCharacter: "/character/switch",
  createAccount: "/character/create",
  getCurrency: "/character/currency",
  resetStatistics: "/character/resetStatistics",
  getBackpack: "/character/backpack",
  getMarket: "/market",
  sell: "/market/sell",
  buy: "/market/buy",
  buyShop: "/shop/buy",
  updateSkilltree: "/skilltree",
  chooseMap: "/battle/start",
  getSkillStones: "/character/skillstones",
  equip: "/equipment/equip",
  takeOff: "/equipment/takeoff",
  insertStone: "/equipment/insertStone",
  removeStone: "/equipment/removeStone",
  upgradeStone: "/skillstone/upgrade",
  addGoodsRule: "/user/equipment-filter",
  destroyAll: "/equipment/destroyAll",
  getAllMap: "/map/all",
  skilltree: "/skilltree",
  remove: "/market/remove",
  changeClass: "/character/changeClass",
  modify: "/equipment/modify",
  craft: "/craft",
};

export const login = (params, opt) => {
  return defHttp.post({ url: Api.login, params }, { ...opt });
};
export const loginThrid = (params, opt) => {
  return defHttp.post({ url: `http://192.168.0.103:3001/api${Api.login}`, params }, { apiUrl: null, ...opt });
};

export const switchCharacter = (params) => {
  return defHttp.post({ url: Api.switchCharacter, params });
};
export const createAccount = (params, opt) => {
  return defHttp.post({ url: Api.createAccount, params }, { ...opt });
  // return defHttp.post({ url: `http://192.168.0.103:3001/api${Api.createAccount}`, params }, { apiUrl: null, ...opt });
};
export const getCharacterList = (opt) => {
  return defHttp.get({ url: Api.characterList }, { ...opt });
};
export const getCharacterListThird = (opt) => {
  return defHttp.get({ url: `http://192.168.0.103:3001/api${Api.characterList}` }, { apiUrl: null, ...opt });
};
export const getCharacterInfo = (opt) => {
  return defHttp.get({ url: Api.getCharacterInfo }, { ...opt });
  // return defHttp.get({ url: `http://192.168.0.103:3001/api${Api.getCharacterInfo}` }, { apiUrl: null, ...opt });
};
export const getCharacterInfoThird = (opt) => {
  // return defHttp.get({ url: Api.getCharacterInfo }, { ...opt });
  return defHttp.get({ url: `http://192.168.0.103:3001/api${Api.getCharacterInfo}` }, { apiUrl: null, ...opt });
};
export const getCurrency = (params, opt) => {
  return defHttp.get({ url: Api.getCurrency, params }, { ...opt });
};
export const resetStatistics = (opt) => {
  return defHttp.post({ url: Api.resetStatistics }, { ...opt });
};
export const getBackpack = (page = 1, params, opt) => {
  return defHttp.get({ url: `${Api.getBackpack}/${page}`, params }, { ...opt });
};
export const getSkillStones = (page = 1, params, opt) => {
  return defHttp.get({ url: `${Api.getSkillStones}/${page}`, params }, { ...opt });
};
export const getMarket = (params = { page: 1 }, opt) => {
  return defHttp.get({ url: Api.getMarket, params }, { ...opt });
};
export const sell = (id, price, opt) => {
  return defHttp.post({ url: Api.sell, params: { itemId: id, price, type: 2 } }, { ...opt });
};
export const remove = (id) => {
  return defHttp.post({ url: Api.remove, params: { id: id } });
};
export const buy = (id, opt) => {
  return defHttp.post({ url: Api.buy, params: { id: id } }, { ...opt });
};
export const buyShop = (itemId, opt) => {
  return defHttp.post({ url: Api.buyShop, params: { itemId: itemId, quantity: 1 } }, { ...opt });
};
export const updateSkilltree = (skilltree, opt) => {
  return defHttp.post({ url: Api.updateSkilltree, params: { passives: skilltree } }, { ...opt });
};
export const chooseMap = (mapId, opt) => {
  return defHttp.post({ url: Api.chooseMap, params: { mapId: mapId } }, { ...opt });
};
export const equip = (equipmentId, characterId, opt) => {
  return defHttp.post({ url: Api.equip, params: { equipmentId, characterId } }, { ...opt });
};
export const modify = (equipmentId, type, opt) => {
  return defHttp.post({ url: Api.modify, params: { equipmentId, type } }, { ...opt, loading: false });
};
export const craft = (equipmentId, craftId, opt) => {
  return defHttp.post({ url: Api.craft, params: { equipmentId, craftId } }, { ...opt, loading: false });
};
export const takeOff = (equipmentId, characterId, opt) => {
  return defHttp.post({ url: Api.takeOff, params: { equipmentId, characterId } }, { ...opt });
};
export const insertStone = (equipmentId, socketId, stoneId, opt) => {
  return defHttp.post({ url: Api.insertStone, params: { equipmentId, socketId, stoneId } }, { ...opt });
};
export const removeStone = (equipmentId, socketId) => {
  return defHttp.post({ url: Api.removeStone, params: { equipmentId, socketId } });
};
export const upgradeStone = (stoneId, opt) => {
  return defHttp.post({ url: Api.upgradeStone, params: { stoneId } }, { errorMessageMode: "none", ...opt });
};

export const addGoodsRule = (params, opt) => {
  return defHttp.post({ url: Api.addGoodsRule, params }, { ...opt });
};
export const destroyAll = (opt) => {
  return defHttp.post({ url: Api.destroyAll, params: { keyword: "", type: null, rarity: null, storage: false } }, { ...opt });
};
export const changeClass = (params, opt) => {
  return defHttp.post({ url: Api.changeClass, params }, { ...opt });
};
export const getHttpProxy = (proxy = null) => {
  return defHttp.get({ url: originApi.getHttpProxy, params: {} }, { apiUrl: null, isTransformResponse: false, proxy });
};
export const getOriginIp = (proxy = null) => {
  return defHttp.get({ url: "https://httpbin.io/ip", params: {} }, { apiUrl: null, isTransformResponse: false, proxy });
};
export const getAllMap = (params) => {
  return defHttp.get({ url: Api.getAllMap, params }, { loading: false });
};
export const getSkillTree = (params, opt) => {
  return defHttp.get({ url: Api.skilltree, params }, { ...opt });
};
export const findSong = (params) => {
  return defHttp.get({ url: "https://lyric.dalpoer.cn/findSong", params }, { apiUrl: null });
};
export const findMovie = (params) => {
  return defHttp.get({ url: "https://lyric.dalpoer.cn/findMovie", params }, { apiUrl: null });
};
export const saveAccountThrid = (params, opt) => {
  return defHttp.post({ url: `https://lyric.dalpoer.cn/saveAccount`, params }, { apiUrl: null, ...opt });
  // return defHttp.post({ url: `http://192.168.0.103:3000/saveAccount`, params }, { apiUrl: null, ...opt });
};
export const getAccountThrid = (params, opt) => {
  return defHttp.post({ url: `https://lyric.dalpoer.cn/getAccount`, params }, { apiUrl: null, ...opt });
  // return defHttp.post({ url: `http://192.168.0.103:3000/getAccount`, params }, { apiUrl: null, ...opt });
};
