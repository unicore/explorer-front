import { Scatter } from 'ual-scatter'
import { Local } from 'ual-local'
import { PrivateKey } from 'eosjs-ecc'
import config from '../../config'
import { getlowdb } from '../../utils/lowdb'
const bip39 = require('bip39')
const wifr = require('wif')
let ecc = require('eosjs-ecc')
const hdkey = require('hdkey')
            
export function init ({ commit, state, dispatch, rootState }) {
  if (state.authMethod === 'wif') { return dispatch('authorization', { blockchain: config.ual.rootChain, method: 'wif', wif: state.wif, username: state.username }) }
  if (state.authMethod === 'scatter') { return dispatch('authorization', { blockchain: config.ual.rootChain, method: 'scatter' }) }
}

export async function convertWifToPublic ({ rootState, commit }, { wif }) {

  return new Promise((resolve, reject) =>{

    if (!ecc.isValidPrivate(wif)){
      if (!bip39.validateMnemonic(wif)){
        
        reject('not valid key0')
      } else {
        const mnemonic = wif
        
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
        const master = hdkey.fromMasterSeed(Buffer(seed, 'hex'))
        const node = master.derive("m/44'/194'/0'/0/0")
        
        resolve(ecc.PublicKey(node._publicKey).toString())
        
      }
    } else {
      let pubkey = PrivateKey.fromString(wif).toPublic().toString()
      resolve(pubkey)
    }
  })


}

export function setUsername({commit}, {username}){
  commit('setUsername', username)
}


export function setRootWif({commit}, {wif}){
  commit('setRootWif', wif)
}


export function setAccountNames ({ commit }, { accountNames }) {
  commit('setAccountNames', accountNames)
}


export function generateChildKey ( { commit, rootState, dispatch }, { parentWif, childName } ){
  return new Promise((resolve, reject) => {
    var wif = ''
    if (parentWif === ''){
      wif = ecc.randomKey()
    } else{
      wif = ecc.seedPrivate(parentWif + childName)
    }
    let pubkey = ecc.privateToPublic(wif)
    resolve({wif: wif, pubkey: pubkey})
  })
}

export async function getKeyByPermName({ state, rootState, dispatch }, { perm_name }){
  return new Promise((resolve, reject) => {
    dispatch('account/fetchUserAccount', {username: '1.tc'}, { root: true }).then(account => {
      let posting_auth = account.permissions.filter(perm => perm.perm_name === perm_name)
      
      if (posting_auth.length > 0) {
        let key = posting_auth[0].required_auth.keys[0].key
        resolve(key)
      } else {
        resolve('')
      }
    }).catch(e => reject(e))
  })
}



export async function push_new_name( {commit, state, rootState, dispatch, getters }, {name} ) {
  commit('push_new_name', name)
}


export async function getWifByPermName( {state, rootState, dispatch, getters }, {perm_name} ) {
  return getters.getWif
}

export async function generateKeys( {state, rootState, dispatch, getters }) {
  const hdkey = require('hdkey')
  const wif = require('wif')
  const ecc = require('eosjs-ecc')
  const bip39 = require('bip39')
  const mnemonic = bip39.generateMnemonic()
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
  const master = hdkey.fromMasterSeed(Buffer(seed, 'hex'))
  const node = master.derive("m/44'/194'/0'/0/0")
  
  var res = {}

  res.activepubkey = ecc.PublicKey(node._publicKey).toString()
  res.mnemonic = mnemonic
  res.ownerpubkey = res.activepubkey
  

  return res
}


      
      

export async function registerAccount ({ commit, state, dispatch, rootState }, { activepubkey, ownerpubkey, newusername }) {
  return new Promise((resolve, reject) => {
    dispatch('auth/init', {}, {root: true}).then(eos=> {

    eos.api.transact({ 
        actions: [{
          account: "eosio",
          name: 'newaccount',
          authorization: [{
            actor: state.username,
            permission: 'active',
          }],
          data: {
            creator: state.username,
            name: newusername,
            owner: {
              threshold: 1,
              keys: [{
                key: activepubkey,
                weight: 1
              }],
              accounts: [],
              waits: []
            },
            active: {
              threshold: 1,
              keys: [{
                key: ownerpubkey,
                weight: 1
              }],
              accounts: [],
              waits: []
            },
          }
        },
        {
          account: 'eosio',
          name: 'buyrambytes',
          authorization: [{
            actor: state.username,
            permission: 'active',
          }],
          data: {
            payer: state.username,
            receiver: newusername,
            bytes: 32768 / 2,
          },
        },
        {
          account: 'eosio',
          name: 'delegatebw',
          authorization: [{
            actor: state.username,
            permission: 'active',
          }],
          data: {
            from: state.username,
            receiver: newusername,
            stake_net_quantity: '1.0000 ' + config.core_symbol,
            stake_cpu_quantity: '1.0000 ' + config.core_symbol,
            transfer: false,
          }
        }
        ]
      }, {
        
        blocksBehind: 3,
        expireSeconds: 30,

      }).then(res => resolve(res)).catch(e => {reject(e)})
    

    })


  })

}


export async function setNewPubKeyByPermName ({ commit, state, dispatch, rootState }, { pubkey, parent_perm_name, perm_name }) {
  return new Promise((resolve, reject) => {
    dispatch('auth/init', {}, {root: true}).then(ual => {
      
      let auth = {
        "threshold": 1,
        "keys": [{
            "key": pubkey,
            "weight": 1
          }
        ],
        "accounts": [
        ],
        "waits": []
      }
      ual.api.transact({ 
        actions: [{
          account: 'eosio',
          name: 'updateauth',
          authorization: [{
            actor: ual.accountName,
            permission: 'active',
          }],
          data: {
            account: ual.accountName,
            permission: perm_name,
            parent: parent_perm_name,
            auth: auth,
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then(res => resolve(res)).catch(e => reject(e))
    })
  })
}

export async function authorization ({ app, rootState, commit, state, dispatch }, { blockchain, method, username, wif }) {
  return new Promise(async (resolve, reject) => {
    try {

      const myChain = rootState.blockchain.chains.find(chain => chain.name === blockchain)
      const isRootChain = config.ual.rootChain === myChain.name
      
      if (method === 'wif') {
        
        if (!ecc.isValidPrivate(wif)){
          if (!bip39.validateMnemonic(wif)){
            reject('not valid key')
          } else{
            const mnemonic = wif
            const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
            const master = hdkey.fromMasterSeed(Buffer(seed, 'hex'))
            const node = master.derive("m/44'/194'/0'/0/0")
            
            wif = wifr.encode(128, node._privateKey, false)
            
          }
        } 


        const wifSigner = new Local([myChain], { appName: config.appName })
        wifSigner.login(wif, username).then(arrayOfUsers => {
          if (arrayOfUsers[0]) {
            if (isRootChain) {
              commit('setUsername', username)
              commit('setAuthStatus', true)
              commit('setAuthMethod', 'wif')
              commit('setLoggedInBlockchain', myChain.name)
              commit('setRootWif', wif)
              commit('showReg', false)
              
              
            } else {
              if (!state.wif) reject(new Error('not possible to login with second chain until login with root chain'))
              const db = getlowdb('localStorage', 'ual', state.wif)
              let exist = db.get('auths').find({ username: username, method: method, wif: wif }).value()
              if (!exist) {
                db.defaults({ auths: [] }).value()
                db.get('auths').push({ username: username, blockchain: blockchain, method: method, wif: wif }).write()
              }
            }
            resolve(arrayOfUsers[0])
          }
        }).catch(e => {console.error(e); reject(e)})
      } else if (method === 'scatter') {
        const scatter = new Scatter([myChain], { appName: config.appName })
        scatter.init().then(() => {
          if (!scatter.initError) {
            scatter.login().then(arrayOfUsers => {
              commit('setUsername', arrayOfUsers[0].accountName)
              commit('setAuthStatus', true)
              commit('setAuthMethod', 'scatter')
              commit('setLoggedInBlockchain', myChain.name)
              resolve(arrayOfUsers[0])
            }).catch(e => reject(e))
          } else {
            reject(scatter.initError)
          }
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function logout ({ dispatch, state, commit }) {
  if (state.authMethod === 'scatter') {
    dispatch('init').then(user => {
      user.scatter.logout()
      dispatch('logoutCommits')
      dispatch('main/rightDrawer', {status: false}, {root: true})
    })
  } else if (state.authMethod === 'wif') {
    dispatch('logoutCommits')
    dispatch('main/rightDrawer', {status: false}, {root: true})
  }
}

export async function getConditions({commit, dispatch}, {hostname}){
  var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  api.getTableRows(true, config.core, hostname, 'conditions', 'id', 0, -1, 1000).
        then(data=>{
          commit('setConditions', data.rows)
  });  
}

//TODO check lower_bound
export async function getExtendedPartner({commit, dispatch, rootState}, {hostname}){
  var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  api.getTableRows(true, config.core, hostname, 'corepartners', 'id', 0, -1, 10000).
        then(data=>{
          commit('setPartners', data.rows)
  });  
  
}


export async function getGuestStatus({commit, dispatch}, {guest}){
  return new Promise(async (resolve, reject) => {
    
    var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows({json: true, code: config.reg, scope: config.reg, table: 'guests', lower_bound: guest, upper_bound: guest, limit: 1}).
          then(data=>{

            let isGuest = false
            let guestObject = {}

            if (data.rows.length > 0){
              if (data.rows[0].username == guest)
                isGuest = true
                guestObject = data.rows[0]
            }
            
            commit('setIsGuestStatus', isGuest)
            commit('setGuest', guestObject)
            
            resolve(isGuest)
          });  
  })
}


export async function getPartnerStatus({commit, dispatch, state, rootState}, {hostname, partner}){
  return new Promise(async (resolve, reject) => {


  if (!partner){
    commit('setPartner', {})
    commit('setIsPartner', false)
    resolve(false)
  } else {
    var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
    
    dispatch('host/get_conditions', {hostname: hostname}, {root: true}).then(res => {


      api.getTableRows({json: true, code: config.core, scope: hostname, table: 'corepartners', lower_bound: partner, upper_bound: partner, limit: 1}).
          then(data=>{

            var isPartner = false

            if (partner == hostname){
              isPartner = true
            } else {
              let minburn_condition = rootState.host.conditions.find(el => el.key_string == "minburn")
              let minburn = minburn_condition ? minburn_condition.value : 0

              if (minburn == 0) {

                isPartner = !state.isGuest 

              } else if (data.rows.length > 0){
                  if (data.rows[0].partner == partner) {
                    
                    //check expiration
                    let expiration = new Date(data.rows[0].partner['expiration']);
                    let blockchain_date = new Date(rootState.blockchain.bcinfo.head_block_time)
                    let diff = (expiration - blockchain_date) / 1000 
                    if (diff < 0)
                      isPartner = false
                    else isPartner = true
                }
              }
              
            }
            
          
            let partner_data = data.rows[0] || {}
            partner_data.hostname = hostname
            partner_data.isPartner = isPartner
            // console.log("fetch_partner", data, partner_data, isPartner)

            commit('setPartner', partner_data)
            commit('setIsPartner', isPartner)

            resolve(isPartner)
          });  

      })          

      }

  })
}

export function showDialog({commit}, {status}){
  commit('showDialog', status)
}

export function setCommunity({commit}, {community}){
  commit('setCommunity', community)
}

export function toogleDialog({commit}){
  commit('toogleDialog', status)
}

export function showReg({commit},{status}){
  commit('showReg', status)
}

export function logoutCommits ({ commit }) {
  commit('setRootWif', undefined)
  commit('setUsername', undefined)
  commit('setAuthStatus', false)
  commit('setAutoLogin', false)
  commit('setAuthMethod', undefined)
  commit('setAccountNames', [])
  commit('setLoggedInBlockchain', false)
}
