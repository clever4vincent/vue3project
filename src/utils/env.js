import { getConfigFileName } from "../../build/getConfigFileName";
import pkg from "../../package.json";

export function getCommonStoragePrefix() {
  const { VITE_APP_NAME } = getAppEnvConfig();
  return `${VITE_APP_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  // const ENV_NAME = getConfigFileName(import.meta.env);

  // const ENV = import.meta.env.DEV
  //   ? // Get the global configuration (the configuration will be extracted independently when packaging)
  //     import.meta.env
  //   : window[ENV_NAME];
  const ENV = import.meta.env;

  const { VITE_APP_NAME, VITE_GLOB_API_URL, VITE_USE_MOCK, VITE_BASE_UPLOAD_API, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_DOMAIN_URL } = ENV;

  // if (!/^[a-zA-Z_]*$/.test(VITE_APP_NAME)) {
  //     // warn(
  //     //   `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
  //     // );
  // }

  return {
    VITE_APP_NAME,
    VITE_BASE_UPLOAD_API,
    VITE_GLOB_API_URL,
    VITE_USE_MOCK,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_DOMAIN_URL,
  };
}

/**
 * @description: Development mode
 */
export const devMode = "development";

/**
 * @description: Production mode
 */
export const prodMode = "production";

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv() {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode() {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode() {
  return import.meta.env.PROD;
}
