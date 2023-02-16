const cryptoJSON = require('crypto-json')
import { encrypt, decrypt } from 'eos-encrypt';

import config from '@/config/index'

export async function setEncryptionKey ({ commit, state, dispatch }, {key}) {
  commit('setEncryptionKey', key)
}

export function encryptData({state}, { data, secret }) {
  return new Promise((resolve, reject) => {
    if (typeof data === 'object'){
      const encrypted = cryptoJSON.encrypt(data, secret)
      resolve(encrypted)    
    } else{
      const encrypted = cryptoJSON.encrypt({temp: data}, secret)
      resolve(encrypted.temp)
    }
  })
}

export function decryptData({state}, { data, secret }) {
  return new Promise((resolve, reject) => {
    if (typeof data === 'object'){
      const decrypted = cryptoJSON.decrypt(data, secret)
      resolve(decrypted)    
    } else {
      const decrypted = cryptoJSON.decrypt({temp: data}, secret)
      resolve(decrypted.temp)
    }
  })
}



export async function encrypt_private_message({commit, state, dispatch, rootState}, {wif, to, message}){
    return new Promise((resolve, reject) => {
       
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getAccount(to).then(res => {
          
          let pactivekey = res.permissions.find(el => el.perm_name == "active")
          let pkey = pactivekey.required_auth.keys[0].key
          let encryptedMessage = encrypt(wif, pkey, message, {maxsize: 10000})
          let decryptedMessage = decrypt(wif, pkey, encryptedMessage)
          
          resolve(encryptedMessage)
        })

        // api.getTableRows({json: true, code: config.core, scope: username, table: 'hosts', limit: 1000}).
        //   then(hosts=>{
            
        //     resolve()
        //   }).catch(e => {
        //     reject(e)
        //   })
        }).catch(e => reject(e))

    })
}


export async function decrypt_private_message({commit, state, dispatch, rootState}, {wif, from, message}){
    return new Promise((resolve, reject) => {
       
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getAccount(from).then(res => {
          
        let pactivekey, pkey, decryptedMessage
        
        
        try {
          pactivekey = res.permissions.find(el => el.perm_name == "gateway")
          pkey = pactivekey.required_auth.keys[0].key
          decryptedMessage = decrypt(wif, pkey, message)  
          
          resolve(decryptedMessage)
          
        } catch(e) {

          try {
            
            pactivekey = res.permissions.find(el => el.perm_name == "active")
            pkey = pactivekey.required_auth.keys[0].key
            decryptedMessage = decrypt(wif, pkey, message)  
            resolve(decryptedMessage)

          } catch(e) {

            reject(e)

          }
        }
          
        })

        // api.getTableRows({json: true, code: config.core, scope: username, table: 'hosts', limit: 1000}).
        //   then(hosts=>{
            
        //     resolve()
        //   }).catch(e => {
        //     reject(e)
        //   })
        }).catch(e => reject(e))

    })
}



  


