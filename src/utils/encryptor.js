const cryptoJSON = require('crypto-json')
const objectPath = require("object-path");

export default class Encryptor {

  async decryptParts(data, secret){
    return new Promise(async (resolve, reject) => {
      let pathres = this.findPaths(data, 'encr')
      //console.log('PATHRES', pathres, data)
      await pathres.map(async(el) =>{
        let encrStatus = this.getEncryptionStatus(data, el)
        if (encrStatus == true){
          let content = this.getContent(data, el)
          try{
            let decrData = await this.decrypt( content, secret)
            data = this.replaceContent(data, el, decrData)
            data = this.setEncryptionStatus(data, el, false)
          } catch(e){
      
            let placeholder = this.getPlaceholder(data, el)
            data = this.replaceContent(data, el, placeholder)
          }
        }
      })
      
      resolve(data)
    })
  }
    
  async encryptParts(content, secret){
    return new Promise(async (resolve, reject) => {
      try{

        let pathres = await this.findPaths(content, 'encr')

        await pathres.map(async (el) => {
          let part = await this.getContent(content, el)
          part = await this.encrypt(part, secret)
          content = await this.replaceContent(content, el, part)
          content = await this.setEncryptionStatus(content, el, true)
        })
        resolve(content)
      } catch(e){
        reject(e)
      }
    })
  }

  async encrypt(data, secret) {
    return new Promise(async (resolve, reject) => {
      const algorithm = 'aes256'
      const encoding = 'hex'
      try{
        if (typeof data === 'object'){
          
          const encrypted = await cryptoJSON.encrypt(data, secret, {encoding: encoding, keys: [], algorithm: algorithm})
          resolve(encrypted)    
        } else{
          const encrypted = await cryptoJSON.encrypt({temp: data}, secret, {encoding: encoding, keys: [], algorithm: algorithm})
          resolve(encrypted.temp)
        }
      } catch(e){
        reject(e)
      }
    })
  }

  async decrypt(data, secret) {
    return new Promise(async (resolve, reject) => {
      const algorithm = 'aes256'
      const encoding = 'hex'
      try{
        if (typeof data === 'object'){
          const decrypted = await cryptoJSON.decrypt(data, secret, {encoding: encoding, keys: [], algorithm: algorithm})
          resolve(decrypted)    
        } else {
          const decrypted = await cryptoJSON.decrypt({temp: data}, secret, {encoding: encoding, keys: [], algorithm: algorithm})
          resolve(decrypted.temp)
        }
      } catch(e){
        reject(e)
      }
    })
  }

  findPaths ( obj, searchValue, { searchKeys = typeof searchValue === "string", maxDepth = 20 } = {}) {
    const paths = []
    const notObject = typeof searchValue !== "object"
    const gvpio = (obj, maxDepth, prefix) => {
      if (!maxDepth) return
      for (const [curr, currElem] of Object.entries(obj)) {
        if (searchKeys && curr === searchValue) {
          // To search for property name too ...
          paths.push(prefix + curr)
        }

        if (typeof currElem === "object") {
          // object is "object" and "array" is also in the eyes of "typeof"
          // search again :D
          gvpio(currElem, maxDepth - 1, prefix + curr + ".")
          if (notObject) continue
        }
        // it's something else... probably the value we are looking for
        // compares with "searchValue"
        if (currElem === searchValue) {
          // return index AND/OR property name
          paths.push(prefix + curr)
        }
      }
    }
    gvpio(obj, maxDepth, "")
    return paths
  }

  deepFind(obj, path) {
    var paths = path.split('.')
      , current = obj
      , i;

    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }

  replaceHash(obj, path, hash){
    let path_to_hash = path.split('.type');
    objectPath.set(obj, path_to_hash[0]+'.attrs.hash', hash)
    objectPath.set(obj, path_to_hash[0]+'.attrs.encrypted', true)
    return obj;
  }

  getHash(obj, path){
    let path_to_hash = path.split('.type');
    let hash = this.deepFind(obj, path_to_hash[0])
    return hash.attrs.hash
  }

  replaceContent(obj, path, content){
    let path_to_content = path.split('.marks');
    objectPath.set(obj, path_to_content[0] + '.text', content);
    return obj
  }

  setEncryptionStatus(obj, path, status){
    let path_to_attrs = path.split('.type');
    objectPath.set(obj, path_to_attrs[0]+'.attrs.encrypted', status)
    return obj
  }

  getEncryptionStatus(obj, path){
    let path_to_status = path.split('.type');
    let marks = this.deepFind(obj, path_to_status[0])
    return marks.attrs.encrypted
  }

  getPlaceholder(obj, path){
    let path_to_status = path.split('.type');
    let marks = this.deepFind(obj, path_to_status[0])
    return marks.attrs.placeholder 
  }

  getContent(obj, path){
    let path_to_content = path.split('.marks');
    let content = this.deepFind(obj, path_to_content[0])
    return content.text
  }
}
