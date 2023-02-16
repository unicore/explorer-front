import {lazy_fetch_all_table_internal} from "@/utils/fetcher"
import config from '@/config/index'

export async function fetchAll({state, commit, dispatch}, {owner}){
  dispatch('getObjectsByOwner', {owner})
  dispatch('getAllObjects')
  dispatch('getMarket')
  dispatch('fetchRequests', {owner: owner})
  
}

export async function getObjectsByOwner({state, commit, dispatch}, {owner}){
  console.log("owner: ", owner)
  let api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  
  // let objects = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'objects', owner, owner, 1000, 2, "i64")
  // console.log("row objects", objects)
  // let objects = []
  
  let pieces = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'pieces', owner, owner, 1000, 2, "i64")
  // console.log("row pieces", pieces)
  
  // for (let piece of pieces) {
  //   let my_object = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'objects', piece.object_id, piece.object_id, 1)
    
  //   my_object = my_object[0]
  //   my_object.my_pieces = piece.pieces

  // }
  console.log("objects", pieces)
  commit('setMyObjects', pieces)

  return pieces
}


export async function getAllObjects({state, commit, dispatch}){
  let api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  
  let objects = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'objects')
  
  for (let obj of objects){
    try{
      obj.images = JSON.parse(obj.images)
    } catch(e){
      obj.images = []
      console.log("e", e)
    }
  }
  console.log("objects", objects)

  commit('setAllObjects', objects)

  return objects
}

export async function getMarket({state, commit, dispatch}){
  let api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  
  let market = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'market', null, null, 1000)
  
  market.map(m => {
    try {
      m.meta = JSON.parse(m.meta)
    } catch(e){}
  })
  commit('setMarket', market)

  return market
}


export async function fetchRequests({state, commit, dispatch}, {username}){
  let api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  
  let as_buyer = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'requests', username, username, 1000, 2, 'i64')
  let as_seller = await lazy_fetch_all_table_internal(api, config.nft, config.nft, 'requests', username, username, 1000, 3, 'i64')

  let requests = [...as_buyer, ...as_seller]

  requests.map(r => {
    try {
      r.delivery_to = JSON.parse(r.delivery_to)
    } catch(e){}
  })
  console.log("requests", requests)
  commit('setRequests', requests)

  return requests
}



export async function createNFT({state, commit, dispatch}, {creator, data}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'create',
          authorization: [{
            actor: creator,
            permission: 'active',
          }],
          data: data,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })

    dispatch('getObjectsByOwner', {owner: creator})  
}



export async function sellNFT({state, commit, dispatch}, {seller, data}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'sell',
          authorization: [{
            actor: seller,
            permission: 'active',
          }],
          data: data,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    dispatch('getMarket')
    dispatch("getObjectsByOwner", {owner: seller})

}


export async function buyNFT({state, commit, dispatch}, {buyer, token_contract, data}){

    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [
        {
          account: token_contract,
          name: 'transfer',
          authorization: [{
            actor: buyer,
            permission: 'active',
          }],
          data: {
            from: buyer,
            to: config.nft,
            quantity: data.total_price,
            memo: ""
          },
        },

        {
          account: config.nft,
          name: 'buy',
          authorization: [{
            actor: buyer,
            permission: 'active',
          }],
          data: data,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })

    dispatch('getAllObjects')
    dispatch('getMarket')
    dispatch("getObjectsByOwner", {owner: buyer})

}




export async function cancelreq({state, commit, dispatch}, {buyer, request_id}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'cancelreq',
          authorization: [{
            actor: buyer,
            permission: 'active',
          }],
          data: {
            buyer: buyer,
            request_id: request_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    
    dispatch('fetchRequests', {username: buyer})
    

}

export async function setdelstatus({state, commit, dispatch}, {delivery_operator, request_id, status}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'setdelstatus',
          authorization: [{
            actor: delivery_operator,
            permission: 'active',
          }],
          data: {
           delivery_operator, 
           request_id, 
           status
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    
    dispatch('fetchRequests', {username: delivery_operator})
    

}



export async function cancelsell({state, commit, dispatch}, {seller, market_id}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'cancelsell',
          authorization: [{
            actor: seller,
            permission: 'active',
          }],
          data: {
            seller: seller,
            market_id: market_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    
    dispatch('getMarket')
    dispatch("getObjectsByOwner", {owner: seller})
    

}


export async function declinereq({state, commit, dispatch}, {seller, request_id}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'declinereq',
          authorization: [{
            actor: seller,
            permission: 'active',
          }],
          data: {
            seller: seller,
            request_id: request_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    
    dispatch('fetchRequests', {username: seller})
    

}



export async function acceptreq({state, commit, dispatch}, {seller, request_id}){
    let eos = await dispatch('auth/init', {}, {root: true})
    await eos.api.transact({ 
        actions: [{
          account: config.nft,
          name: 'acceptreq',
          authorization: [{
            actor: seller,
            permission: 'active',
          }],
          data: {
            seller: seller,
            request_id: request_id
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    
    dispatch('fetchRequests', {username: seller})
    

}
