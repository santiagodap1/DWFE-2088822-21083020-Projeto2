import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/index.css'
import { createPinia } from 'pinia'

import '@fortawesome/fontawesome-free/css/all.css';

const pinia = createPinia();

createApp(App).use(store).use(pinia).use(router).mount('#app')
