import "./assets/main.css";
import "animate.css";
import "./utils/rem.js";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import { setupStore } from "@/stores";
import { createApp } from "vue";
import { Toast } from "vant";

// import flexible from 'amfe-flexible'
import App from "./App.vue";
import router from "./router";
import { Lazyload } from "vant";

// import FastClick from "fastclick";
import FastClick from "./utils/myfastclick.js";
FastClick.attach(document.body);
import "./utils/resetFastClick.js";
import "./assets/base.css";
const app = createApp(App);
setupStore(app);
app.use(Lazyload);
app.use(router);
app.use(Toast);

app.mount("#app");
