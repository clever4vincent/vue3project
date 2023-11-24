import { createRouter, createWebHistory } from "vue-router";
import { useRouterStoreWithOut, useStoreWithOut } from "@/stores";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        isMain: true,
        index: 1,
      },
      component: HomeView,
    },
    {
      path: "/my",
      meta: { isMain: true, index: 1 },
      name: "my",
      component: () => import("../views/MyView.vue"),
    },
    {
      path: "/setting",
      meta: { isMain: true, index: 1 },
      name: "setting",
      component: () => import("../views/SettingView.vue"),
    },
    {
      path: "/equipment",
      name: "equipment",
      meta: { index: 2 },
      component: () => import("../views/Equipment.vue"),
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
// let isBack = false; // 用于判断页面是前进还是后退

// router.beforeEach((to, from, next) => {
//   if (to.path < from.path) {
//     isBack = true;
//   } else {
//     isBack = false;
//   }
//   if (to.meta.isMain) {
//     useRouterStoreWithOut().setIsMainRouter(true);
//   } else {
//     useRouterStoreWithOut().setIsMainRouter(false);
//   }
//   next();
// });
router.beforeEach((to, from) => {
  if (to.meta.index > from.meta.index) {
    // 说明是由主级路由跳转到次级路由 页面从右边滑入
    useStoreWithOut().transitionName = "slide-right";
  } else if (to.meta.index < from.meta.index) {
    // 由次级到主级路由 页面从左边滑出
    useStoreWithOut().transitionName = "slide-left";
  } else {
    useStoreWithOut().transitionName = ""; // 同级无过渡效果
    // 同级如果都是主级路由，那么就没有过渡效果
    // 如果都是次级路由，那么就有过渡效果
    // 但是次级路由之间的左右滑入，要根据路由的先后顺序来判断，这个需要知道路由在历史记录中的位置
    // 由于路由是动态的，所以不能写死，需要根据路由的meta属性来判断
  }
  if (to.meta.isMain) {
    useRouterStoreWithOut().setIsMainRouter(true);
  } else {
    useRouterStoreWithOut().setIsMainRouter(false);
  }
});
// router.afterEach((to, from) => {
//   if (to.meta.isMain && from.meta.isMain) {
//     useStoreWithOut().transitionName = "no-transition";
//   } else {
//     useStoreWithOut().transitionName = isBack ? "slide-right" : "slide-left";
//   }
// });

export default router;
