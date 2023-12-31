// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import { ZAxios } from "./Axios";
import { checkStatus } from "./checkStatus";
import { getAppEnvConfig } from "@/utils/env";
import { RequestEnum, ContentTypeEnum, ConfigEnum } from "@/enums/httpEnum";
import { isString } from "@/utils/is";
import { showToast } from "vant";
import { setObjToUrlParams, deepMerge } from "@/utils";
import { useErrorLogStore } from "@/stores/errorLog";
import { useLoadingStore, useTokenStore } from "@/stores";
import { joinTimestamp, formatRequestDate } from "./helper";

const globSetting = getAppEnvConfig();
const urlPrefix = globSetting.urlPrefix;
// const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform = {
    /**
     * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
     */
    transformRequestHook: (res, options) => {
        const { isTransformResponse, isReturnNativeResponse } = options;
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res;
        }
        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，data，message这些信息时开启
        if (!isTransformResponse) {
            return res.data;
        }
        // 错误的时候返回

        const { data } = res;
        if (!data) {
            // return '[HTTP] Request has no return value';
            throw new Error("数据返回有问题");
        }
        //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
        const { success, message } = data;
        const result = data.data || data.message || {};
        // 这里逻辑可以根据项目进行修改

        const hasSuccess = data && success;

        if (hasSuccess) {
            // 接口返回成功
            if (success && options.successMessageMode === "success") {
                //信息成功提示
                // createMessage.success(message);
            }
            return result;
        }

        // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
        if (options.errorMessageMode === "modal") {
            // createErrorModal({ title: t("sys.api.errorTip"), content: timeoutMsg });
            // 显示错误弹窗
        } else if (options.errorMessageMode === "message") {
            // 显示错误文本
            // createMessage.error(timeoutMsg);
            showToast({
                message,
            });
        }

        throw new Error(result || "请求出错！");
    },

    // 请求之前处理config
    beforeRequestHook: (config, options) => {
        const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

        if (joinPrefix && urlPrefix) {
            config.url = `${urlPrefix}${config.url}`;
        }

        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`;
        }
        const params = config.params || {};
        const data = config.data || false;
        formatDate && data && !isString(data) && formatRequestDate(data);
        if (config.method?.toUpperCase() === RequestEnum.GET) {
            if (!isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
            } else {
                // 兼容restful风格
                config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
                config.params = undefined;
            }
        } else {
            if (!isString(params)) {
                formatDate && formatRequestDate(params);
                if (Reflect.has(config, "data") && config.data && Object.keys(config.data).length > 0) {
                    config.data = data;
                    config.params = params;
                } else {
                    // 非GET请求如果没有提供data，则将params视为data
                    config.data = params;
                    config.params = undefined;
                }
                if (joinParamsToUrl) {
                    config.url = setObjToUrlParams(config.url, Object.assign({}, config.params, config.data));
                }
            } else {
                // 兼容restful风格
                config.url = config.url + params;
                config.params = undefined;
            }
        }
        return config;
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config, options) => {
        const { loading } = config.requestOptions;
        // 请求之前处理config
        // const token = getToken();
        const token = useTokenStore().getToken;

        if (token && config?.requestOptions?.withToken !== false) {
            config.headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
            config.headers[ConfigEnum.VERSION] = "v1";
        }
        if (loading) {
            useLoadingStore().showLoading();
        }
        return config;
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res) => {
        return res;
    },

    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: (error) => {
        const errorLogStore = useErrorLogStore();
        errorLogStore.addAjaxErrorInfo(error);
        const { response, code, message, config } = error || {};
        const errorMessageMode = config?.requestOptions?.errorMessageMode || "none";
        //scott 20211022 token失效提示信息
        //const msg: string = response?.data?.error?.message ?? '';
        const msg = response?.data?.message ?? "";
        const err = error?.toString?.() ?? "";
        let errMessage = "";

        try {
            if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
                errMessage = "接口请求超时,请刷新页面重试!";
            }
            if (err?.includes("Network Error")) {
                errMessage = "网络异常，请检查您的网络连接是否正常!";
            }

            if (errMessage) {
                if (errorMessageMode === "modal") {
                    // createErrorModal({ title: t("sys.api.errorTip"), content: errMessage });
                } else if (errorMessageMode === "message") {
                    // createMessage.error(errMessage);
                }
                return Promise.reject(error);
            }
        } catch (error) {
            throw new Error(error);
        }

        checkStatus(error?.response?.status, msg, errorMessageMode);
        return Promise.reject(error);
    },
    /**
     * @description: 请求最终拦截器
     */
    requestFinallyHook: (opt) => {
        const { loading } = opt;

        loading && useLoadingStore().hideLoading();
    },
};

function createAxios(opt) {
    return new ZAxios(
        deepMerge(
            {
                // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
                // authentication schemes，e.g: Bearer
                authenticationScheme: "Bearer",
                // authenticationScheme: "",
                timeout: 60 * 1000,
                // 基础接口地址
                // baseURL: globSetting.apiUrl,
                headers: { "Content-Type": ContentTypeEnum.JSON },
                // 如果是form-data格式
                // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
                // 数据处理方式
                transform,
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // 默认将prefix 添加到url
                    joinPrefix: true,
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    // 需要对返回数据进行处理
                    isTransformResponse: true,
                    // post请求的时候添加参数到url
                    joinParamsToUrl: false,
                    // 格式化提交参数时间
                    formatDate: true,
                    // 异常消息提示类型
                    errorMessageMode: "message",
                    // 成功消息提示类型
                    successMessageMode: "none",
                    // 接口地址
                    apiUrl: globSetting.VITE_GLOB_API_URL,
                    // 接口拼接地址
                    urlPrefix: urlPrefix,
                    //  是否加入时间戳
                    joinTime: true,
                    // 是否加载loading
                    loading: true,
                    // 忽略重复请求
                    ignoreCancelToken: true,
                    // 是否携带token
                    withToken: true,
                },
            },
            opt || {}
        )
    );
}
export const defHttp = createAxios();
