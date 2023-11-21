import axios from "axios";
import { useEnv } from "@/hooks";
import { ResultEnum, ContentTypeEnum } from "@/enums/httpEnum";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { setErrorMessage, addAjaxErrorLog, addAjaxLog } from "./log";
import { useLoadingStore } from "@/stores";
import { AxiosCancel } from "./cancel";
import { AxiosRetry } from "./retry";

const defaultConfig = {
    successMessage: false,
    errorMessage: true,
    cancelSame: false,
    isRetry: false,
    retryCount: 3,
    loading: true
};

const { VITE_BASE_API } = useEnv();

const axiosCancel = new AxiosCancel();

const service = axios.create({
    baseURL: VITE_BASE_API,
    timeout: 30 * 1000, // 请求超时时间
    headers: { "Content-Type": ContentTypeEnum.JSON }
});

service.interceptors.request.use((config) => {
    const { getToken } = useUserStoreWithOut();

    const { cancelSame, loading } = config.requestOptions;
    if (cancelSame) {
        axiosCancel.addPending(config);
    }

    if (getToken) {
        config.headers.Authorization = unref(`Bearer ${getToken}`) ?? "";
    }
    if (loading) {
        useLoadingStore.showLoading();
    }

    return config;
});

service.interceptors.response.use(
    (response) => {
        const data = response.data;
        axiosCancel.removePending(response.config);
        if (data.code === ResultEnum.SUCCESS) {
            addAjaxLog(response);
            return data;
        } else {
            addAjaxErrorLog(response, data.message);
            return Promise.reject(data);
        }
    },
    (err) => {
        if (err.code === "ERR_CANCELED") return;
        const { isRetry, retryCount } = err.config.requestOptions;
        if (isRetry && (err.config._retryCount || 0) < retryCount) {
            const axiosRetry = new AxiosRetry();
            axiosRetry.retry(service, err);
            return;
        }
        axiosCancel.removePending(err.config || {});
        setErrorMessage(err.response);
        return Promise.reject(err.response);
    }
);

const request = {
    get(url, data, config) {
        return request.request("GET", url, { params: data }, config);
    },
    post(url, data, config) {
        return request.request("POST", url, { data }, config);
    },

    request(method = "GET", url, data, config) {
        const options = Object.assign({}, defaultConfig, config);
        return new Promise((resolve, reject) => {
            service({ method, url, ...data, requestOptions: options })
                .then((res) => {
                    resolve(res);
                })
                .catch((e) => {
                    reject(e);
                })
                .finally(() => {
                    if (options.loading) {
                        useLoadingStore.hideLoading();
                    }
                });
        });
    }
};

export default request;
