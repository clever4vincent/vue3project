import { ref } from "vue";
import { store } from "@/stores";
import { defineStore } from "pinia";
// import { getPrefersColorScheme, getTheme } from "../utils/theme";
export const useThemeStore = defineStore(
  "theme",
  () => {
    const theme = ref("light");

    function toDark() {
      theme.value = "dark";
    }
    function toLight() {
      theme.value = "light";
    }

    return { theme, toLight, toDark };
  },
  {
    persist: true,
  }
);
export const useStore = defineStore("app", () => {
  const transitionName = ref("");

  function setTransitionName(value) {
    transitionName.value = value;
  }

  return { transitionName, setTransitionName };
});
export const useLoadingStore = defineStore("loading", () => {
  const loading = ref(0);
  function showLoading() {
    loading.value++;
  }
  function hideLoading() {
    if (loading.value > 0) {
      loading.value--;
    }
  }

  return { loading, showLoading, hideLoading };
});
export const useRouterStore = defineStore("router", () => {
  const isMainRouter = ref(true);
  function setIsMainRouter(value) {
    isMainRouter.value = value;
  }
  return { isMainRouter, setIsMainRouter };
});
// Need to be used outside the setup
export function useLoadingStoreWithOut() {
  return useLoadingStore(store);
}
export function useStoreWithOut() {
  return useStore(store);
}
export function useRouterStoreWithOut() {
  return useRouterStore(store);
}
