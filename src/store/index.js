import Vue from 'vue'
import Vuex from 'vuex'
// import auth from './auth'
import main from './main'
// import account from './account'
// import wallet from './wallet'
import blockchain from './blockchain'
// import editor from './editor'
// import encryptor from './encryptor'
// import cicerone from './cicerone'
// import posts from './posts'
// import host from './host'
// import registrator from './registrator'
// import feed from './feed'
// import staker from './staker'
// import nft from './nft'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      blockchain,
      main
    },
    // plugins: [createPersistedState()],
    // plugins: [createPersistedState({ paths: ['auth', 'registrator'] })],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
