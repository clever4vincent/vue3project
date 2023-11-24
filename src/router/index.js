import { createRouter, createWebHistory } from "vue-router";
import { useRouterStoreWithOut, useStoreWithOut } from "@/stores";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { isMain: true },
      component: HomeView,
    },
    {
      path: "/my",
      meta: { isMain: true },
      name: "my",
      component: () => import("../views/MyView.vue"),
    },
    {
      path: "/setting",
      meta: { isMain: true },
      name: "setting",
      component: () => import("../views/SettingView.vue"),
    },
    {
      path: "/equipment",
      name: "equipment",
      component: () => import("../views/Equipment.vue"),
    },
    {
      path: "/about",
      meta: { isMain: true },
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
let isBack = false; // 用于判断页面是前进还是后退

router.beforeEach((to, from, next) => {
  if (to.path < from.path) {
    isBack = true;
  } else {
    isBack = false;
  }
  if (to.meta.isMain) {
    useRouterStoreWithOut().setIsMainRouter(true);
  } else {
    useRouterStoreWithOut().setIsMainRouter(false);
  }
  next();
});
router.afterEach((to, from) => {
  if (to.meta.isMain && from.meta.isMain) {
    useStoreWithOut().transitionName = "no-transition";
  } else {
    useStoreWithOut().transitionName = isBack ? "slide-right" : "slide-left";
  }
});

export default router;
