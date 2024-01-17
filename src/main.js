import "./assets/main.css";
import "animate.css";
import "./utils/rem.js";
import "vant/es/toast/style";
import "vant/es/field/style";
import "vant/es/dialog/style";
import "vant/es/search/style";
import "vant/es/dropdown-menu/style";
import "vant/es/dropdown-item/style";
import "vant/es/back-top/style";
import "vant/es/notify/style";
import "vant/es/action-sheet/style";
import "vant/es/popup/style";
import "vant/es/popover/style";

import "@icon-park/vue-next/styles/index.css";
import { setupStore } from "@/stores";
import { createApp } from "vue";
import { Toast } from "vant";

// import flexible from 'amfe-flexible'
import App from "./App.vue";
import router from "./router";
import { Lazyload } from "vant";
import { RecycleScroller } from "vue-virtual-scroller";

// import FastClick from "fastclick";
import FastClick from "./utils/myfastclick.js";
FastClick.attach(document.body);
import "virtual:svg-icons-register";
import "./utils/resetFastClick.js";
import "./assets/base.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
// import "./lib/inobounce.js";
const app = createApp(App);
setupStore(app);
app.use(Lazyload);
app.use(router);
app.use(Toast);

app.component("RecycleScroller", RecycleScroller);
app.mount("#app");
