import { format } from 'quasar'
import config from '@/config/index'

const { humanStorageSize } = format


export async function fetchUserAccount ({ rootState, commit, dispatch }, { username }) {
  return new Promise((resolve, reject) => {
    function msToTime (duration) {
      var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

      hours = (hours < 10) ? '0' + hours : hours
      minutes = (minutes < 10) ? '0' + minutes : minutes
      seconds = (seconds < 10) ? '0' + seconds : seconds

      return hours + 'h:' + minutes + 'm:' + seconds + 's:' + milliseconds + 'ms'
    }

    function convert(time) {
      let ts = time / 1000
      
      if (ts >= 1000000000)
      
        return (ts / 1000000000).toFixed(3) + ' Gs'
      
      else if (ts >= 1000000)
      
        return (ts / 1000000).toFixed(3) + ' Ms'

      else if (ts >= 1000 )

        return (ts / 1000).toFixed(3) + ' Ks'

      else return ts + ' s'

    }

    commit('setUsername', username)
    dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
      api.getAccount(username).then(res => {
        res.cpu_percent = parseFloat((res.cpu_limit.used / res.cpu_limit.available * 100).toFixed(4))
        res.net_percent = parseFloat((res.net_limit.used / res.net_limit.available * 100).toFixed(4))
        res.ram_percent = parseFloat((res.ram_usage / res.ram_quota * 100).toFixed(4))

        
        res.cpu_limit.human_used = msToTime(res.cpu_limit.used)
        res.cpu_limit.human_available = msToTime(res.cpu_limit.available)


        
        res.net_limit.human_used = msToTime(res.net_limit.used)
        res.net_limit.human_available = msToTime(res.net_limit.available)
        

        res.human_ram_usage = humanStorageSize(res.ram_usage)
        res.human_ram_quota = humanStorageSize(res.ram_quota)
        
        res.cpu_limit.human_distance = msToTime(res.cpu_limit.available - res.cpu_limit.used)
        res.net_limit.human_distance = msToTime(res.net_limit.available - res.net_limit.used)
        

        res.cpu_limit.available = convert(res.cpu_limit.available)
        res.net_limit.available = convert(res.net_limit.available)

        res.human_ram_distance = humanStorageSize(res.ram_quota - res.ram_usage)
        res.ram_quota = humanStorageSize(res.ram_quota)
        res.ram_usage = humanStorageSize(res.ram_usage)
        

        res.net_weight = res.net_weight / config.units_precision + ' ' + config.core_symbol

        res.cpu_weight = res.cpu_weight / config.units_precision + ' ' + config.core_symbol


        commit('setUserAccount', res)
        resolve(res)
      })
    }).catch(e => reject(e))
  })

}

  export async function fetch_rstat({commit, state, dispatch}, {hostname, username}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {

        api.getTableRows(true, config.core, username, 'rstat', 'id', 0, -1, 1000).
          then(data=>{
              // if (data.rows[0])
              commit('set_rstat', data.rows)
              resolve(data.rows)
          }).catch(e => reject(e))
        }).catch(e => reject(e))
     })
  }

  export async function fetch_rbalances({commit, state, dispatch}, {hostname, username}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        // api.getTableRows({json: true, code: config.core, scope: username, table: 'refbalances', limit: 1000}).
         // then(rbalances=>{
         
        dispatch('host/lazy_fetch_all_table', { api: api, code: config.core, scope: username, table: 'refbalances'}, { root: true }).then(rbalances => {
            commit('set_refbalances', rbalances)
            dispatch("fetch_rbalances2", {hostname: hostname, username: username})
            dispatch("fetch_usdtwithdraw", {hostname: hostname, username: username})
            
            resolve(rbalances)
          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }


  export async function fetch_rbalances2({commit, state, dispatch}, {hostname, username}){
    return new Promise((resolve, reject) => {
         // export async function lazy_fetch_all_table_internal(api, code, scope, table, lower_bound, limit){
       
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
         dispatch('host/lazy_fetch_all_table', { api: api, code: config.core, scope: username, table: 'refbalances2'}, { root: true }).then(rbalances => {
            console.log("set_refbalances2", rbalances)
            commit('set_refbalances2', rbalances)
            resolve(rbalances)
         }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }


  export async function fetch_usdtwithdraw({commit, state, dispatch}, {hostname, username}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
          dispatch('host/lazy_fetch_all_table', { api: api, code: config.core, scope: hostname, table: 'usdtwithdraw', lower_bound: username, upper_bound: username, index_position: '2', key_type:"i64"}, { root: true }).then(usdtwithdraw => {
        
        // api.getTableRows({json: true, code: config.core, scope: hostname, table: 'usdtwithdraw', limit: 1000, lower_bound: username, upper_bound: username, index_position: '2', key_type:"i64", }).
          // then(usdtwithdraw=>{
            usdtwithdraw.map(el => {
                try{
                  el.comment = JSON.parse(el.comment)
                } catch(e){
                  el.comment = ""
                }
              })
            commit('set_usdtwithdraw', usdtwithdraw)
            resolve(usdtwithdraw)

          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }

  export async function fetch_is_host({commit, state, dispatch}, {username}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.core, scope: username, table: 'hosts', limit: 1000}).
          then(hosts=>{
            // console.log('FETCH IS HOST', hosts)
            commit('set_is_host', hosts.rows[0] || false)
            resolve()
          }).catch(e => {
            commit('set_is_host', false)
            reject(e)
          })
        }).catch(e => reject(e))

    })
  }
