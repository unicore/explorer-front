import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import config from '@/config/index'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  // mode: "hash",
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

export default function ({ store }) {
  const Router = createRouter()

  Router.beforeEach((to, from, next) => {
    store.dispatch('main/setLoader', { status: false }, { root: false })
    next()    
  })

  return Router
}
