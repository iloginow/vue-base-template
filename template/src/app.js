/* =====================================
                  MODULES
   ===================================== */

/* -------------- Installed ------------ */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueProgressBar from 'vue-progressbar'
import { sync } from 'vuex-router-sync'

/* ---------------- Local -------------- */

import routes from './routes'
import storeModule from './store'
import App from './components/App'
import progressBarSettings from './styles/progressbar'

/* ===================================== */

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueProgressBar, progressBarSettings)

function createRouter () {
  return new VueRouter(routes)
}

function createStore () {
  return new Vuex.Store(storeModule)
}

export function createApp () {
  const store = createStore()
  const router = createRouter()

  sync(store, router)

  const app = new Vue({
    store,
    router,
    render: h => h(App)
  })

  return { app, router, store }
}
