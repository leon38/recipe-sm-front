import { createApp } from 'vue'

import App from './App.vue'

import router from './router/Router'

import { createPinia } from 'pinia'

import './assets/style.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')