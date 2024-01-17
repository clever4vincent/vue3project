import { ref } from "vue";
import { store } from "@/stores";
import { defineStore } from "pinia";
// import { getPrefersColorScheme, getTheme } from "../utils/theme";
export const useThemeStore = defineStore(
  "theme",
  () => {
    const theme = ref("dark");

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
export const useConditionStore = defineStore(
  "condition",
  () => {
    const conditionGroups = ref({});
    const currentGroup = ref({});
    const currentRetry = ref();
    const currentOpenMakeup = ref(false);
    const currentOpenEEE = ref(false);

    const currentTermCount = ref();

    return { conditionGroups, currentGroup, currentRetry, currentTermCount, currentOpenMakeup, currentOpenEEE };
  },
  {
    persist: true,
  }
);
export const useStore = defineStore("app", () => {
  const transitionName = ref("");
  const isFooterHideen = ref(false);
  const history = ref([]);
  const isModifyRunning = ref(false);
  const equipmentModify = ref({});
  function setTransitionName(value) {
    transitionName.value = value;
  }
  function setIsFooterHideen(value) {
    isFooterHideen.value = value;
  }

  return { transitionName, setTransitionName, isFooterHideen, setIsFooterHideen, history, equipmentModify, isModifyRunning };
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
export function useConditionStoreWithOut() {
  return useConditionStore(store);
}
