/**
 * @description: Request result set
 */
export const ResultEnum = {
    SUCCESS: 200,
    ERROR: 500
};
export const RequestEnum = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};
/**
 * @description:  contentType
 */
export const ContentTypeEnum = {
    // json
    JSON: "application/json;charset=UTF-8",
    // form-data qs
    FORM_URLENCODED: "application/x-www-form-urlencoded;charset=UTF-8",
    // form-data  upload
    FORM_DATA: "multipart/form-data;charset=UTF-8"
};

/**
 * @description:  contentType
 */
export const ErrorMsgEnum = {
    ERROR_400: "请求失败，参数类型不匹配",
    ERROR_401: "请求失败，登录状态已过期",
    ERROR_403: "请求失败，您无权访问",
    ERROR_404: "请求失败，未找到该资源",
    ERROR_500: "请求失败，服务器错误，请联系管理员",
    ERROR_503: "请求失败，服务器异常",
    ERROR_504: "请求失败，请求超时"
};

export const ErrorTypeEnum = {
    VUE: "vue",
    SCRIPT: "script",
    AJAX: "ajax"
};
/**
 * 请求header
 * @description:  contentTyp
 */
export const ConfigEnum = {
    // 版本
    VERSION: "Z-Version"
};
