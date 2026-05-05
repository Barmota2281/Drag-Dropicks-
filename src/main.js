import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import './firebase'

document.addEventListener('contextmenu', event => event.preventDefault());

createApp(App).use(router).mount('#app')
