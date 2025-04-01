import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css';
import {create as createNaiveUI} from 'naive-ui'
import { LogoAppleAppstore } from '@vicons/ionicons5'

const app = createApp(App)
const pinia = createPinia()
// const naive = createNaiveUI()
app
.use(router)
.use(pinia)
// app.use(naive)
app.mount('#app')
