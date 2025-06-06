import { createApp } from 'vue'
import { createStore } from 'vuex'
import './style.css'
import App from './App.vue'
import { storeConfig, key } from './store'

// Create store
const store = createStore(storeConfig)

// Create app
const app = createApp(App)

// Use store with key
app.use(store, key)

// Mount app
app.mount('#app')