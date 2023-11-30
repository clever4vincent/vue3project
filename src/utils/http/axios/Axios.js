import axios from "axios";
import { AxiosCanceler } from "./axiosCancel";
import { isFunction } from "@/utils/is";
import { cloneDeep } from "lodash-es";
import { ContentTypeEnum } from "@/enums/httpEnum";
import { getAppEnvConfig } from "@/utils/env";

/**
 * @description:  axios module
 */
export class ZAxios {
  axiosInstance;
  options;

  constructor(options) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description:  Create axios instance
   */
  createAxios(config) {
    this.axiosInstance = axios.create(config);
  }

  getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios() {
    return this.axiosInstance;
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description: Set general header
   */
  setHeader(headers) {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description: Interceptor configuration
   */
  setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;

    const axiosCanceler = new AxiosCanceler();

    // 请求侦听器配置处理
    this.axiosInstance.interceptors.request.use((config) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      // @ts-ignore
      const { ignoreCancelToken } = config.requestOptions;

      const ignoreCancel = ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.requestOptions?.ignoreCancelToken;

      !ignoreCancel && axiosCanceler.addPending(config);
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, undefined);

    // 请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res) => {
      res && axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应结果拦截器错误捕获
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }

  /**
   * 文件上传
   */
  //--@updateBy-begin----author:liusq---date:20211117------for:增加上传回调参数callback------
  uploadFile(config, params, callback) {
    //--@updateBy-end----author:liusq---date:20211117------for:增加上传回调参数callback------
    const formData = new window.FormData();
    const customFilename = params.name || "file";

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }
    const glob = getAppEnvConfig();
    config.baseURL = glob.VITE_BASE_UPLOAD_API;
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data[key]);
      });
    }

    return this.axiosInstance
      .request({
        ...config,
        method: "POST",
        data: formData,
        headers: {
          "Content-type": ContentTypeEnum.FORM_DATA,
          ignoreCancelToken: true,
        },
      })
      .then((res) => {
        //--@updateBy-begin----author:liusq---date:20210914------for:上传判断是否包含回调方法------
        if (callback?.success && isFunction(callback?.success)) {
          callback?.success(res?.data);
          //--@updateBy-end----author:liusq---date:20210914------for:上传判断是否包含回调方法------
        } else if (callback?.isReturnResponse) {
          //--@updateBy-begin----author:liusq---date:20211117------for:上传判断是否返回res信息------
          return Promise.resolve(res?.data);
          //--@updateBy-end----author:liusq---date:20211117------for:上传判断是否返回res信息------
        } else {
          if (res.data.success == true && res.data.code == 200) {
            // createMessage.success(res.data.message);
          } else {
            // createMessage.error(res.data.message);
          }
        }
      });
  }

  // // 支持表单数据
  // supportFormData(config) {
  //     const headers = config.headers || this.options.headers;
  //     const contentType = headers?.["Content-Type"] || headers?.["content-type"];

  //     if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, "data") || config.method?.toUpperCase() === RequestEnum.GET) {
  //         return config;
  //     }

  //     return {
  //         ...config,
  //         data: qs.stringify(config.data, { arrayFormat: "brackets" })
  //     };
  // }

  get(config, options) {
    return this.request({ ...config, method: "GET" }, options);
  }

  post(config, options) {
    return this.request({ ...config, method: "POST" }, options);
  }

  put(config, options) {
    return this.request({ ...config, method: "PUT" }, options);
  }

  delete(config, options) {
    return this.request({ ...config, method: "DELETE" }, options);
  }

  request(config, options) {
    let conf = cloneDeep(config);

    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook, requestFinallyHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    if (requestOptions.proxy) {
      conf.proxy = requestOptions.proxy;
    }
    // conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then((res) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              //zhangyafei---添加回调方法
              config.success && config.success(res.data);
              //zhangyafei---添加回调方法
              resolve(ret);
            } catch (err) {
              reject(err || new Error("request error!"));
            }
            return;
          }
          resolve(res);
        })
        .catch((e) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // 在此处重写来自axios的错误消息
          }
          reject(e);
        })
        .finally(() => {
          if (requestFinallyHook && isFunction(requestFinallyHook)) {
            requestFinallyHook(opt);
          }
        });
    });
  }

  /**
   * 【用于评论功能】自定义文件上传-请求
   * @param url
   * @param formData
   */
  uploadMyFile(url, formData) {
    const glob = getAppEnvConfig();
    return this.axiosInstance.request({
      url: url,
      baseURL: glob.VITE_BASE_UPLOAD_API,
      method: "POST",
      data: formData,
      headers: {
        "Content-type": ContentTypeEnum.FORM_DATA,
        ignoreCancelToken: true,
      },
    });
  }
}
