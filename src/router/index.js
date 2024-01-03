import { createRouter, createWebHistory } from "vue-router";
import { useRouterStoreWithOut, useStoreWithOut } from "@/stores";
import HomeView from "../views/HomeView.vue";
import MyView from "../views/MyView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        isMain: true,
        index: 1,
        keepAlive: true,
      },
      component: HomeView,
    },
    // {
    //   path: "/my",
    //   meta: { isMain: true, index: 1 },
    //   name: "my",
    //   component: () => import("../views/MyView.vue"),
    // },
    {
      path: "/batch",
      meta: { isMain: true, index: 1, keepAlive: true },
      name: "batch",
      component: () => import("../views/BatchView.vue"),
    },
    {
      path: "/setting",
      meta: { isMain: true, index: 1, keepAlive: true },
      name: "setting",
      component: () => import("../views/SettingView.vue"),
    },
    {
      path: "/equipment",
      name: "equipment",
      meta: { index: 2 },
      component: () => import("../views/EquipmentView.vue"),
    },
    {
      path: "/createAccount",
      name: "createAccount",
      meta: { index: 2, keepAlive: true },
      component: () => import("../views/CreateAccountView.vue"),
    },
    {
      path: "/test",
      name: "test",
      meta: { index: 2 },
      component: () => import("../views/TestView.vue"),
    },
    {
      path: "/music",
      name: "music",
      meta: { index: 2 },
      component: () => import("../views/MusicView.vue"),
    },
    {
      path: "/movie",
      name: "movie",
      meta: { index: 2 },
      component: () => import("../views/MovieView.vue"),
    },
    {
      path: "/about",
      meta: { isMain: true, index: 1 },
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
// let history = useStoreWithOut().history;

router.beforeEach((to, from, next) => {
  // 如果是直接访问 URL 或刷新页面，且不是已经在 'home' 路由，才重定向到 'home' 路由
  if (from.name === undefined && to.name !== "home") {
    next({ name: "home" });
    return;
  }
  const index = useStoreWithOut().history.findIndex((h) => h.path === to.path);
  if (index !== -1) {
    useStoreWithOut().history = useStoreWithOut().history.slice(0, index + 1);
  } else {
    useStoreWithOut().history.push(to);
  }

  if (to.meta.index > from.meta.index) {
    // 说明是由主级路由跳转到次级路由 页面从右边滑入
    useStoreWithOut().transitionName = "slide-right";
  } else if (to.meta.index < from.meta.index) {
    // 由次级到主级路由 页面从左边滑出
    useStoreWithOut().transitionName = "slide-left";
    // useStoreWithOut().transitionName = "slide-right";
  } else {
    // 同级如果都是主级路由，那么就没有过渡效果
    // 如果都是次级路由，那么就有过渡效果
    // 但是次级路由之间的左右滑入，要根据路由的先后顺序来判断，这个需要知道路由在历史记录中的位置
    // 根据to和from的index来判断，如果to的index大于from的index，那么就是从右边滑入，否则就是从左边滑入
    if (to.meta.isMain && from.meta.isMain) {
      useStoreWithOut().transitionName = "";
    } else {
      if (to.meta.index > from.meta.index || index > -1) {
        useStoreWithOut().transitionName = "slide-left";
      } else {
        useStoreWithOut().transitionName = "slide-right";
      }
    }
  }
  if (from.name === undefined) {
    useStoreWithOut().transitionName = "";
  }
  if (to.meta.isMain) {
    useRouterStoreWithOut().setIsMainRouter(true);
  } else {
    useRouterStoreWithOut().setIsMainRouter(false);
  }

  next();
});
// router.afterEach((to, from) => {
//   if (to.meta.isMain && from.meta.isMain) {
//     useStoreWithOut().transitionName = "no-transition";
//   } else {
//     useStoreWithOut().transitionName = isBack ? "slide-right" : "slide-left";
//   }
// });

export default router;
