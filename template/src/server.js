/* =====================================
                  MODULES
   ===================================== */

/* ---------------- Local -------------- */

import { createApp } from './app'

/* ===================================== */

/* -------- Create a custom error -------- */

class RoutingError extends Error {
  constructor (code = 500, url, message = 'Internal Server Error', ...params) {
    super(message, ...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoutingError)
    }
    this.code = code
    this.url = url
  }
}

/* =====================================
     WILL BE CALLED BY BUNDLE RENDERER
   ===================================== */

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject(new RoutingError(302, fullPath, ''))
    }

    /* =====================================
                      ROUTER
       ===================================== */

    router.push(url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new RoutingError(404, fullPath, 'Page Not Found'))
      }
      Promise.all(matchedComponents.map(({ asyncData }) => {
        if (asyncData) {
          return asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
