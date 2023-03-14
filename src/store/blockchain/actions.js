import EosApi from 'eosjs-api'
import config from '@/config/index'

export async function setChain ({ state, dispatch, commit }, { chain }) {
  const rpcEndpoint = chain.rpcEndpoints[0]
  const rpcEndpointString = `${rpcEndpoint.protocol}://${rpcEndpoint.host}:${rpcEndpoint.port}`
  console.log("rpcEndpointString: ", rpcEndpointString)
  chain.api = EosApi({ httpEndpoint: rpcEndpointString })
  commit('setAPI', chain)
  return chain.api.getInfo({})
}

export function getAPI ({ state }, { blockchain }) {
  const chain = state.chains.find(chain => chain.name === blockchain)
  return chain.api
}

export function fetchAccountsByKey ({ state, dispatch, commit }, { blockchain, pkey }) {
  return new Promise(async (resolve, reject) => {
    dispatch('getAPI', { blockchain: blockchain }).then(api => {
      api.getKeyAccounts(pkey).then(accounts => {
        
        resolve(accounts.account_names)
      })
    }).catch(e => reject(e))
  })
}


export function fetchAccount ({ state, dispatch, commit }, { blockchain, username }) {
  return new Promise(async (resolve, reject) => {
    dispatch('getAPI', { blockchain: blockchain }).then(api => {
      api.getAccount(username).then(account => {
        
        resolve(account)
      }).catch(e => resolve(false))
    }).catch(e => resolve(false))
  })
}

  export async function get_rammarket ({state, commit, dispatch}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        api.getTableRows(true, "eosio", "eosio", 'rammarket', 'id', 0, -1, 1000).
          then(rammarket=>{
            let market = rammarket.rows[0]
            let price1 = (parseFloat(market.quote.balance))
            let price2 = (parseFloat(market.base.balance))

            market.price = (price1 / price2 * 1024 ).toFixed(4) + ' ' + config.core_symbol + '/' + 'KB'

            

            
            commit('setrammarket', market)
            resolve()
          
        }).catch(e => {reject("Connection is lost")});
    }) 
  } 



  export async function get_producers ({state, commit, dispatch}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        api.getTableRows(true, "eosio", "eosio", 'producers', 'owner', 0, -1, 1000).
          then(producers=>{
            producers.rows.map(producer => {
              try {
              
                producer.url = JSON.parse(producer.url)
              
              }catch(e){

              }

            })
            
            commit('setproducers', producers.rows)
            resolve()
          
        }).catch(e => {reject("Connection is lost")});
    }) 
  } 



  export async function get_info ({state, commit, dispatch}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getInfo({}).then(data=> {
        commit('set_info', data)
        dispatch("get_rammarket")
        dispatch('get_producers')
        resolve(data)
        
      }).catch(e => {reject("Connection is lost")});
    }) 
  } 


  export async function get_sinfo ({state, commit, dispatch}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getInfo({}).then(data=> {
        commit('set_info', data)
        resolve(data)
        
      }).catch(e => {reject("Connection is lost")});
    }) 
  } 



//  TODO need to be deleted nahui
export async function setActiveChain ({ state, dispatch, commit }, { name }) {
  commit('setActiveChain', name)
  const rpcEndpoint = state.activeChain.rpcEndpoints[0]
  const rpcEndpointString = `${rpcEndpoint.protocol}://${rpcEndpoint.host}:${rpcEndpoint.port}`
  const eosapi = await new EosApi({ httpEndpoint: rpcEndpointString })
  commit('setRPC', eosapi)
  return eosapi
}




