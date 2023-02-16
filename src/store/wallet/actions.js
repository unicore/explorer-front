import config from '@/config/index'

export function setWallet ({ commit }, { wallet }) {
  commit('setWallet', wallet)
}

export function setUsername ({ commit }, { username }) {
  commit('setUsername', username)
}

export function showPartnerButton ({ commit }, { status }) {
  commit('showPartnerButton', status)
}


export async function fetchBalances ({ rootState, dispatch, state, commit }, { username }) {
  console.log("fetchBalances", username)
  commit('setUsername', username)
  state.wallets.forEach(wallet => {
    dispatch('blockchain/getAPI', { blockchain: wallet.blockchain }, { root: true }).then(api => {
      api.getCurrencyBalance(wallet.contract, username, wallet.symbol)
        .then(res => {
          commit('setWalletBalance', { name: wallet.blockchain, contract: wallet.contract, symbol: wallet.symbol, balance: res[0] ? res[0] : '0.0000 ' + wallet.symbol }) 
        })
    })
  })
}

export async function fetchCurrentBalance ({ rootState, dispatch, state, commit }, { username, contract, symbol }) {
  console.log("fetchCurrentBalance", username)
  commit('setUsername', username)
  dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
    api.getCurrencyBalance(contract, username, symbol)
      .then(res => {commit('setWalletBalance', { name: config.ual.rootChain, contract: contract, symbol: symbol, balance: res[0] ? res[0] : '0.0000 ' + symbol }) })
  })

}

export async function fetchPrecision ({ dispatch }, { blockchain, contract, symbol }) {
  return new Promise((resolve, reject) => {
    dispatch('blockchain/getAPI', { blockchain: blockchain }, { root: true }).then(api => {
      api.getCurrencyStats(contract, symbol).then(stats => {
        const [amountString] = stats[symbol].supply.split(' ')
        const [, precisionString] = amountString.split('.')
        const precision = precisionString.length
        resolve(precision)
      }).catch(e => {
        reject(e)
      })
    })
  })
}

export async function getPrecisionMask ({ dispatch }, { blockchain, contract, symbol }) {
  return new Promise((resolve, reject) => {
    dispatch('blockchain/getAPI', { blockchain: blockchain }, { root: true }).then(api => {
      api.getCurrencyStats(contract, symbol).then(stats => {
        const [amountString] = stats[symbol].supply.split(' ')
        const [, precisionString] = amountString.split('.')
        const precision = precisionString.length
        var mask = '#.'
        for (var i = 0; i < precision; i++) {
          mask = mask + '#'
        }
        resolve(mask)
      }).catch(e => {
        reject(e)
      })
    })
  })
}

export async function transfer ({ dispatch, state }, { blockchain, contract, from, to, quantity, memo }) {
  return new Promise((resolve, reject) => {
    dispatch('auth/init', { }, { root: true }).then(eos => {
      var transferTrx = {
        actions: [{
          account: contract,
          name: 'transfer',
          authorization: [{
            actor: from,
            permission: 'active'
          }],
          data: {
            from: from, // use account that was logged in
            to: to,
            quantity: quantity,
            memo: memo
          }
        }]
      }

      eos.api.transact(transferTrx, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then(res => { resolve(res) }).catch(e => { reject(e) })
    }).catch(e => reject(e))
  })
}

export async function fetchMyDataOrders({ dispatch, state }, {username, blockchain, core}){
  return new Promise((resolve, reject) => {
    dispatch('blockchain/getAPI', { blockchain:  blockchain}, { root: true }).then(api => {
     
      api.getTableRows(true, core, username, 'mydataordrs', 'id', 0, -1, 1000).then(mydataordrs => resolve(mydataordrs)).catch(e => reject(e))

    })
  
  })
}


export async function fetchMyData({ dispatch, state }, {username, blockchain, core}){
  return new Promise((resolve, reject) => {
    dispatch('blockchain/getAPI', { blockchain:  blockchain}, { root: true }).then(api => {
     
      api.getTableRows(true, core, username, 'orbdata', 'id', 0, -1, 1000).then(orbdata => resolve(orbdata)).catch(e => reject(e))

    })
  
  })
}


export async function selldata ({ dispatch, state }, { username, id, data, root_token_contract, amount, core }) {
  return new Promise((resolve, reject) => {
    dispatch('auth/init', { }, { root: true }).then(result => {
      const api = result.api
      let trx = { 
        actions: [{
          account: core,
          name: 'selldata',
          authorization: [{
            actor: username,
            permission: 'active'
          }],
        data: {
            username: username, // use account that was logged in
            id: id,
            data: data,
            root_token_contract: root_token_contract,
            amount: amount
          }
        }]
      }
      
      api.transact(trx, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then(res => {resolve(res)}).catch(e => reject(e))
    }).catch(e => reject(e))
  })
}