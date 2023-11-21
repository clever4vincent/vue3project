import { defineStore } from "pinia";
import { store } from "@/stores";

export const useTokenStore = defineStore({
    id: "app-token",
    state: () => ({
        token: null,
        tokenMap: null,
    }),
    getters: {
        getToken() {
            return this.token || null;
        },
        getErrorLogListCount() {
            return this.errorLogListCount;
        },
    },
    actions: {
        setToken(token) {
            this.token = token;
        },

        async setErrorLogListCount(count) {
            this.errorLogListCount = count;
        },
    },
    persist: true,
});

// Need to be used outside the setup
export function useTokenStoreWithOut() {
    return useTokenStore(store);
}
