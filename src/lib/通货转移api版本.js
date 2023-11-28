// ==UserScript==
// @name         自动转移通货api
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.idlepoe.com/*
// @match        *://idlepoe.com/*
// @match        *://poe.faith.wang/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faith.wang
// @grant        none
// ==/UserScript==
//@eslint
(function () {
  const APP_URL = "https://poe.faith.wang/api";

  let currentToken = "";
  // let currentCharacterId = "";
  let currentFirtstCharacterToken = "";
  let currentExtraToken = "";

  let mainToken = "";

  let currentCharacterList = [];
  let currentCurrency = {};
  let currentMarketItems = [];

  let mainBackpacks = [];
  let endlessGarmentBackpacks = [];
  let currentSellItem = null;
  let currentCharacterInfo = null;
  let skillStoneList = [
    "Multistrike_Support",
    "Sweep",
    "Faster_Attacks_Support",
    "Melee_Physical_Damage_Support",
    "Increased_Critical_Strikes_Support",
    "Brutality_Support",
  ];

  const characterMainAccount = [
    {
      name: "a6669852",
      password: "123456",
    },
  ];
  const characterAncillaryAccounts = [
    { name: "a666985211", password: "123456" },
    { name: "a666985213", password: "123456" },
    { name: "a666985214", password: "123456" },
    { name: "a666985215", password: "123456" },
    { name: "a666985216", password: "123456" },
    { name: "a666985217", password: "123456" },
    { name: "a666985218", password: "123456" },
    { name: "a666985219", password: "123456" },
    { name: "a666985220", password: "123456" },
    { name: "a666985221", password: "123456" },
    { name: "a666985222", password: "123456" },
    { name: "a666985223", password: "123456" },
    { name: "a666985224", password: "123456" },
    { name: "a666985225", password: "123456" },
    { name: "a666985226", password: "123456" },
    { name: "a666985227", password: "123456" },
    { name: "a666985228", password: "123456" },
    { name: "a666985229", password: "123456" },
    { name: "a666985230", password: "123456" },
    { name: "a666985231", password: "123456" },
    { name: "a666985232", password: "123456" },
    { name: "a6669850", password: "123456" },
    { name: "a6669851", password: "123456" },
    { name: "a666985233", password: "123456" },
    { name: "a666985234", password: "123456" },
    { name: "a666985235", password: "123456" },
    { name: "a666985236", password: "123456" },
    { name: "a666985237", password: "123456" },
    { name: "a666985238", password: "123456" },
    { name: "a666985239", password: "123456" },
    { name: "a666985240", password: "123456" },
    { name: "a666985241", password: "123456" },
    { name: "a666985242", password: "123456" },
    { name: "a666985243", password: "123456" },
    { name: "a666985244", password: "123456" },
    { name: "a666985245", password: "123456" },
    { name: "a666985246", password: "123456" },
  ];

  const equipmentTypes = [
    { value: null, label: "全部" },
    { value: 32767, label: "所有武器" },
    { value: 511, label: "所有单手武器" },
    { value: 32256, label: "所有双手武器" },
    { value: 211106232500224, label: "所有防具" },
    { value: 844424930131968, label: "所有饰品" },
    { value: 1, label: "单手剑" },
    { value: 2, label: "单手斧" },
    { value: 4, label: "法杖" },
    { value: 8, label: "爪" },
    { value: 16, label: "匕首" },
    { value: 32, label: "细剑" },
    { value: 64, label: "单手锤" },
    { value: 128, label: "短杖" },
    { value: 256, label: "符文匕首" },
    { value: 512, label: "弓" },
    { value: 1024, label: "长杖" },
    { value: 2048, label: "双手剑" },
    { value: 4096, label: "双手斧" },
    { value: 8192, label: "双手锤" },
    { value: 16384, label: "战杖" },
    { value: 2064384, label: "手套" },
    { value: 132120576, label: "鞋子" },
    { value: 17045651456, label: "胸甲" },
    { value: 1082331758592, label: "头部" },
    { value: 69269232549888, label: "盾牌" },
    { value: 70368744177664, label: "箭袋" },
    { value: 140737488355328, label: "腰带" },
    { value: 281474976710656, label: "项链" },
    { value: 562949953421312, label: "戒指" },
  ];

  const skilltree = {
    passives: [
      "9009",
      "28221",
      "13782",
      "60532",
      "24643",
      "33545",
      "62662",
      "58833",
      "15144",
      "35179",
      "918",
      "48828",
      "12702",
      "28574",
      "40100",
      "34579",
      "30471",
      "51786",
      "24496",
    ],
    passives31: [
      "12702",
      "918",
      "9786",
      "5802",
      "28221",
      "52714",
      "32555",
      "2715",
      "24496",
      "51235",
      "58833",
      "9373",
      "28574",
      "25178",
      "33558",
      "3309",
      "59606",
      "5823",
      "1461",
      "31508",
      "5616",
      "27283",
      "4011",
      "33545",
      "8938",
      "18707",
      "9355",
      "50338",
      "57240",
      "60942",
      "1427",
      "3187",
      "37504",
      "51786",
      "22266",
      "49900",
      "903",
      "17674",
      "3424",
      "24643",
      "6538",
      "39861",
      "55373",
      "13782",
      "49978",
      "54142",
      "9009",
      "60532",
      "35179",
      "20807",
      "38662",
      "41866",
      "36287",
      "15144",
      "59220",
      "9469",
      "65502",
      "12412",
      "64769",
      "36849",
      "23886",
      "7263",
      "45491",
      "7085",
      "1201",
      "46277",
      "60592",
      "35851",
      "47484",
      "30679",
      "30626",
      "25209",
      "5622",
      "6",
      "56149",
      "29870",
      "720",
      "40100",
      "34579",
      "30471",
      "48477",
      "23507",
      "57248",
      "41689",
      "45272",
      "44683",
      "38129",
      "63639",
    ],
    passives20: [
      "58833",
      "15144",
      "35179",
      "9009",
      "60532",
      "918",
      "28221",
      "24643",
      "33545",
      "28574",
      "51786",
      "24496",
      "39861",
      "49978",
      "9355",
      "4011",
      "5823",
      "8938",
      "59606",
      "1427",
      "51235",
      "18707",
      "1461",
      "49900",
      "5802",
    ],
    passives40: [
      "58833",
      "15144",
      "35179",
      "9009",
      "60532",
      "918",
      "28221",
      "24643",
      "33545",
      "28574",
      "51786",
      "24496",
      "39861",
      "49978",
      "8938",
      "59606",
      "1427",
      "51235",
      "18707",
      "9355",
      "4011",
      "5823",
      "6538",
      "38662",
      "50338",
      "5616",
      "27283",
      "31508",
      "48099",
      "65210",
      "32117",
      "54142",
      "3187",
      "2715",
      "903",
      "1461",
      "49900",
      "5802",
      "3424",
      "36287",
      "20807",
    ],
    passives50: [
      "33558",
      "38662",
      "3424",
      "9009",
      "65210",
      "8938",
      "51235",
      "35851",
      "18707",
      "46408",
      "5823",
      "49900",
      "57248",
      "35179",
      "58833",
      "46277",
      "48477",
      "24496",
      "23507",
      "20807",
      "5802",
      "32555",
      "33903",
      "39861",
      "9355",
      "2715",
      "54142",
      "54338",
      "28221",
      "1461",
      "31508",
      "59606",
      "30205",
      "51786",
      "60592",
      "36287",
      "20812",
      "33545",
      "49978",
      "6538",
      "12412",
      "4011",
      "27283",
      "60532",
      "32117",
      "15144",
      "8348",
      "24643",
      "47484",
      "3309",
      "5616",
      "48099",
      "1427",
      "50338",
      "3187",
      "6534",
      "9786",
      "22266",
      "918",
      "19506",
    ],
    passives60: [
      "9009",
      "35851",
      "18707",
      "58833",
      "23507",
      "9355",
      "19506",
      "32555",
      "39861",
      "1461",
      "6534",
      "20807",
      "36287",
      "5823",
      "49900",
      "32117",
      "3424",
      "46408",
      "33903",
      "33545",
      "47484",
      "38662",
      "48477",
      "31508",
      "12412",
      "24643",
      "48099",
      "6538",
      "60532",
      "50338",
      "22266",
      "49978",
      "1427",
      "33558",
      "28221",
      "51786",
      "4011",
      "5802",
      "60592",
      "15144",
      "8348",
      "8938",
      "57248",
      "46277",
      "54338",
      "3309",
      "918",
      "51235",
      "24496",
      "59606",
      "30205",
      "20812",
      "27283",
      "3187",
      "54142",
      "35179",
      "9786",
      "65210",
      "2715",
      "5616",
      "9877",
      "25058",
      "21835",
      "35894",
      "35283",
      "28754",
      "10763",
      "24050",
      "40644",
      "42686",
      "21575",
      "20546",
    ],
    passives86: [
      "35283",
      "44723",
      "38176",
      "60405",
      "49978",
      "2715",
      "5802",
      "36287",
      "7938",
      "33558",
      "37671",
      "9469",
      "903",
      "53493",
      "58833",
      "50472",
      "9786",
      "32710",
      "46408",
      "20807",
      "21301",
      "45456",
      "44183",
      "39861",
      "32555",
      "35894",
      "42686",
      "9788",
      "4011",
      "54657",
      "41635",
      "30225",
      "24050",
      "47062",
      "9432",
      "59220",
      "16790",
      "1427",
      "12189",
      "36221",
      "11420",
      "28754",
      "24496",
      "15144",
      "18707",
      "35179",
      "14021",
      "63067",
      "37504",
      "1346",
      "34157",
      "60532",
      "28012",
      "58604",
      "12852",
      "59606",
      "21835",
      "9009",
      "33545",
      "11551",
      "51235",
      "7555",
      "3309",
      "9206",
      "49651",
      "22266",
      "1031",
      "21575",
      "25058",
      "65502",
      "3187",
      "11688",
      "12412",
      "4036",
      "49605",
      "5823",
      "9877",
      "49900",
      "12379",
      "47507",
      "8938",
      "5875",
      "60440",
      "61981",
      "22972",
      "19635",
      "51786",
      "9355",
      "27283",
      "3424",
      "1461",
      "47306",
      "27415",
      "56153",
      "15228",
      "20546",
      "28574",
      "63843",
      "31508",
      "36858",
      "49929",
      "10763",
      "41866",
    ],
  };
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  function getTokenInfo(token) {
    if (!token) {
      return {};
    }
    const base64Url = token.split(".")[1];
    const base64 = encodeURIComponent(base64Url).replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  }
  const getHeaders = (tokenType) => {
    const headers = {};

    switch (tokenType) {
      case "main":
        if (mainToken.trim() !== "") {
          headers["Authorization"] = `Bearer ${mainToken}`;
        }
        break;
      case "first":
        if (currentFirtstCharacterToken.trim() !== "") {
          headers["Authorization"] = `Bearer ${currentFirtstCharacterToken}`;
        }
        break;
      case "extra":
        if (currentExtraToken.trim() !== "") {
          headers["Authorization"] = `Bearer ${currentExtraToken}`;
        }
        break;
      default:
        if (currentToken.trim() !== "") {
          headers["Authorization"] = `Bearer ${currentToken}`;
        }
        break;
    }
    return headers;
  };

  const get = async (url, query, tokenType = "default") => {
    // remove empty query
    const headers = getHeaders(tokenType);
    if (query) {
      Object.keys(query).forEach((key) => {
        if (!query[key] || query[key] === "") {
          delete query[key];
        }
      });
      if (Object.keys(query).length > 0) {
        url += "?" + new URLSearchParams(query).toString();
      }
    }
    return await fetch(`${APP_URL}${url}`, {
      method: "GET",
      headers: headers,
    }).then((res) => {
      if (res.status === 401) {
        // token不对，需要重新登录
        console.log("token不对，需要重新登录");
      } else if (res.status === 502) {
        return {
          success: false,
          message: "服务器维护中",
        };
      }
      return res.json();
    });
  };

  const post = async (url, data, tokenType = "default") => {
    const headers = {
      "Content-Type": "application/json",
      ...getHeaders(tokenType),
    };
    return await fetch(`${APP_URL}${url}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 401) {
        // token不对，需要重新登录
        console.log("token不对，需要重新登录");
      } else if (res.status === 502) {
        return {
          success: false,
          message: "服务器维护中",
        };
      }
      return res.json();
    });
  };
  const API = {
    login: function (name, pwd, tokentype = "default") {
      return new Promise((resolve, reject) => {
        post(
          "/user/login",
          {
            username: name,
            password: pwd,
          },
          tokentype
        )
          .then((res) => {
            // console.log("🚀 ~ login ~ res", res);
            if (res.success) {
              currentToken = res.data.token;
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            const msg = err.message;
            console.log("🚀 ~ login 登录失败 ~ message:", msg);
            reject();
          });
      });
    },
    getCharacterList: function () {
      return new Promise((resolve, reject) => {
        get("/character/list")
          .then((res) => {
            // console.log("🚀 ~ getCharacterList ~ res", res);
            if (res.success) {
              currentCharacterList = res.data;
              resolve();
            } else {
              reject();
            }
          })
          .catch((err) => {
            console.log("🚀 ~ getCharacterList ~ err", err);
            reject();
          });
      });
    },
    selectCharacter: function (id) {
      return new Promise((resolve, reject) => {
        post("/character/switch", {
          characterId: id,
        })
          .then((res) => {
            // console.log("🚀 ~ selectCharacter ~ res", res);
            if (res.success) {
              resolve(res.data);
            } else {
              console.log("🚀 ~ selectCharacter ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    createAccount: function (name, classType) {
      // https://poe.faith.wang/api/character/create {"name":"t331","class":2}
      return new Promise((resolve, reject) => {
        post("/character/create", {
          name: name,
          class: classType,
        })
          .then((res) => {
            // console.log("🚀 ~ createAccount ~ res", res);
            if (res.success) {
              resolve();
            } else {
              console.log("🚀 ~ createAccount ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },

    getCurrency: function () {
      return new Promise((resolve, reject) => {
        get(`/character/currency`)
          .then((res) => {
            // console.log("🚀 ~ getCurrency ~ res", res);
            if (res.success) {
              if (res.data) {
                currentCurrency = res.data;
              }
              resolve();
            } else {
              console.log("🚀 ~ getCurrency ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },

    getBackpack: function (page = 1, query = {}) {
      return new Promise((resolve, reject) => {
        get(`/character/backpack/${page}`, query)
          .then((res) => {
            // console.log("🚀 ~ getBackpack ~ res", res);
            if (res.success) {
              resolve(res.data);
            } else {
              console.log("🚀 ~ getBackpack ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    getMarket: function () {
      return new Promise((resolve, reject) => {
        get(`/market?page=1`)
          .then((res) => {
            // console.log("🚀 ~ getMarket ~ res", res);
            if (res.success) {
              currentMarketItems = res.data.items;
              resolve();
            } else {
              console.log("🚀 ~ getMarket ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    sellItem: function (id, price, tokenType = "default") {
      return new Promise((resolve, reject) => {
        post(
          "/market/sell",
          {
            itemId: id,
            price,
            type: 2,
          },
          tokenType
        )
          .then((res) => {
            // console.log("🚀 ~ sellItem ~ res", res);
            if (res.success) {
              // 上架成功
              resolve();
            } else {
              console.log("🚀 ~ sellItem ~ message:", res.message);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    buyItem: function (id) {
      return new Promise((resolve, reject) => {
        post("/market/buy", {
          id: id,
        })
          .then((res) => {
            // console.log("🚀 ~ buyItem ~ res", res);
            if (res.success) {
              // 购买成功
              resolve();
            } else {
              console.log("🚀 ~ buyItem ~ message:", res.message);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    updateSkilltree: function (skilltree) {
      return new Promise((resolve, reject) => {
        post("/skilltree", {
          passives: skilltree,
        })
          .then((res) => {
            // console.log("🚀 ~ updateSkilltree ~ res", res);
            if (res.success) {
              console.log("技能树更新成功");
              resolve();
            } else {
              console.log("🚀 ~ updateSkilltree ~ message:", res.message);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    chooseMap: function (mapId) {
      return new Promise((resolve, reject) => {
        post("/battle/start", {
          mapId: mapId,
        })
          .then((res) => {
            // console.log("🚀 ~ chooseMap ~ res", res);
            if (res.success) {
              console.log("选择地图成功");
              resolve();
            } else {
              console.log("🚀 ~ chooseMap ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    buyShopItem: function (itemId) {
      // https://poe.faith.wang/api/shop/buy
      //  多重打击 {"itemId":"Multistrike_Support","quantity":1}
      return new Promise((resolve, reject) => {
        post("/shop/buy", {
          itemId: itemId,
          quantity: 1,
        })
          .then((res) => {
            // console.log("🚀 ~ buyShopItem ~ res", res);
            if (res.success) {
              console.log(itemId + "购买成功");
              resolve();
            } else {
              console.log("🚀 ~ buyShopItem ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    getSkillStones: function () {
      // https://poe.faith.wang/api/character/skillstones/1
      return new Promise((resolve, reject) => {
        get("/character/skillstones/1")
          .then((res) => {
            // console.log("🚀 ~ getSkillStones ~ res", res);
            if (res.success) {
              console.log("获取宝石成功");
              resolve(res.data.items);
            } else {
              console.log("🚀 ~ getSkillStones ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    equipItem: function (equipmentId, characterId) {
      // https://poe.faith.wang/api/equipment/equip {"equipmentId": "655017e8282c350be4af7480","characterId": "654fda08282c350be47d3574"}
      return new Promise((resolve, reject) => {
        post("/equipment/equip", {
          equipmentId: equipmentId,
          characterId: characterId,
        })
          .then((res) => {
            // console.log("🚀 ~ equipItem ~ res", res);
            if (res.success) {
              console.log("装备成功");
              resolve();
            } else {
              console.log("🚀 ~ equipItem ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    takeOffItem: function (equipmentId, characterId) {
      //https://poe.faith.wang/api/equipment/takeoff
      return new Promise((resolve, reject) => {
        post("/equipment/takeoff", {
          equipmentId: equipmentId,
          characterId: characterId,
        })
          .then((res) => {
            // console.log("🚀 ~ takeOffItem ~ res", res);
            if (res.success) {
              console.log("脱下装备成功");
              resolve();
            } else {
              console.log("🚀 ~ takeOffItem ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },

    insertStone: function (equipmentId, socketId, stoneId) {
      // https://poe.faith.wang/api/equipment/insertStone
      // {
      //   "equipmentId": "654fd5d2282c350be479c251",
      //   "socketId": 1,
      //   "stoneId": "654ffa81282c350be4974957"
      // }
      return new Promise((resolve, reject) => {
        post("/equipment/insertStone", {
          equipmentId: equipmentId,
          socketId: socketId,
          stoneId: stoneId,
        })
          .then((res) => {
            // console.log("🚀 ~ insertStone ~ res", res);
            if (res.success) {
              console.log("镶嵌宝石成功");
              resolve();
            } else {
              console.log("🚀 ~ insertStone ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    addGoodsRule: function () {
      // https://poe.faith.wang/api/user/equipment-filter
      return new Promise((resolve, reject) => {
        post("/user/equipment-filter", [
          {
            equipmentName: null,
            equipmentType: null,
            rarity: 3,
            sockets: null,
            minLinkedSockets: null,
            minEquipmentRequireLevel: null,
            magics: [],
          },
          {
            rarity: 4,
          },
        ])
          .then((res) => {
            // console.log("🚀 ~ addGoodsRule ~ res", res);
            if (res.success) {
              console.log("添加筛选规则成功");
              resolve();
            } else {
              console.log("🚀 ~ addGoodsRule ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    getCharacterInfo: function () {
      // https://poe.faith.wang/api/character 获取角色信息
      return new Promise((resolve, reject) => {
        get("/character")
          .then((res) => {
            // console.log("🚀 ~ getCharacterInfo ~ res", res);
            if (res.success) {
              console.log("获取角色信息成功");
              resolve(res.data);
            } else {
              console.log("🚀 ~ getCharacterInfo ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    removeStone: function (equipmentId, socketId) {
      //https://poe.faith.wang/api/equipment/removeStone
      return new Promise((resolve, reject) => {
        post("/equipment/removeStone", {
          equipmentId: equipmentId,
          socketId: socketId,
        })
          .then((res) => {
            // console.log("🚀 ~ removeStone ~ res", res);
            if (res.success) {
              console.log("移除宝石成功");
              resolve();
            } else {
              console.log("🚀 ~ removeStone ~ message:", res.message);
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    destroyAll: function () {
      // https://poe.faith.wang/api/equipment/destroyAll
      //   {
      //     "keyword": "",
      //     "type": null,
      //     "rarity": null,
      //     "storage": false
      // }
      return new Promise((resolve, reject) => {
        post("/equipment/destroyAll", {
          keyword: "",
          type: null,
          rarity: null,
          storage: false,
        })
          .then((res) => {
            // console.log("🚀 ~ destroyAll ~ res", res);
            if (res.success) {
              console.log("销毁所有装备成功");
              resolve();
            } else {
              console.log("🚀 ~ destroyAll ~ message:", res.message);
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    upgradeStone: function (stoneId) {
      // https://poe.faith.wang/api/skillstone/upgrade
      //     {
      //   "stoneId": "6550e0bd282c350be474fdb3"
      // }
      return new Promise((resolve, reject) => {
        post("/skillstone/upgrade", {
          stoneId: stoneId,
        })
          .then((res) => {
            // console.log("🚀 ~ upgradeStone ~ res", res);
            if (res.success) {
              console.log("升级宝石成功");
              resolve(true);
            } else {
              if ((res.message = "经验不足")) {
                resolve(false);
              } else {
                console.log("🚀 ~ upgradeStone ~ message:", res.message);
                reject();
              }
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
  };

  // -----------------------------------API END------------------------------------

  // 将资源集合到第一个角色上
  async function handleGetCurrentCurrency(Accounts, AccIndex) {
    let currentFirstBackpacks;
    // 获取小号第一个角色信息
    await loginAndSelectCharacter(Accounts[AccIndex].name, Accounts[AccIndex].password, 0).then(async (data) => {
      currentFirtstCharacterToken = data;
      await API.getBackpack().then((data) => {
        currentFirstBackpacks = data.items;
      });
    });
    // 获取第二角色通货
    await loginAndSelectCharacter(Accounts[AccIndex].name, Accounts[AccIndex].password, 1).then(async () => {
      await API.getCurrency().then(async () => {
        console.log("获取通货成功");
        await API.sellItem(currentFirstBackpacks[0].id, packetPrice(), "first").then(async () => {
          console.log("上架成功");
          currentSellItem = currentFirstBackpacks.shift();
          await API.getMarket().then(async () => {
            console.log("获取市场信息成功");
            let item = currentMarketItems.find((item) => item.equipmentId === currentSellItem.id);
            if (item) {
              console.log("找到上架物品");
              await API.buyItem(item.id).then(() => {
                console.log("购买成功");
              });
            } else {
              console.log("未找到上架物品");
            }
          });
        });
      });
    });
    // 获取第三角色通货
    await loginAndSelectCharacter(Accounts[AccIndex].name, Accounts[AccIndex].password, 2).then(async () => {
      await API.getCurrency().then(async () => {
        console.log("获取通货成功");
        await API.sellItem(currentFirstBackpacks[0].id, packetPrice(), "first").then(async () => {
          console.log("上架成功");
          currentSellItem = currentFirstBackpacks.shift();
          await API.getMarket().then(async () => {
            console.log("获取市场信息成功");
            let item = currentMarketItems.find((item) => item.equipmentId === currentSellItem.id);
            if (item) {
              console.log("找到上架物品");
              await API.buyItem(item.id).then(() => {
                console.log("购买成功");
              });
            } else {
              console.log("未找到上架物品");
            }
          });
        });
      });
    });
  }

  async function handleMainCurrentCurrency(AccIndex) {
    // 获取第一角色通货
    await loginAndSelectCharacter(characterAncillaryAccounts[AccIndex].name, characterAncillaryAccounts[AccIndex].password, 0).then(async () => {
      await API.getCurrency().then(async () => {
        console.log("获取通货成功");
        await API.sellItem(mainBackpacks[0].id, packetPrice(), "main").then(async () => {
          console.log("上架成功");
          currentSellItem = mainBackpacks.shift();
          await API.getMarket().then(async () => {
            console.log("获取市场信息成功");
            let item = currentMarketItems.find((item) => item.equipmentId === currentSellItem.id);
            if (item) {
              console.log("找到上架物品");
              await API.buyItem(item.id).then(() => {
                console.log("购买成功");
              });
            } else {
              console.log("未找到上架物品");
            }
          });
        });
      });
    });
  }
  function packetPrice() {
    return {
      1: currentCurrency.jewellerOrb,
      2: currentCurrency.chromaticOrb,
      3: currentCurrency.orbOfFusing,
      4: currentCurrency.orbOfTransmutation,
      5: currentCurrency.orbOfChance,
      6: currentCurrency.orbOfAlchemy,
      7: currentCurrency.orbOfAugmentation,
      8: currentCurrency.orbOfAlteration,
      9: currentCurrency.exaltedOrb,
      10: currentCurrency.chaosOrb,
      11: currentCurrency.regalOrb,
      12: currentCurrency.orbOfScouring,
      13: currentCurrency.divineOrb,
      14: currentCurrency.vaalOrb,
      15: currentCurrency.mirrorOfKalandra,
      16: currentCurrency.whetstone,
      17: currentCurrency.armourersScrap,
    };
  }
  function loginAndSelectCharacter(name, pwd, index, isMain = false) {
    return new Promise((resolve, reject) => {
      API.login(name, pwd)
        .then(() => {
          // console.log("登录成功");
          API.getCharacterList()
            .then(() => {
              // console.log("获取角色列表成功");
              API.selectCharacter(currentCharacterList[index].id)
                .then((data) => {
                  if (data) {
                    if (isMain) {
                      currentToken = mainToken = data;
                    } else {
                      currentToken = data;

                      // if (index == 0) {
                      //   currentFirtstCharacterToken = data;
                      // }
                    }
                  }
                  // console.log("选择角色成功");
                  resolve(data);
                })
                .catch(() => {
                  console.log("选择角色失败");
                  reject();
                });
            })
            .catch(() => {
              console.log("获取角色列表失败");
              reject();
            });
        })
        .catch(() => {
          console.log("登录失败");
          reject();
        });
    });
  }
  /**
   *  将主号通货转移到第一个角色上
   */
  async function startMainTransferCurrency() {
    await handleGetCurrentCurrency(characterMainAccount, 0);
  }
  /**
   *  将所有小号通货转移到主号上
   */
  async function startTransferCurrency() {
    // 将小号通货转移到第一个角色上
    for (let i = 0; i < characterAncillaryAccounts.length; i++) {
      console.log("----------------第" + i + "个小号资源集合到第一个角色上-----------------");
      await handleGetCurrentCurrency(characterAncillaryAccounts, i);
    }

    // 将小号通货转移到主号上
    for (let i = 0; i < characterAncillaryAccounts.length; i++) {
      console.log("----------------第" + i + "个小号-----------------");
      if (mainBackpacks.length <= 0) {
        // 获取主号信息
        await loginAndSelectCharacter(characterMainAccount[0].name, characterMainAccount[0].password, 0, true).then(async () => {
          await API.getBackpack().then((data) => {
            mainBackpacks = data.items;
          });
        });
      }
      await handleMainCurrentCurrency(i);
    }
  }

  function parseAccountName(accountName, index) {
    // 将a666985233变化成t33
    return accountName.replace(/a6669852(\d+)/, (match, p1) => "t" + p1 + index);
  }
  // character-list
  function init() {
    console.log("-----------start--------------");
    console.log("------------end--------------");
  }
  async function main() {
    init();

    // startCreateAccount();
    // await initAccountProgress({
    //   name: "a666985244",
    //   pwd: "123456",
    // });
    // startTransferCurrency();
    // startMainTransferCurrency();

    // 无尽之衣 Endless garment

    // getEndlessGarmentFromOtherAccount();

    // timesOperateAccounts();
    // await Character.equipWeapon();
    // await Character.equipRing();
    // await Character.equipBelt();
    // "1_2_12"
    // await API.chooseMap("1_1_3a");
    // await Character.equipShoe();
    // await Character.equipGlove();
    // await Character.equipAmulet();
    // await Character.quipHelmet();

    AccountHandle.allAccountOperateAccounts(async () => {
      // -------------升级宝石------------------
      // await upgradeAllStoneOnEquipment();
      // -----------------替换无尽之衣对应的宝石-----------------
      // await removeAndInsertStone("Brutality_Support", "Haste");
      // -----------------升级技能树-----------------
      // await API.updateSkilltree(skilltree.passives31);
      // -----------------选择地图-----------------
      // await API.chooseMap("2_10_7");
      // -----------------装备武器-----------------
      // await Character.equipAmulet();
      // await Character.equipHelmet();
      // await Character.equipRing();
      // await Character.equipShoe();
      // await Character.equipWeapon();
      // -----------------丢弃所有-----------------
      await API.destroyAll();
      // -----------------添加规则-----------------
      // await API.addGoodsRule();
    });
    // -----------------将无尽之衣转移过来-----------------
    // AccountHandle.singleAccountOperateAccounts(async () => {
    //    await API.chooseMap("1_1_7_2");
    //   await getEndlessGarment();
    // }, getEndlessAccountBackpacks);
    // -----------------替换无尽之衣对应的宝石-----------------
    // AccountHandle.allAccountOperateAccounts(async () => {
    //   await removeAndInsertStone("Brutality_Support", "Haste");
    // });
    // -----------------购买商店宝石-----------------
    // AccountHandle.allAccountOperateAccounts(async () => {
    //   await buySkillStone(["Haste"]);
    // });
  }

  const AccountHandle = {
    prefixName: "a6669852",
    endlessAccount: {
      name: "a666985211",
      pwd: "123456",
    },
    startIndex: 33,
    maxAccIndex: 47,
    singleIndex: 38,
    singleCharacterIndex: 2,
    maxIndex: 3,
    allAccountOperateAccounts: async function (fn, fn_pre = null) {
      for (let accIndex = AccountHandle.startIndex; accIndex < AccountHandle.maxAccIndex; accIndex++) {
        console.log(`🚀 a6669852${accIndex}账号`);
        let accountItem = {
          name: AccountHandle.prefixName + accIndex,
          pwd: "123456",
        };
        for (let index = 0; index < AccountHandle.maxIndex; index++) {
          fn_pre && (await fn_pre());

          // 登录账号
          await loginAndSelectCharacter(accountItem.name, accountItem.pwd, index).then(async (data) => {
            await fn();
          });
        }
      }
    },
    singleAccountOperateAccounts: async function (fn, fn_pre = null) {
      let accountItem = {
        name: AccountHandle.prefixName + AccountHandle.singleIndex,
        pwd: "123456",
      };
      fn_pre && (await fn_pre());
      // 登录账号
      await loginAndSelectCharacter(accountItem.name, accountItem.pwd, AccountHandle.singleCharacterIndex).then(async (data) => {
        await fn();
      });
    },
  };
  const Character = {
    equipHelmet: async function () {
      // 头盔
      // https://poe.faith.wang/api/character/backpack/1?type=1082331758592
      let pageCount = 1;
      let helmets = [];

      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
      });

      // 获取背包和仓库
      for (let index = 0; index < 2; index++) {
        let query = { type: 1082331758592 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && helmets.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && helmets.push(...data.items);
            });
          }
        }
      }

      helmets = filterRequiredItems(helmets);
      let itemsWithMagic = helmets.filter((item) => item.magics && item.magics["12"]);
      let sortedItems = [...itemsWithMagic].sort((a, b) => {
        let magicA = a.magics && a.magics["12"];
        let magicB = b.magics && b.magics["12"];
        return magicB - magicA; // 降序排序
      });
      if (sortedItems.length > 0) {
        await API.equipItem(sortedItems[0].id, getTokenInfo(currentToken).characterId);
      }
    },
    equipAmulet: async function () {
      // 项链
      // https://poe.faith.wang/api/character/backpack/1?type=281474976710656
      let pageCount = 1;
      let amulets = [];

      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
      });
      // 获取背包和仓库
      for (let index = 0; index < 2; index++) {
        let query = { type: 281474976710656 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && amulets.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && amulets.push(...data.items);
            });
          }
        }
      }

      amulets = filterRequiredItems(amulets);
      // let itemsWithMagic = amulets.filter(
      //   (item) => item.magics && item.magics["8"]
      // );

      let sortedItems = [...amulets].sort((a, b) => {
        let sumA = 0;
        let sumB = 0;
        "78 79 80 81 82".split(" ").forEach((magicId) => {
          a.magics[magicId] && (sumA += a.magics[magicId][0] + a.magics[magicId][1]);
          b.magics[magicId] && (sumB += b.magics[magicId][0] + b.magics[magicId][1]);
        });
        return sumB - sumA; // 降序排序
      });
      console.log(sortedItems);
      if (sortedItems.length > 0) {
        await API.equipItem(sortedItems[0].id, getTokenInfo(currentToken).characterId);
      }
    },
    equipGlove: async function () {
      // 手套
      // https://poe.faith.wang/api/character/backpack/1?type=2064384
      let pageCount = 1;
      let gloves = [];

      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
      });
      // 获取背包和仓库
      for (let index = 0; index < 2; index++) {
        let query = { type: 2064384 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && gloves.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && gloves.push(...data.items);
            });
          }
        }
      }

      gloves = filterRequiredItems(gloves);
      let itemsWithMagic = gloves.filter((item) => item.magics && item.magics["15"]);
      let sortedItems = [...itemsWithMagic].sort((a, b) => {
        let magicA = a.magics && a.magics["15"];
        let magicB = b.magics && b.magics["15"];
        return magicB - magicA; // 降序排序
      });
      if (sortedItems.length > 0) {
        await API.equipItem(sortedItems[0].id, getTokenInfo(currentToken).characterId);
      }
    },
    equipShoe: async function () {
      //鞋
      // https://poe.faith.wang/api/character/backpack/1?type=132120576
      let pageCount = 1;
      let shoes = [];

      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
      });
      // 获取背包和仓库
      for (let index = 0; index < 2; index++) {
        let query = { type: 132120576 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && shoes.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && shoes.push(...data.items);
            });
          }
        }
      }

      shoes = filterRequiredItems(shoes);
      let itemsWithMagic = shoes.filter((item) => item.magics && item.magics["54"]);
      let sortedItems = [...itemsWithMagic].sort((a, b) => {
        let magicA = a.magics && a.magics["54"];
        let magicB = b.magics && b.magics["54"];
        return magicB - magicA; // 降序排序
      });
      if (sortedItems.length > 0) {
        await API.equipItem(sortedItems[0].id, getTokenInfo(currentToken).characterId);
      }
    },
    equipBelt: async function () {
      // 腰带
      // https://poe.faith.wang/api/character/backpack/1?type=140737488355328
      let pageCount = 1;
      let belts = [];

      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
      });
      // 获取背包和仓库
      for (let index = 0; index < 2; index++) {
        let query = { type: 140737488355328 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && belts.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && belts.push(...data.items);
            });
          }
        }
      }

      belts = filterRequiredItems(belts);
      let itemsWithMagic45 = belts.filter((item) => item.fixedMagics && item.fixedMagics["45"]);
      let sortedItems = [...itemsWithMagic45].sort((a, b) => {
        let magicA = a.fixedMagics && a.fixedMagics["45"];
        let magicB = b.fixedMagics && b.fixedMagics["45"];
        return magicB - magicA; // 降序排序
      });
      await API.equipItem(sortedItems[0].id, getTokenInfo(currentToken).characterId);
    },
    equipRing: async function () {
      // https://poe.faith.wang/api/character/backpack/1?type=562949953421312
      let pageCount = 1;
      let rings = [];

      // 先脱掉当前戒指
      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
        let leftRingId = data.equipmentSlots.leftRing && data.equipmentSlots.leftRing.id;
        let rightRingId = data.equipmentSlots.rightRing && data.equipmentSlots.rightRing.id;
        leftRingId && (await API.takeOffItem(leftRingId, getTokenInfo(currentToken).characterId));
        rightRingId && (await API.takeOffItem(rightRingId, getTokenInfo(currentToken).characterId));
      });
      // 获取背包和仓库的戒指
      for (let index = 0; index < 2; index++) {
        let query = { type: 562949953421312 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && rings.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && rings.push(...data.items);
            });
          }
        }
      }

      rings = filterRequiredItems(rings);
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

      itemsWithMagic15[0] && (await API.equipItem(itemsWithMagic15[0].id, getTokenInfo(currentToken).characterId));
      itemsWithMagic15[1] && (await API.equipItem(itemsWithMagic15[1].id, getTokenInfo(currentToken).characterId));
    },
    equipWeapon: async function () {
      // https://poe.faith.wang/api/character/backpack/1?type=511
      let pageCount = 1;
      let weapons = [];
      // 先脱掉当前武器
      await API.getCharacterInfo().then(async (data) => {
        currentCharacterInfo = data;
        let mainHandId = data.equipmentSlots.mainHand && data.equipmentSlots.mainHand.id;
        let offHandId = data.equipmentSlots.offHand && data.equipmentSlots.offHand.id;
        mainHandId && (await API.takeOffItem(mainHandId, getTokenInfo(currentToken).characterId));
        offHandId && (await API.takeOffItem(offHandId, getTokenInfo(currentToken).characterId));
      });

      for (let index = 0; index < 2; index++) {
        let query = { type: 511 };
        if (index == 1) {
          query.storage = true;
        }
        await API.getBackpack(1, query).then((data) => {
          console.log(data);
          total = parseInt(data.total);
          pageCount = parseInt(total / 30) + 1;
          data.items && weapons.push(...data.items);
        });
        if (pageCount > 1) {
          for (let index = 2; index <= pageCount; index++) {
            await API.getBackpack(index, query, index).then((data) => {
              data.items && weapons.push(...data.items);
            });
          }
        }
      }
      weapons = filterRequiredItems(weapons);
      let sortedWeapons = [...weapons].sort((a, b) => {
        let sumA = a.physicalDamage.max + a.physicalDamage.min;
        let sumB = b.physicalDamage.max + b.physicalDamage.min;
        "78 79 80 81 82".split(" ").forEach((magicId) => {
          a.magics[magicId] && (sumA += a.magics[magicId][0] + a.magics[magicId][1]);
          b.magics[magicId] && (sumB += b.magics[magicId][0] + b.magics[magicId][1]);
        });
        return sumB - sumA; // 降序排序
      });

      let maxDamageItem = sortedWeapons[0]; // 最大的item
      let secondMaxDamageItem = sortedWeapons[1]; // 第二大的item
      console.log(maxDamageItem, secondMaxDamageItem);
      await API.equipItem(maxDamageItem.id, getTokenInfo(currentToken).characterId);
      await API.equipItem(secondMaxDamageItem.id, getTokenInfo(currentToken).characterId);
    },

    equipEndlessGarment: async function () {
      // 将登录账号的无尽之衣装备上
      // https://poe.faith.wang/api/equipment/equip {"equipmentId": "655017e8282c350be4af7480","characterId": "654fda08282c350be47d3574"}
      // getTokenInfo(currentToken).characterId
      API.equipItem(currentSellItem.id, getTokenInfo(currentToken).characterId);
    },
    insertStoneToEndlessGarment: async function () {
      // insertStone
      // 获取当前账号的宝石，然后给无尽之衣镶嵌上
      await API.getSkillStones().then(async (data) => {
        // 获取宝石的id
        let promises = [];
        skillStoneList.forEach((skillId, index) => {
          let stoneId = data.find((item) => item.skillId === skillId).id;
          promises.push(API.insertStone(currentSellItem.id, index + 1, stoneId));
        });
        await Promise.all(promises)
          .then(() => console.log("所有石头镶嵌完成."))
          .catch((err) => {
            console.error("An error occurred:", err);
            throw err;
          });
      });
    },
  };
  function filterRequiredItems(items) {
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
  async function upgradeAllStoneOnEquipment() {
    await API.getCharacterInfo().then(async (data) => {
      // 获取无尽之衣的id
      let bodyArmor = data.equipmentSlots.bodyArmor;
      let stones = bodyArmor.sockets[0];
      for (let index = 0; index < stones.length; index++) {
        let item = stones[index];
        if (item.exp > item.levelUpExp) {
          let canUpgrade = true;
          while (canUpgrade) {
            await API.upgradeStone(item.stoneId)
              .then(async (res) => {
                canUpgrade = res;
              })
              .catch(() => (canUpgrade = false));
          }
        }
      }
    });
  }

  async function removeAndInsertStone(preStoneName, nextStoneName) {
    await API.getCharacterInfo().then(async (data) => {
      // 获取无尽之衣的id
      let bodyArmor = data.equipmentSlots.bodyArmor;
      let stoneId;
      let socketId = bodyArmor.sockets[0].findIndex((item) => item.skillId === preStoneName);
      let equipmentId = bodyArmor.id;
      if (socketId === -1) {
        console.log("未找到宝石");
        return;
      }
      // 获取当前账号的要替换的宝石，然后给无尽之衣先移除原来的再镶嵌上
      await API.getSkillStones().then(async (data) => {
        stoneId = data.find((item) => item.skillId === nextStoneName).id;
      });
      stoneId &&
        (await API.removeStone(equipmentId, socketId + 1).then(async () => {
          await API.insertStone(equipmentId, socketId + 1, stoneId);
        }));
    });
  }
  async function getEndlessAccountBackpacks() {
    if (endlessGarmentBackpacks.length < 3) {
      await loginAndSelectCharacter(AccountHandle.endlessAccount.name, AccountHandle.endlessAccount.pwd, 0).then(async (data) => {
        // 将token先存起来
        currentExtraToken = data;
        await API.getBackpack().then((data) => {
          // 将背包装备存起来
          endlessGarmentBackpacks = data.items.filter((item) => item.name === "无尽之衣");
          console.log("🚀 ~ awaitgetBackpack ~ endlessGarmentBackpacks:", endlessGarmentBackpacks);
        });
      });
      if (endlessGarmentBackpacks.length < 3) {
        console.log("无尽之衣不足3件得切换号了");
        throw "无尽之衣不足3件得切换账号了";
      }
    }
  }
  async function getEndlessGarment() {
    // 先登录拥有无尽之衣的账号,并将它背包的装备存起来，方便之后其他小号购买

    // 拥有无尽之衣的账号上架无尽之衣
    await API.sellItem(endlessGarmentBackpacks[0].id, { 4: 1 }, "extra").then(async () => {
      console.log("上架成功");
      currentSellItem = endlessGarmentBackpacks.shift();
      await API.getMarket().then(async () => {
        console.log("获取市场信息成功");
        let item = currentMarketItems.find((item) => item.equipmentId === currentSellItem.id);
        if (item) {
          console.log("找到上架物品");
          await API.buyItem(item.id).then(async () => {
            console.log("购买成功");
            // 给无尽之衣镶嵌宝石
            // await Character.insertStoneToEndlessGarment();
            // await Character.equipEndlessGarment();
          });
        } else {
          console.log("未找到上架物品");
        }
      });
    });
  }

  async function getEndlessGarmentFromOtherAccount(endlessAccountItem, accountItem) {
    // 先登录拥有无尽之衣的账号,并将它背包的装备存起来，方便之后其他小号购买

    if (endlessGarmentBackpacks.length < 3) {
      await loginAndSelectCharacter(endlessAccountItem.name, endlessAccountItem.pwd, 0).then(async (data) => {
        // 将token先存起来
        currentExtraToken = data;
        await API.getBackpack().then((data) => {
          // 将背包装备存起来
          endlessGarmentBackpacks = data.items.filter((item) => item.name === "无尽之衣");
          console.log("🚀 ~ awaitgetBackpack ~ endlessGarmentBackpacks:", endlessGarmentBackpacks);
        });
      });
      if (endlessGarmentBackpacks.length < 3) {
        console.log("无尽之衣不足3件得切换账号了");
        return;
      }
    }
    for (let index = 0; index < 3; index++) {
      // 登录小号，从拥有无尽之衣的账号购买
      await loginAndSelectCharacter(accountItem.name, accountItem.pwd, index).then(async (data) => {
        // 拥有无尽之衣的账号上架无尽之衣
        await API.sellItem(endlessGarmentBackpacks[0].id, { 4: 1 }, "extra").then(async () => {
          console.log("上架成功");
          currentSellItem = endlessGarmentBackpacks.shift();
          await API.getMarket().then(async () => {
            console.log("获取市场信息成功");
            let item = currentMarketItems.find((item) => item.equipmentId === currentSellItem.id);
            if (item) {
              console.log("找到上架物品");
              await API.buyItem(item.id).then(async () => {
                console.log("购买成功");
                // 给无尽之衣镶嵌宝石
                await Character.insertStoneToEndlessGarment();
                await Character.equipEndlessGarment();
              });
            } else {
              console.log("未找到上架物品");
            }
          });
        });
      });
    }
  }
  async function buySkillStone(skillStoneList) {
    let promises = [];
    skillStoneList.forEach((item) => {
      promises.push(API.buyShopItem(item));
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

  async function startCreateAccount() {
    // 33 - 46
    let name = "a666985247";
    for (let index = 0; index < 2; index++) {
      await createAccountProgress({
        name: name,
        pwd: "123456",
      });
      await initAccountProgress({
        name: name,
        pwd: "123456",
      });
      let str = name;
      name = str.replace(/a6669852(\d+)/, (match, p1) => "a6669852" + (Number(p1) + 1));
    }
  }
  async function initAccountProgress(accountItem) {
    // 1 登录账号
    // 2 获取角色列表 如果角色列表为空，创建角色
    // https://poe.faith.wang/api/character/create {"name":"t331","class":2}
    // 3 选择角色
    // 4 选择层数挂机 https://poe.faith.wang/api/battle/start {"mapId":"1_1_1"}
    for (let index = 0; index < 3; index++) {
      await loginAndSelectCharacter(accountItem.name, accountItem.pwd, index).then(async () => {
        console.log(`角色${index}登录成功`);
        // 选择地图
        await API.chooseMap("1_1_1").then(() => {
          console.log(`角色${index}选择地图成功`);
        });
      });
    }
    await API.addGoodsRule().then(() => {
      console.log("添加筛选规则成功");
    });

    // 1 登录账号
    // 2 选择角色
    // 3 选择层数挂机 https://poe.faith.wang/api/battle/start {"mapId":"1_1_1"
  }
  async function createAccountProgress(createAccountItem) {
    await API.login(createAccountItem.name, createAccountItem.pwd).then(async () => {
      console.log("登录成功");
      await API.getCharacterList().then(async () => {
        console.log("获取角色列表成功");
        if (currentCharacterList.length === 0) {
          for (let index = 0; index < 3; index++) {
            await API.createAccount(parseAccountName(createAccountItem.name, index), 2).then(() => {
              console.log(`创建${parseAccountName(createAccountItem.name, index)}成功`);
            });
          }
        }
      });
    });
  }

  window.onload = function () {
    main();
  };
  main();
  // makeCustomView();
})();
