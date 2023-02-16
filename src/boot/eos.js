import config from '../config'
// import { LocalStorage } from 'quasar'
import Vue from 'vue'
Vue.prototype.$config = config
import { Platform } from 'quasar'


export default async ({ app, store, router, urlPath }) => {
  //Platform
  if (Platform.is.mobile)
    store.dispatch('main/setIsMobile', {isMobile: true})
  else 
    store.dispatch('main/setIsMobile', {isMobile: false})
  
  
  config.chains.forEach(chain => {
    store.dispatch('blockchain/setChain', { chain: chain }).then(info => {
      
    }).catch(e => {
      console.error('error on promise', e)
    })
  })
  
}
