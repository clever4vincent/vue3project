import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const store = createPinia().use(piniaPluginPersistedstate);
export function setupStore(app) {
    app.use(store);
}
export { store };
export { useStore, useLoadingStore } from "./app";
export { useAccountStore } from "./account";
export { useTokenStore } from "./token";
