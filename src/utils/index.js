import { unref } from "vue";
import { isObject } from "@/utils/is";

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node) {
    return node?.parentNode ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl, obj) {
    let parameters = "";
    for (const key in obj) {
        parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
    }
    parameters = parameters.replace(/&$/, "");
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, "?") + parameters;
}

export function deepMerge(src = {}, target = {}) {
    let key;
    for (key in target) {
        src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}

export function openWindow(url, opt) {
    const { target = "__blank", noopener = true, noreferrer = true } = opt || {};
    const feature = [];

    noopener && feature.push("noopener=yes");
    noreferrer && feature.push("noreferrer=yes");

    window.open(url, target, feature.join(","));
}

// dynamic use hook props
export function getDynamicProps(props) {
    const ret = {};

    Object.keys(props).map((key) => {
        ret[key] = unref(props[key]);
    });

    return ret;
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export const withInstall = (component, alias) => {
    console.log("---初始化---", component);

    const comp = component;
    comp.install = (app) => {
        app.component(comp.name || comp.displayName, component);
        if (alias) {
            app.config.globalProperties[alias] = component;
        }
    };
    return component;
};

/**
 * 获取url地址参数
 * @param paraName
 */
export function getUrlParam(paraName) {
    let url = document.location.toString();
    let arrObj = url.split("?");

    if (arrObj.length > 1) {
        let arrPara = arrObj[1].split("&");
        let arr;

        for (let i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    } else {
        return "";
    }
}

/**
 * 休眠（setTimeout的promise版）
 * @param ms 要休眠的时间，单位：毫秒
 * @param fn callback，可空
 * @return Promise
 */
export function sleep(ms, fn) {
    return new Promise((resolve) =>
        setTimeout(() => {
            fn && fn();
            resolve();
        }, ms)
    );
}

/**
 * 不用正则的方式替换所有值
 * @param text 被替换的字符串
 * @param checker  替换前的内容
 * @param replacer 替换后的内容
 * @returns {String} 替换后的字符串
 */
export function replaceAll(text, checker, replacer) {
    let lastText = text;
    text = text.replace(checker, replacer);
    if (lastText !== text) {
        return replaceAll(text, checker, replacer);
    }
    return text;
}

/**
 * 获取URL上参数
 * @param url
 */
export function getQueryVariable(url) {
    if (!url) return;

    var t,
        n,
        r,
        i = url.split("?")[1],
        s = {};
    (t = i.split("&")), (r = null), (n = null);
    for (var o in t) {
        var u = t[o].indexOf("=");
        u !== -1 && ((r = t[o].substr(0, u)), (n = t[o].substr(u + 1)), (s[r] = n));
    }
    return s;
}

/**
 * 数字转大写
 * @param value
 * @returns {*}
 */
export function numToUpper(value) {
    if (value != "") {
        let unit = new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分");
        const toDx = (n) => {
            switch (n) {
                case "0":
                    return "零";
                case "1":
                    return "壹";
                case "2":
                    return "贰";
                case "3":
                    return "叁";
                case "4":
                    return "肆";
                case "5":
                    return "伍";
                case "6":
                    return "陆";
                case "7":
                    return "柒";
                case "8":
                    return "捌";
                case "9":
                    return "玖";
            }
        };
        let lth = value.toString().length;
        value *= 100;
        value += "";
        let length = value.length;
        if (lth <= 8) {
            let result = "";
            for (let i = 0; i < length; i++) {
                if (i == 2) {
                    result = "元" + result;
                } else if (i == 6) {
                    result = "万" + result;
                }
                if (value.charAt(length - i - 1) == 0) {
                    if (i != 0 && i != 1) {
                        if (result.charAt(0) != "零" && result.charAt(0) != "元" && result.charAt(0) != "万") {
                            result = "零" + result;
                        }
                    }
                    continue;
                }
                result = toDx(value.charAt(length - i - 1)) + unit[unit.length - i - 1] + result;
            }
            result += result.charAt(result.length - 1) == "元" ? "整" : "";
            return result;
        } else {
            return null;
        }
    }
    return null;
}

/**
 * 获取随机颜色
 */
export function getRandomColor(index) {
    const colors = [
        "rgb(100, 181, 246)",
        "rgb(77, 182, 172)",
        "rgb(255, 183, 77)",
        "rgb(229, 115, 115)",
        "rgb(149, 117, 205)",
        "rgb(161, 136, 127)",
        "rgb(144, 164, 174)",
        "rgb(77, 208, 225)",
        "rgb(129, 199, 132)",
        "rgb(255, 138, 101)",
        "rgb(133, 202, 205)",
        "rgb(167, 214, 118)",
        "rgb(254, 225, 89)",
        "rgb(251, 199, 142)",
        "rgb(239, 145, 139)",
        "rgb(169, 181, 255)",
        "rgb(231, 218, 202)",
        "rgb(252, 128, 58)",
        "rgb(254, 161, 172)",
        "rgb(194, 163, 205)"
    ];
    return index && index < 19 ? colors[index] : colors[Math.floor(Math.random() * (colors.length - 1))];
}

export function getRefPromise(componentRef) {
    return new Promise((resolve) => {
        (function next() {
            const ref = componentRef.value;
            if (ref) {
                resolve(ref);
            } else {
                setTimeout(() => {
                    next();
                }, 100);
            }
        })();
    });
}

/**
 * 2023-09-04
 * liaozhiyang
 * 用new Function替换eval
 */
export function _eval(str) {
    return new Function(`return ${str}`)();
}
