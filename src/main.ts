import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {create as createNaiveUI} from 'naive-ui'
import { LogoAppleAppstore } from '@vicons/ionicons5'

const app = createApp(App)
// const naive = createNaiveUI()
app.use(router)
// app.use(naive)
app.mount('#app')
