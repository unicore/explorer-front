export function setUser ({commit, dispatch}, {username, email, referer, activepubkey, ownerpubkey, activeprivkey, ownerprivkey, mnemonic}) {
  commit('setUsername', username)
  commit('setEmail', email)
  commit('setReferer', referer)
  commit('setActivePubKey', activepubkey)
  commit('setOwnerPubKey', ownerpubkey)
  commit('setActivePrivKey', activeprivkey)
  commit('setOwnerPrivKey', ownerprivkey)
  commit('setEmailStatus', false)
  commit('setMnemonic', mnemonic)

  dispatch('auth/setUsername', {username: username}, {root: true})
  dispatch('auth/setRootWif', {wif: activeprivkey}, {root: true})


}

export function clear({commit, dispatch}){
  commit('setUsername', null)
  commit('setEmail', null)
  // commit('setReferer', null)
  commit('setActivePubKey', null)
  commit('setOwnerPubKey', null)
  commit('setActivePrivKey', null)
  commit('setOwnerPrivKey', null) 
  commit('setEmailStatus', false)
  commit('setMnemonic', null)
  commit('setAccountToPay', 0)
  commit('setAccountType', null)
  

  dispatch('auth/showDialog', {status: false}, {root: true})
  dispatch('auth/showReg', {status: false}, {root: true})
  commit('setStep', 0)
}

export function setReferer({commit, dispatch}, {referer, blockchain}){
  return new Promise((resolve, reject ) => {
    dispatch('blockchain/getAPI', { blockchain: blockchain }, { root: true }).then(api => {
        api.getAccount(referer).then(account => {
          if (account){
            commit('setReferer', referer)  
            resolve(true)      
          } else {
            resolve(false)
          }
          
        }).catch(e => {console.error('there is no referer') ; resolve(false)})
      })
  })

  
}

export function setAccountType({commit}, {accountType}){
  commit('setAccountType', accountType)
}

export function setAccountToPay({commit}, {AccountToPay}){
  commit('setAccountToPay', AccountToPay)
}

export function setEmailStatus({commit}, {status}){
  commit('setEmailStatus', status)
}

export function setStep({commit}, {step}){
  commit('setStep', step)
}

export function setLoader({state, commit}, {status}){
  commit('setLoader', status)
}

export function getInvites({commit, state, dispatch}, {username}){
    return new Promise((resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.part, scope: username, table: 'invites'}).
          then(invites=>{
            commit('set_invites', invites.rows)
            resolve(invites.rows)
        }).catch(e => reject(e))
      })  
    })
  }


