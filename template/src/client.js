/* =====================================
                  MODULES
   ===================================== */

/* -------------- Installed ------------ */

import Vue from 'vue'
import ES6Promise from 'es6-promise'

/* ---------------- Named -------------- */

import { createApp } from './app'

/* ===================================== */

ES6Promise.polyfill()

/* =====================================
               ASYNC DATA
   ===================================== */

Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

/* =====================================
         SERVER-INITIALIZED STATE
   ===================================== */

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

/* =====================================
                  ROUTER
   ===================================== */

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }
  })
  // Mount the app
  app.$mount('#app')
})

/* =====================================
              SERVICE WORKER
   ===================================== */

if (location.protocol === 'https:' && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}
