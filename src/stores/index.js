import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const store = createPinia().use(piniaPluginPersistedstate);
export function setupStore(app) {
  app.use(store);
}
export { store };
export { useStore, useLoadingStore, useRouterStore, useRouterStoreWithOut, useThemeStore, useStoreWithOut, useConditionStore } from "./app";
export { useAccountStore, useAccountStoreWithOut } from "./account";
export { useTokenStore, useTokenStoreWithOut } from "./token";
