import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import { url } from '@/global/index'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

axios.defaults.baseURL =url;
app.mount('#app')
