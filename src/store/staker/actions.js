import config from '@/config/index'

export async function  fetch_staker ({state, commit, dispatch}, {username}) {
  dispatch('fetch_plans')
  dispatch('fetch_limits')

  if (username)
    dispatch('fetch_sos', {username: username})
  
}

export async function  fetch_plans ({state, commit, dispatch}) {
  return new Promise(async (resolve, reject) => {
    var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

      api.getTableRows({json: true, code: config.staker, scope: config.staker, table: 'plans'}).
    
          then(data=>{
            commit('set_plans', data.rows) 
            resolve()            
    }).catch(e => reject(e));      
  })

}


export async function  fetch_limits ({state, commit, dispatch}) {
  return new Promise(async (resolve, reject) => {
    var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

      api.getTableRows({json: true, code: config.staker, scope: config.staker, table: 'limits'}).
    
          then(data=>{
            commit('set_limits', data.rows) 
            resolve()            
    }).catch(e => reject(e));      
  })

}


export async function  fetch_sos ({state, commit, dispatch}, {username}) {
  return new Promise(async (resolve, reject) => {
    var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

      api.getTableRows({json: true, code: config.staker, scope: username, table: 'stakeobjects', limit: 10000}).
    
          then(data=>{
            commit('set_sos', data.rows) 
            resolve()            
    }).catch(e => reject(e));      
  })

}



export async function stake({commit, state, dispatch}, {contract, stake}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {

          eos.api.transact({ 
              actions: [
              {
                account: contract,
                name: "transfer",
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: stake,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}



export async function refresh({commit, state, dispatch}, {username, id}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.staker,
                name: "refresh",
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: {
                  staker: username,
                  stake_id: id
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}



export async function withdraw({commit, state, dispatch}, {username, id}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.staker,
                name: "withdraw",
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: {
                  staker: username,
                  stake_id: id
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}


