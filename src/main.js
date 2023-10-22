import './assets/main.css'
import 'amfe-flexible/index.js'
import 'vant/es/toast/style'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Toast } from 'vant'
// import flexible from 'amfe-flexible'
import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'
import FastClick from 'fastclick'

FastClick(document.body)
import './utils/resetFastClick.js'
const app = createApp(App)
app.use(Lazyload)
app.use(createPinia())
app.use(router)
app.use(Toast)
app.mount('#app')
