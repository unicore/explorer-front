import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
const Cryptr = require('cryptr')

export function getlowdb (type, name, secret) {
  const cryptr = new Cryptr(secret)
  let adapter = null
  if (type === 'localStorage') {
    adapter = new LocalStorage(name, {
      deserialize: (str) => {
        try {
          const decrypted = cryptr.decrypt(str)
          const obj = JSON.parse(decrypted)
          return obj
        } catch (e) {
          return {}
        }
      },
      serialize: (obj) => {
        const str = JSON.stringify(obj)
        const encrypted = cryptr.encrypt(str)
        return encrypted
      }
    })
  }
  const db = low(adapter)
  return db
}
