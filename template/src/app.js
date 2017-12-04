/* =====================================
                  MODULES
   ===================================== */

/* -------------- Installed ------------ */

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueProgressBar from 'vue-progressbar'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'

/* ---------------- Local -------------- */

import routes from './routes'
import storeModule from './store'
import App from './components/App'
import progressBarSettings from './styles/progressbar'

/* ===================================== */

Vue.use(VueRouter)
Vue.use(VueProgressBar, progressBarSettings)
Vue.use(Vuex)

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

  console.log(app)
  return { app, router, store }
}
