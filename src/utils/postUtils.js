import slug from 'slug'
import axios from 'axios'
import golos from 'golos-js'
import { Signature, PrivateKey, hash } from 'golos-js/lib/auth/ecc'

import config from '@/config'


export async function createUniqPermlink(author, title) {
  // Возвращает уникальный пермлинк для поста
  let permlink = slug(title, {lower: true})
  
  // var uuid = require("uuid");
  // var id = uuid.v4();
  
  //let isExists = await golos.api.getContent(author, permlink)

  // if (isExists.id !== 0) {
  //   const timeStr = new Date()
  //     .toISOString()
  //     .replace(/[^a-zA-Z0-9]+/g, "")
  //     .toLowerCase()

  //   permlink = `${permlink}-${timeStr}`
  // }

  return permlink
}


export default postUtils;
