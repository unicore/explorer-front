import config from '@/config/index'
import ecc from 'eosjs-ecc'
import { date } from 'quasar'
import moment from 'moment'
import axios from 'axios'
const { Serialize } = require(`eosjs`)
const eosjsAccountName = require('eosjs-account-name');

const quants_precision = 1000000;

  
  export async function get_community({state, commit, dispatch, rootState}, {hostname}) {
    return new Promise((resolve, reject) => {
      commit('setActivePrincipal', null)
      commit('clear_tasks')
      commit('clear_goals')
      console.log("get COmmunity", hostname)
      dispatch('get_host', {hostname: hostname})
        
        .then(() => {
          
          console.log("get COmmunity2", hostname)
          dispatch('fetch_ahosts', {hostname: hostname})
          dispatch('fetch_syspercent')
          dispatch('get_orders', {hostname: hostname})
          dispatch('main/setLoader', {status: false}, {root: true})
                
        }).then(() => {
            return
          })
          .then(() => {
            console.log("get COmmunity3", hostname)
            console.log('state.host_obj', state.host_obj)
            if (state.host_obj){
              console.log("get COmmunity4", hostname)
              if (state.host_obj.parameters_setted && state.host_obj.activated) {
                dispatch('get_conditions', {hostname: hostname})
                
                dispatch('get_spiral2', {hostname: hostname})
                console.log("get COmmunity5", hostname)
                
                dispatch('get_spiral', {hostname: hostname})
                  .then(() => dispatch('get_rates', {hostname: hostname}))
                  .then(() => dispatch('get_pools', {hostname: hostname}))
                  .then(() => dispatch('get_cycles', {hostname: hostname}))
                  
                  .then(() => {
                    console.log("get COmmunity9", hostname)
                    dispatch('fetch_host_extended', {hostname: hostname})
                    
                    dispatch('main/setLoader', {status: false}, {root: true})
                    resolve()
                  })

              } else {
                dispatch('main/setLoader', {status: false}, {root: true})
                resolve()
              }
            }
            else {      
              dispatch('main/setLoader', {status: false}, {root: true})
              resolve()
            }
          })

          })
          
      


  }

  export function fetch_user_profile({state, commit, dispatch, rootState}, {hostname, username}){
    
    if (username){ 

      dispatch('account/fetchUserAccount', {username: username}, {root: true})

      dispatch('auth/getGuestStatus', {guest: username}, {root: true})
      dispatch('auth/getPartnerStatus', {partner: username, hostname: hostname}, {root: true})
      dispatch('fetch_partner', {username: username})
      dispatch('account/fetch_is_host', {username: username}, {root: true})

      dispatch('fetch_p2p_vbalances', {username: username})
      dispatch('fetch_pvesting_balances', {username: username})
      dispatch('account/fetch_rbalances', {hostname: hostname, username: username}, {root: true})
      
      dispatch('account/fetch_rstat', {hostname: hostname, username: username}, {root: true})
      // dispatch('auth/getExtendedPartner', {hostname: hostname, partner: rootState.auth.username}, {root: true})
      dispatch('fetch_usbadges',{username: username})
      dispatch('get_marathon_user_status',{username: username, hostname: hostname})

      dispatch('fetch_upower', {username: username, hostname: hostname})
      dispatch('wallet/fetchBalances', {username: username}, {root: true})
      // dispatch('fetch_incoming', {username: hostname})

    }
  }

  export function fetch_host_extended({state, commit, dispatch, rootState}, {hostname}){
    // console.log("ON FETCH HOST EXTENTED")
    dispatch('fetch_market', {hostname: hostname})
    dispatch('fetch_cfund', {hostname: hostname})
    // dispatch('fetch_referals', {hostname: hostname, username: rootState.auth.username})
    dispatch('get_dhistory', {hostname: hostname})
    dispatch('fetch_goals', {hostname: hostname})
    dispatch('fetch_tasks', {hostname: hostname, username: rootState.auth.username})
    dispatch('fetch_doers', {hostname: hostname})
    dispatch('fetch_balances', {hostname: hostname})
    dispatch('fetch_hosts_on_funds', {hostname: hostname})
    dispatch('fetch_gfunds', {hostname: hostname})
    dispatch('fetch_badges', {hostname: hostname})
    dispatch('fetch_dacs', {hostname: hostname})
    dispatch('fetch_sincome', {hostname: hostname})
    
  }

  export function fetch_incoming({commit, state, dispatch}, {username}){
    return new Promise((resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.core, scope: username, table: 'incoming', limit: 10000}).
          then(incoming=>{
            let hosts = []

          incoming.rows.map(inc => {
            let h = hosts.find(el => inc.host == el)
            if (!h)
              hosts.push(inc.host)
          
          })

          commit("set_incoming", incoming.rows)
          
          
          hosts.map(host => {
            // dispatch("fetch_ext_tasks", {hostname: host, username: username})  
          })
          


            resolve(incoming.rows)
        }).catch(e => reject(e))
      })  
    })
  }


  export async function fetch_partner({commit, state, dispatch}, {username}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.part, scope: config.part, table: 'partners2', lower_bound: username, upper_bound: username, limit: 1}).
          then(partner=>{
            let partner_local = partner.rows[0]
            
            if (partner_local){
              try {
                partner_local.meta = JSON.parse(partner_local.meta)

              } catch(e){
                partner_local.meta = {}
              }
            } else {
              partner_local = {meta: {}}
            }

            if (!partner_local.meta.profile){
              partner_local.profile_is_completed = false
              // partner_local.meta.profile = {
              //   ican: "",
              //   ineed: "",
              //   mydream: "",
              // }
            } else partner_local.profile_is_completed = true
            
            commit('set_partner', partner_local)
            resolve(partner_local)
          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }



  export async function fetch_all_partners({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      var i = 100
      
      

       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.part, scope: config.part, table: 'partners2', lower_bound: state.last_partner_id, upper_bound: state.last_partner_id + i, index_position: '3', key_type:"i64", limit: i}).
          then(partners=>{

            partners.rows.map(el => {
              try{
                el.meta = JSON.parse(el.meta)
              } catch(e){

              }

            })
            // console.log("HER@!", partners.rows, state.last_partner_id, i)
            
            if (partners.rows.length > 0)
              commit('set_last_partner_id', state.last_partner_id + partners.rows.length)
            
            commit('set_all_partners', partners.rows)
            resolve(partners.rows)
          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }



  export async function fetch_referals({commit, state, dispatch}, {hostname, username}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.part, scope: config.part, table: 'partners2', lower_bound: username, upper_bound: username, index_position: '2', key_type:"i64", limit: 10000}).
          then(partners=>{

            partners.rows.map(el => {
              try{
                el.meta = JSON.parse(el.meta)
              } catch(e){

              }

            })

            commit('set_referals', partners.rows)
            resolve(partners.rows)
          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }


  export async function getCodeHash({commit, state, dispatch}, {username}){


    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getCodeHash(username).
          then(result=>{
            // commit('set_referals', partners.rows)
            resolve(result)
          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }






  export async function save_percents({commit, state, dispatch}, {hostname, percents}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          var data = {
            host: hostname,
            ref_percent: percents.ref_percent,
            dacs_percent: percents.dacs_percent,
            hfund_percent: percents.hfund_percent,
            cfund_percent: percents.cfund_percent,
          }

          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'setflows',
                authorization: [{
                  actor: hostname,
                  permission: 'active',
                }],
                data: data,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('get_host', {hostname: hostname})

              resolve(res)
            }).catch(e => reject(e))
        })
    })

  }



  export async function save_timing({commit, state, dispatch}, {hostname, pool_timeout, priority_seconds, pool_start}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          var pool_start_at = pool_start.replace(/\s/g, 'T')
          var data = {
            host: hostname,
            pool_timeout: pool_timeout,
            priority_seconds: priority_seconds,
          }

          eos.api.transact({ 
              actions: [
              {
                account: config.core,
                name: 'settiming',
                authorization: [{
                  actor: hostname,
                  permission: 'active',
                }],
                data: data,
              },
              {
                account: config.core,
                name: 'setstartdate',
                authorization: [{
                  actor: hostname,
                  permission: 'active',
                }],
                data: {
                  host: hostname, 
                  start_at: pool_start_at
                },
              }
              ]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('get_spiral', {hostname: hostname})
              
              resolve(res)
            }).catch(e => reject(e))
        })
    })

  }




  export async function reg({commit, state, dispatch}, {username, referer, meta}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          var data = {
                  username: username,
                  referer: referer,
                  // referer: referer == "" ? config.part : referer,
                  meta: meta,
                }
          

          eos.api.transact({ 
              actions: [{
                account: config.part,
                name: 'reg',
                authorization: [{
                  actor: username,
                  permission: 'active',
                }],
                data: data,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              commit('set_partner', data)

              resolve(res)
            }).catch(e => reject(e))
        })
    })

  }


  export async function setCMSContent({commit, state, dispatch}, {hostname, type, lang, content}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {

          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'setcontent',
                authorization: [{
                  actor: hostname,
                  permission: 'active',
                }],
                data: 
                {
                  username: hostname,
                  type: type,
                  lang: lang,
                  content: content,
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => resolve(res)).catch(e => reject(e))
        })
    })

  }

  export function addPowerToWheel({commit, state, dispatch}, data){
    commit("addPowerToWheel", data)
  }


  export function setToStoreCMSContent({commit, state, dispatch}, {content}){
    commit("set_cmscontent", content)
  }

  export function set_partner_meta({commit}, {meta}){
    commit("set_partner_meta", meta)
  }

  export function getCMSContent({commit, state, dispatch}, {hostname}){
    return new Promise((resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        api.getTableRows({json: true, code: config.core, scope: hostname, table: 'cmscontent'}).
          then(cmscontent=>{
              cmscontent.rows.map(el => {
                try{
                  el.content = JSON.parse(el.content) 
                } catch(e){
                }
              })
            
            // console.log("ongetcontent", hostname, cmscontent)
            
            if (hostname == config.core)
              dispatch('main/set_rootcontent', {content: cmscontent.rows}, {root: true})
            else
              commit("set_cmscontent", cmscontent.rows)
            
            resolve(cmscontent.rows)
        }).catch(e => reject(e))
      })  
    })
  }

  export function add_task({state, commit}, {task}){
    commit('add_task', task)
  }

  export function add_report({state, commit}, {report}){
    commit('add_report', report)
  }


  export function set_buy_rate({state, commit}, {buy_rate}){
    commit('set_buy_rate', buy_rate)
  }

  export function set_sell_rate({state, commit}, {sell_rate}){
    commit('set_sell_rate', sell_rate)
  }


  export function set_hostname({state, commit}, hostname) { 
    commit('set_hostname', hostname)
  }

  export function set_username({state,  commit}, username){
    commit('set_username', username)
  }

  export async function fetch_cfund({app, rootState, state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, hostname, 'emission', 'username', 0, -1, 1000).
          then(data=>{
            if (data.rows[0])
              data.rows[0].percent = data.rows[0].percent / 10000 
            commit("set_cfund", data.rows[0])
            resolve()
          }).catch(e => reject(e))

      })
    })
  }



  export async function  fetch_balances ({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        // api.getTableRows({json: true, code: config.core, scope: hostname, table: 'balance', limit: 10000}).
        lazy_fetch_all_table_internal(api, config.core, hostname, 'balance').then(balances => {
            console.log('balances', balances)
            // then(data=>{
              
              balances.map(el => {
                try{
                  el.meta = JSON.parse(el.meta)
                } catch(e){
                  el.meta = {}
                }
              })

              commit('set_balances', balances) 

              resolve()            
      }).catch(e => reject(e));      
    })

  }


  export async function  fetch_reg_balance ({state, commit, dispatch}, {username}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        api.getTableRows({json: true, code: config.reg, scope: config.reg, table: 'balance', lower_bound: username, upper_bound: username, index_position: '1', key_type:"i64"}).
      
            then(data=>{
              commit('set_reg_balance', data.rows[0]) 

              resolve()            
      }).catch(e => reject(e));      
    })

  }

    export async function fetch_badges({state, commit, dispatch}, {hostname}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        api.getTableRows(true, config.core, hostname, 'badges', 'id', 0, -1, 1000).
          then(data=>{
            
            commit('set_badges', data.rows)
            resolve()
        }).catch(e => reject(e))        
      })

    }

    export async function fetch_usbadges({state, commit, dispatch}, {username}){
      
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        const data = await api.getTableRows(true, config.core, username, 'usbadges', 'id', 0, -1, 1000)
         
        commit('set_usbadges', data.rows)
  
    }

    export function add_goal({state, commit}, {goal}){
      
      commit('add_goal', goal)

    }

    export function set_badges({state,commit}, {badges}){
      commit('set_badges', badges)
      
    }

  export async function  fetch_upower({state, commit, dispatch}, {username, hostname}) {
    
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      const data = await lazy_fetch_all_table_internal(api, config.core, hostname, 'power3')
      // api.getTableRows(true, config.core, hostname, 'power3', 'id', 0, -1, 1000)
      
      
      if (data) {
        let up = data.find(el => el.username == username) || {staked: 0, power: 0}
        up.host = hostname
        up.type = 'power'
        // console.log('up', up, username, hostname)
        commit('set_upower', up)
        console.log("UPOWER", up)
        return up
      } else return {staked: 0, power: 0}

  }


  export async function  fetch_doers({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'doers', 'id', 0, -1, 10000).
            then(data=>{
              
              commit('set_doers', data.rows)
              resolve()
      }).catch(e => reject(e));      
    })

  }

    export async function  fetch_goals2({ rootState, dispatch, state, commit }, {hostname}) {
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        api.getTableRows(true, config.core, hostname, 'goals3', 'id', 0, -1, 10000).
        
        then(data=> {
          var goals = JSON.parse(JSON.stringify(state.goals))

          goals.map((goal, index) => {
            let g2 = data.rows.find(el => goal.id == el.id)
            
            if (g2) {
              goals[index]['total_on_distribution'] = g2.total_on_distribution 
              goals[index]['remain_on_distribution'] = g2.remain_on_distribution 
            }

          })
          
          commit('set_goals', goals)
        })
      })
    }

    export async function  fetch_goals({ rootState, dispatch, state, commit }, {hostname}) {
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        api.getTableRows(true, config.core, hostname, 'goals', 'votes', 0, -1, 10000, "i64", 4).
        // api.getTableRows({json: true, code: config.core, scope: config.core, table: 'goals', lower_bound: hostname, upper_bound: hostname, index_position: '2', key_type:"i64"}).
          then(data=>{
            console.log("goals: ", data.rows)
            commit('clear_goals')
            // console.log("ON FETCH GOALS")
            data.rows.sort((a,b) => {
              if (a.total_votes > b.total_votes)
               return 1;
              else return -1
            })
            

            data.rows.map(goal => {
              //TODO replace batch from live
              //  goal.batch.map(b => {
              //   let res = data.rows.find(el => el.id == b)
                
              //   if (res)
              //     netted_goals.push(res)
                
              // })
              goal.type = "goal"
              goal.is_batch = 0
              var netted_goals = []
              
             
              
              netted_goals.sort((a, b) => {
                return a.priority - b.priority
              })
              
              let el = goal.voters.indexOf(rootState.auth.username)
              
              if (el != -1){
                goal.isvoted = true 
              }
              else {
                goal.isvoted = false
              }

              goal.batch = netted_goals
              

              try { 
                goal.meta = JSON.parse(goal.meta)
              } catch(e){
                goal.meta = {}
              }
            });

            let goals_list = data.rows.reverse()
            
            commit("set_goals", goals_list)
            console.log("goals2", goals_list)
            dispatch('fetch_goals2', {hostname: hostname})
            
            resolve()
          })  

        }).catch(e => reject(e))

    }


  export async function fetch_reports({app, rootState, state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        lazy_fetch_all_table_internal(api, config.core, hostname, 'reports3').then(reports=>{

        // api.getTableRows(true, config.core, hostname, 'reports3', 'report_id', 0, -1, 10000).
        //   then(data=>{
            var offset = moment().utcOffset();

            reports.map(element => {
              element.need_check = element.need_check == 0 ? false : true
              element.approved = element.approved == 0 ? false : true
              element.created_at = moment.utc(element.created_at).add(offset, 'minutes');
              element.expired_at = moment.utc(element.expired_at).add(offset, 'minutes');
            });
            
            commit("set_reports", reports)
            resolve(reports)
          }).catch(e => reject(e))

      })
    })
  }


  export async function fetch_dacs({app, rootState, state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, hostname, 'dacs', 'username', 0, -1, 1000).
          then(dacs=>{
            
            try{
              dacs.rows.map(el => {
                el.description = JSON.parse(el.description) 
              });
            } catch(e){
              // reject(e)
            }

            commit("set_dacs", dacs.rows)
            resolve()
          }).catch(e => reject(e))

      })
    })
  }


  export async function fetch_vacs({app, rootState, state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, hostname, 'vacs', 'username', 0, -1, 1000).
          then(vacs=>{
            
            try{
              vacs.rows.map(el => {
                el.description = JSON.parse(el.description) 
              });
            } catch(e){

              // reject(e)

            }
            commit("set_vacs", vacs.rows)
            resolve()
          }).catch(e => reject(e))

      })
    })
  }


  export async function fetch_vproposals({app, rootState, state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, hostname, 'vproposal', 'id', 0, -1, 1000).
          then(vproposals=>{
            
            try{
             
              vproposals.rows.map(el => {
                el.why_me = JSON.parse(el.why_me) 
              });
            
            } catch(e){

              // reject(e)

            }
            
            
            commit("set_vproposals", vproposals.rows)
            resolve()
          }).catch(e => reject(e))

      })
    })
  }

  export async function fetch_sincome({app, rootState, state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, hostname, 'sincome', 'id', 0, -1, 1000).
          then(sincome=>{
            
            
            commit("set_sincome", sincome.rows)
            resolve()
          }).catch(e => reject(e))

      })
    })
  }


  function prepare_task(hostname, username, tasks, reports) {
    tasks.map(task => {
      
      let username_on_check 

      if (task.is_public == 0)
        username_on_check = task.doer
      else username_on_check = hostname == username ? false : username
        
         // && (username ? report.username == username : true)
      let report = reports.find(report => report.task_id == task.task_id && report.goal_id == task.goal_id && (username_on_check ? report.username == username_on_check : true))
      
      task.reports = reports.filter(report => report.task_id == task.task_id && report.goal_id == task.goal_id)
      task.user_reports = task.reports.filter(report => report.username == username)

      task.no_reports_on_check = true

      
      task.reports.map(report => {
        task.no_reports_on_check = task.no_reports_on_check && report.need_check == false && report.approved == true
      })

      task.has_report = report ? true : false

      if (report){
        task.report_approved = report.approved == true ? true : false 
      } else {
        task.report_approved = false
      }

      try { 
        task.meta = JSON.parse(task.meta)
      } catch(e){
        task.meta = {}
      }
    });
    
    let now = new Date()
    let nowDay = date.getDayOfWeek(now)
    
    
    tasks.map( task => {
      var netted_tasks = []
      var batch_is_complete = true
      task.start_at_string = task.start_at
      task.expired_at_string = task.expired_at

      let start_at =   new Date(task.start_at)
      let expired_at =   new Date(task.expired)

      task.start_at = start_at
      task.start_at_moment = moment(start_at).format("YYYY/MM/DD")

      let start_at_time = date.formatDate(start_at, 'HH:mm')
      let hours = start_at.getHours()
      let minutes = start_at.getMinutes()

      let calendar2 = [start_at]
      let calendar3 = [task.start_at_moment]
      task.calendar2 = [start_at]
      task.calendar3 = [task.start_at_moment]
      //UNCOMMENT IT

      if (task.is_regular == true){
        
        let now = new Date()

        task.calendar.map((c, index) => {
          let targetDay = Math.abs(c - nowDay)
          
          for (var i = 0; i < 12; i++) {
            let d = date.addToDate(now, { days: targetDay + 7 * i })
            d = date.adjustDate(d, {hours: hours, minutes: minutes})
            calendar2.push(d)

            let d2 = moment.utc(d).format("YYYY/MM/DD");
            calendar3.push(d2)
          }

          // task.start_at_moment = calendar3[0]
          
        });


        // //DELETE IT
        // calendar2.push(new Date())
        
        task.calendar2 = calendar2
        task.calendar3 = calendar3

        var show = false
        
        // now = new Date("2021-08-02T08:52:26") //COMMENT IT

        const day1 = date.getDayOfWeek(now) 
        
        var set_next_date = false
        
        task.calendar2.map(cal => {
          

          var day2 = date.getDayOfWeek(cal)
          // console.log('CAL', day1, day2, cal)
          
          // if (set_next_date == true) {
            
          //     console.log("set_next_date", false, cal)
          //     task.next_report_date = cal
          //     set_next_date = false
         
          // }

          if (day1 == day2){

            show = true
            // console.log("equal")
          
            // if (set_next_date == false){
            //   console.log("set_next_date", true)
            //   set_next_date = true
            // }
          }



        })

        task.next_report_date = task.calendar2.find(el => el > now)

        task.user_reports.map(report_on_check => {

          if ( date.isSameDate(now, report_on_check.created_at, 'day')) {
            // console.log("onSameDay", now, report_on_check.created_at)
            show = false

          } else {
            // console.log("NONSameDay",now, report_on_check.created_at)
            
          }
        })
           


        task.showCalendarReport = show
      
      } else {
        task.showCalendarReport = false
      }
      

      // task.showCalendarReport = true


      task.batch.map(b => {
        let res = data.rows.find(el => el.task_id == b)
        
        if (res){
          netted_tasks.push(res)
          batch_is_complete = batch_is_complete && res.has_report

        }
        
      })
      
      netted_tasks.sort((a, b) => {
        return a.priority - b.priority
      })

      task.batch = netted_tasks
      task.batch_is_complete = task.batch.length > 0 ? batch_is_complete && task.has_report : task.has_report
    })

      tasks.sort((a, b) => {
        return a.priority - b.priority
      })
      
      tasks.map(task => {
        task.isStartedTask = isStartedTask(task)
        task.isExpiredTask = isExpiredTask(task)
        task.isAvailableTask = isAvailableTask(task)
        task.isProcessTask = isProcessTask(task)
        task.isDelayedTask = isDelayedTask(task)
        task.isFinishTask = isFinishTask(task)
      })


      return tasks
    
      
  }

      function isStartedTask(task){
      
        if (task.start_at_string != "1970-01-01T00:00:00"){
          var offset = moment().utcOffset(); 
          var a = moment.utc(task.start_at_string).add(offset, 'minutes');
          var b = moment.utc().add(offset, 'minutes')
          
          return a < b
    
        } else return false
      
    }

    function isExpiredTask(task) {
      if (isDelayedTask(task) || isFinishTask(task))
        return false


      if (task.is_public == 0){
        if (task.expired_at_string != "1970-01-01T00:00:00") {
          var offset = moment().utcOffset(); 
          var a = moment.utc(task.expired_at_string).add(offset, 'minutes');
          var b = moment.utc().add(offset, 'minutes')
          
          return a < b
    
        } else return false
      }
      
    }

    function isAvailableTask(task){
      if (isExpiredTask(task))
        return false

      if (task.is_public == 0 && task.doer == "" && task.validated == 1 && task.status != 'completed')
        return true

      if (task.is_public == 1 && task.validated == 1 && task.active == 1  && task.status != 'completed')
        return true

      return false
    }

    function isProcessTask(task) {
      if (isExpiredTask(task) || isFinishTask(task))
        return false

      if ((task.is_public == 0 && task.doer != "" || task.validated == 0) && task.active == 1  && task.status != 'completed')
        return true

      return false

    }

    function isDelayedTask(task) {
      // if (isExpiredTask(task) || isFinishTask(task))
      //   return false

      if ((task.is_public == 0 && task.doer != "" || task.is_public == 1 || task.validated == 0) && task.active == 0  && task.status != 'completed')
        return true

      return false

    }
    
    function isFinishTask(task){
      
      if (task.is_public == 0 && task.doer != "" && task.report_approved && task.is_regular == 0 || task.status == 'completed')
        return true

      if (task.is_public == 1 && isStartedTask(task) && task.report_approved  && task.is_regular == 0  ||  task.status == 'completed')
        return true

      return false
    }


    export async function  fetch_ext_tasks({rootState, state, commit, dispatch}, {hostname, username}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        var reports = await dispatch('fetch_ext_reports', {hostname: hostname, username: username})
        api.getTableRows({json: true, code: config.core, scope: hostname, table: 'tasks', lower_bound: username, upper_bound: username, index_position: '12', key_type:"i64", limit: 10000}).
        // api.getTableRows({json: true, code: config.core, scope: hostname, table: 'reports', lower_bound: username, upper_bound: username, index_position: '4', key_type:"i64"}).
        
        // api.getTableRows(true, config.core, hostname, 'tasks', 'task_id', 0, -1, 10000).
          then(tasks=>{
    
            tasks = prepare_task(hostname, username, tasks.rows, reports)
            let incoming = state.incoming

            let ext_tasks = []
            

            incoming.map(inc =>{
              let t = tasks.find(task => task.task_id == inc.task_id)
              if (t){
                t.is_external = true
                t.incoming = inc
                ext_tasks.push(t)
              }
            })

            
            // tasks.map(el => {
            //   el.is_external = true
            //   el.incoming = incoming.find(inc => el.task_id == inc.task_id)
            // });


            commit("set_tasks", ext_tasks)
            resolve()
        }).catch(e => reject(e))
      })

    }


  export async function fetch_ext_reports({app, rootState, state, commit, dispatch}, {hostname, username}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows({json: true, code: config.core, scope: hostname, table: 'reports3', lower_bound: username, upper_bound: username, index_position: '4', key_type:"i64", limit: 10000}).
        // api.getTableRows(true, config.core, hostname, 'reports', 'report_id', 0, -1, 10000).
          then(data=>{
            var offset = moment().utcOffset();

            data.rows.map(element => {
              element.need_check = element.need_check == 0 ? false : true
              element.approved = element.approved == 0 ? false : true
              element.created_at = moment.utc(element.created_at).add(offset, 'minutes');
              element.expired_at = moment.utc(element.expired_at).add(offset, 'minutes');
            });
            
            commit("set_reports", data.rows)
            resolve(data.rows)
          }).catch(e => reject(e))

      })
    })
  }


    export async function  fetch_tasks({rootState, state, commit, dispatch}, {hostname, username}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        var reports = await dispatch('fetch_reports', {hostname: hostname})

        // api.getTableRows({json: true, code: config.core, scope: config.core, table: 'tasks', lower_bound: hostname, upper_bound: hostname, index_position: '2', key_type:"i64"}).
        // api.getTableRows(true, config.core, hostname, 'tasks', 'task_id', 0, -1, 10000).
        api.getTableRows({json: true, code: config.core, scope: hostname, table: 'tasks', limit: 100000, lower_bound: 0, upper_bound: -1}).


          then(tasks=>{
            if (tasks.more == true) {
              // console.log('fetch again')
              dispatch('fetch_tasks', {hostname: hostname, username: username})
            } else {

              console.log('fetched_tasks', tasks)
              tasks = prepare_task(hostname, username, tasks.rows, reports)
              
              dispatch('fetch_incoming', {username})
              commit("set_tasks", tasks)
              
              // console.log("set_tasks_to_store", tasks)
              resolve()
            }
        }).catch(e => reject(e))
      })

    }

    export async function  fetch_gfunds({rootState, dispatch, state, commit}, {hostname}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        api.getTableRows(true, config.core, config.core, 'funds', 'id', 0, -1, 1000).
          then(data=>{
            commit('set_gfunds', data.rows)
            resolve()
          }).catch(e => reject(e))
        
      })
    }
    

    export async function  fetch_hosts_on_funds({rootState, dispatch, state, commit}, {hostname}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        api.getTableRows(true, config.core, config.core, 'hostsonfunds', 'id', 0, -1, 1000).
          then(data=>{
            //TODO CHANGE IT!
            
            // api.getTableRows(true, config.core, data.rows[0].host, 'rate', 'id', 0, -1, 1000).then(rates => {
              if (data.rows.lenght > 0){
                var to_set = data.rows[0] 
                to_set.rates = state.rates

                to_set.current_convert_rate = to_set.rates[state.host_obj.current_pool_num - 1]


               commit("set_hosts_on_funds", to_set)
                 
              }
              
              resolve()

            //   api.getTableRows(true, config.core, data.rows[0].host, 'hosts', 'username', 0, -1, 1000).then(hosts => {
            //     to_set.host_obj = hosts.rows[0]
                

           
            //   }).catch(e => reject(e))    
              
              
            // }).catch(e => reject(e))    
      
        // }).catch(e => reject(e))    
      }).catch(e => reject(e))    


    })
    }


    export async function  fetch_ahosts({rootState, dispatch, state, commit}, {hostname}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        api.getTableRows(true, config.core, hostname, 'ahosts', 'username', 0, -1, 1000).
          then(data=>{
            
            data.rows.map(el => {
              try{
                el.meta = JSON.parse(el.meta)
              } catch(e){
                el.meta = {}
              }
            })

            commit("set_ahosts", data.rows)
            resolve()

        }).catch(e => reject(e))    
      })


    }

    export async function  fetch_coreahosts({rootState, dispatch, state, commit}){
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        api.getTableRows(true, config.core, config.core, 'ahosts', 'username', 0, -1, 1000).
          then(data=>{

            data.rows.map(el => {
              try{
                el.meta = JSON.parse(el.meta)
              } catch(e){
                el.meta = {}
              }
            })
            commit("set_coreahosts", data.rows)
            resolve()

        }).catch(e => reject(e))    
      })


    }

  export async function  fetch_syspercent({state, commit, dispatch}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, config.core, 'gpercents', 'id', 0, -1, 1000).
            then(data=>{
            let on_set = data.rows[0] ? data.rows[0].value : 0
            commit('set_syspercent', on_set)            
            resolve()
      }).catch(e => reject(e));      
    })

  }

  function toFixed(num, fixed) {
      var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
      return num.toString().match(re)[0];
  }
    

    export async function  fetch_market({state, commit, dispatch, rootState}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      dispatch('fetch_upower', {username: rootState.auth.username, hostname: hostname}).then(async upower => {

        console.log('state.power', upower, hostname)
        

        

        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
          

        api.getTableRows(true, config.core, hostname, 'powermarket', 'id', 0, -1, 1000).
              then(data=>{
                console.log("rootState.host.host_obj.total_shares", rootState.host.host_obj.total_shares)
                let market = data.rows[0]

                var liq = (market.base.balance).substr(0, market.base.balance.length - 5)
                
                market.liquid =  state.host_obj.total_shares - parseFloat(liq)    
                market.true_liquid = market.liquid
                
                if (market.liquid == 0 )
                  market.liquid = 1

                let price1 = (parseFloat(market.quote.balance))
                let price2 = (parseFloat(market.base.balance))
                market.price = {}

                market.price.buy = (price1 / price2 ).toFixed(state.host_obj.quote_precision)
                market.price.sell = (price1 / price2).toFixed(state.host_obj.quote_precision)

                market.stake = parseFloat(upower.power / rootState.host.host_obj.total_shares * 100) || 0
                
                let res = upower.power * price1 / ( price2  + upower.power)
       
               
                if (res < 0)
                  res = 0
                
                if (res)
                  market.if_user_sell_all = parseFloat(res).toFixed(4)
                

                commit('set_market', market)
                resolve()
        }).catch(e => reject(e));      
      })
    })
      // var upower = state.upower  || {power: 0}
      
  }



    export async function  fetch_pvesting_balances({state, commit, dispatch}, {username}) {
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
          
        api.getTableRows({json: true, code: config.core, scope: username, table: 'vesting', limit: 1000}).
        // api.getTableRows(true, config.core, username, 'vesting', 'id', 0, -1, 1000).
          then(data=>{
                if (data.more == true){
                  dispatch("fetch_pvesting_balances", {username: username})
                }
                else {

                
                  console.log("pvesting1", data.rows)
                  var tableData=[]
                  
                  data.rows.map(element => {
                      
                      let date = (new Date(element['startat'])).getTime();
                      let skeleton = {

                        id: element['id'],
                        owner: element['owner'], //Вывести в баланс
                        startat: element['startat'], //Вывести в баланс
                        duration: element['duration'],
                        unfreeze: new Date(date + element['duration'] * 1000),
                        amount: element["amount"],
                        available: element["available"],
                        available: element["available"],
                        withdrawed: element["withdrawed"],

                      }
                    tableData.push(skeleton)
                  });

                  console.log("pvesting2", tableData)

                  commit('set_pvesting_balances', tableData)
                  resolve()
                }
          }).catch(e => reject(e));     
      })
   
  }



    export async function  fetch_p2p_vbalances({state, commit, dispatch}, {username}) {
      return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
          
        api.getTableRows(true, config.p2p, username, 'vesting', 'id', 0, -1, 1000).
          then(data=>{
                
                var tableData=[]
                
                data.rows.map(element => {
                    
                    let date = (new Date(element['startat'])).getTime();
                    let skeleton = {

                      id: element['id'],
                      owner: element['owner'], //Вывести в баланс
                      startat: element['startat'], //Вывести в баланс
                      duration: element['duration'],
                      unfreeze: new Date(date + element['duration'] * 1000),
                      amount: element["amount"],
                      available: element["available"],
                      withdrawed: element["withdrawed"],
                    }
                  tableData.push(skeleton)
                });

                commit('set_p2p_vbalances', tableData)

                resolve()
          }).catch(e => reject(e));     
      })
   
  }
  

  export async function  get_marathon_user_status({state, commit, dispatch}, {hostname, username}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})

        api.getTableRows({json: true, code: config.core, scope: hostname, table: 'goalspartic', lower_bound: username, upper_bound: username, index_position: '3', key_type:"i64"}).
      
            then(data=>{
              commit('set_marathon_user_status', data.rows) 

              resolve()            
      }).catch(e => reject(e));      
    })

  }


  export async function  fetch_principals({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, hostname, hostname, 'principals', 'id', 0, -1, 10000).
            then(principals=>{
              commit('set_principals',principals.rows) 
              resolve()            
      }).catch(e => reject(e));      
    })

  }


  
  export function setActivePrincipal({state,commit}, {principal}){

    commit('setActivePrincipal', principal)
    
  }


export async function tactivate({commit, state, dispatch}, {host, task_id}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          eos.api.transact({ 
            actions: [{
              account: config.core,
              name: 'tactivate',
              authorization: [{
                actor: eos.accountName,
                permission: 'active',
              }],
              data: {
                host: host,
                task_id: task_id,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          }).then(res => {
            resolve()  
          }).catch(error => {
            reject(error)
            
          })

        })
    })
}




export async function tdeactivate({commit, state, dispatch}, {host, task_id}){
  // console.log("on deactivate", host, task_id)
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          eos.api.transact({ 
            actions: [{
              account: config.core,
              name: 'tdeactivate',
              authorization: [{
                actor: eos.accountName,
                permission: 'active',
              }],
              data: {
                host: host,
                task_id: task_id,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          }).then(res => {
            resolve()  
          }).catch(error => {
            reject(error)
            
          })

        })
    })
}




export async function tcomplete({commit, state, dispatch}, {host, task_id}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          eos.api.transact({ 
            actions: [{
              account: config.core,
              name: 'tcomplete',
              authorization: [{
                actor: eos.accountName,
                permission: 'active',
              }],
              data: {
                host: host,
                task_id: task_id,
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          }).then(res => {
            // commit('set_task_status', {status: "complete", task_id: task_id, host: host})
            resolve()  
          }).catch(error => {
            reject(error)
            
          })

        })
    })
}



export async function g_report_and_check({commit, state, dispatch}, {username, host, goal_id, report}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          eos.api.transact({ 
            actions: [{
              account: config.core,
              name: 'report',
              authorization: [{
                actor: eos.accountName,
                permission: 'active',
              }],
              data: {
                username: username,
                host: host,
                goal_id: goal_id,
                report: report
              },
            },
            {
              account: config.core,
              name: 'check',
              authorization: [{
                actor: eos.accountName,
                permission: 'active',
              }],
              data: {
                architect: username,
                host: host,
                goal_id: goal_id
              },
            }
            ]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          }).then(res => {
            resolve()  
          }).catch(error => {
            reject(error)
            
          })

        })
    })
}




export async function set_principal({commit, state, dispatch}, {principal, hostname}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [{
                account: hostname,
                name: 'setprincipal',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: principal,
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



export async function setinctask({commit, state, dispatch}, {data}){
    
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'setinctask',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: data,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)

              dispatch('fetch_incoming', {username})

            }).catch(e => reject(e))

        })
    })
}


  export function set_orders({state, commit}, {orders}){
    commit('set_orders', orders)
  }

  export async function get_orders({state, commit, dispatch}, {username}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})


      lazy_fetch_all_table_internal(api, config.p2p, config.p2p, 'orders')
        .then(orders => {

      // api.getTableRows({json: true, code: config.p2p, scope: config.p2p, table: 'orders', limit: 10000}).
        // then(orders => {
        
        orders.map(el => {
          try{
            el.details = JSON.parse(el.details)   
            el.root_remain_float = parseFloat(el.root_remain)
            el.quote_quantity       
          } catch(e){
            el.details = el.details
          }

        })
        commit('set_orders', orders)
        resolve()
        
      }).catch(e => resolve())                    

    })

  }

export async function get_gtokens({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
          
              
      api.getTableRows({json: true, code: hostname, scope: hostname, table: 'gtokens', limit: 10000}).
      then( res => {
        // console.log("after set", res.rows)
        commit('set_host_tokens', res.rows)
        resolve()
      }).catch(e => reject(e))
  

      
    })
  }



 export async function get_token_stat({state, commit, dispatch}, {contract, symbol}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
          
      // console.log("contract", contract, symbol)
      api.getTableRows({json: true, code: contract, scope: symbol, table: 'stat', limit: 10000}).
      then( token => {
        api.getTableRows({json: true, code: contract, scope: contract, table: 'globalbal', limit: 10000, index_position: '3', key_type:"i128" }).
          then( users => {

            commit("set_token_stat", {token: token.rows[0], users: users.rows})
            
            resolve()
        })

      }).catch(e => reject(e))
    })
  }


  export async function  get_events_categories({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.event, hostname, 'categories', 'id', 0, -1, 1000).
            then(data=>{
              commit('set_categories', data.rows) 
              resolve()            
      }).catch(e => reject(e));      
    })

  }


  export async function  showOrderDialog({state, commit, dispatch}, {status}) {
    commit("showOrderDialog", status)
  }


  export async function  setOrderToken({state, commit, dispatch}, {token}) {
    commit("set_order_token", token)
  }

  

  export async function  get_events_locations({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.event, hostname, 'locations', 'id', 0, -1, 1000).
            then(data=>{
              commit('set_locations', data.rows) 
              resolve()            
      }).catch(e => reject(e));      
    })

  }

  export async function  get_events({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.event, hostname, 'events', 'id', 0, -1, 1000).
            then(data=>{
              data.rows.map(el => {
                try{
                  el.meta = JSON.parse(el.meta)
                } catch(e) {

                }

              })
              commit('set_events', data.rows) 
              resolve()            
      }).catch(e => reject(e));      
    })
  }


  export async function  get_cycles({state, commit, dispatch}, {hostname}) {
    console.log('on community 08')
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'cycle', 'id', 0, -1, 1000).
            then(data=>{
              console.log('on community 8')
              commit('set_cycles', data.rows) 
              resolve()            
      }).catch(e => reject(e));      
    })

  }

                

  export async function  get_dhistory({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'coredhistory', 'id', 0, -1, 1000).
            then(data=>{
              let dhistory = data.rows.reverse()
              dhistory.map(el => {

                let target = state.pools.find(pool => pool.id == el.pool_id)
                if (target){
                  el.pool_num = target.pool_num
                  el.color = target.color  
                }
                
              })
              commit('set_dhistory', dhistory) 
              resolve()            
      }).catch(e => reject(e));      
    })

  }

  export async function  set_domain_status({state, commit, dispatch}, {status}) {
    commit('set_domain_status', status)
  }

  export async function  verify_domain({state, commit, dispatch}) {

    return new Promise(async (resolve, reject) => {
      
      // console.log("exeeee", state.verified)
      //https://eosio.stackexchange.com/questions/4116/how-to-use-checksum256-secondary-index-to-get-table-rows/4344#4344

      if (state.verified == true){
        resolve({status: true, site_type: state.site_type, hostname: state.target_host})
      } else {




      let hash = ecc.sha256(window.location.hostname)

      // let host2 = "unibase.club"
      // let hash2 = ecc.sha256(host2)
      
      var target_hash = ""
  

      if (hash !=  config.base_hash) {
      
        if (config.node_version == "v1.8.9") {
          
          var first_part = hash.substring(0, 32)
          var second_part = hash.substring(32) 
          
          var second_part_reversed = '', first_part_reversed = ''

          for (var i = 0; i < 16; i++) {
            first_part_reversed += first_part[30 - 2 * i] +  first_part[31 - 2 * i];
            second_part_reversed += second_part[30 - 2 * i] + second_part[31 - 2 * i];
             
          }
          target_hash = first_part_reversed + second_part_reversed
        } else {
          target_hash = hash
        }

        // console.log("target_hash", target_hash)

      
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        api.getTableRows({json: true, code: config.core, scope: config.core, table: 'ahosts', lower_bound: target_hash, upper_bound: target_hash, index_position: '3', key_type:"sha256"}).
              then(data=>{
                // console.log('data', data)
                if (data.rows.length > 0 && data.rows[0].hash == hash){
                  commit('set_verified_status', true) 
                  commit('set_site_type', data.rows[0].type)
                  commit('set_target_host', data.rows[0].username)
                  
                  
                  let target_page = "index"
                  
                  try{
                    target_page = JSON.parse(data.rows[0].meta).target || 'index'
                  } catch(e){}

                  let target_params = {}
                  
                  try{
                    target_params = JSON.parse(JSON.parse(data.rows[0].meta).params || '{}')
                  } catch(e){}

                  // console.log('set_target_params', target_params)

                  commit('set_target_page', target_page)
                  commit('set_target_params', target_params)

                  dispatch('fetch_ahosts', {hostname: data.rows[0].username})
                  dispatch('get_target_pools', {target: data.rows[0].username})

                  // console.log("onFETCH", data.rows)


                  dispatch('getCMSContent', {hostname: data.rows[0].username}).then(res => {
                      resolve({status: true, hostname: data.rows[0].username, site_type: state.site_type, target_page: target_page, target_params: target_params})  
                  })
                  
                  
                  
                  
                } else {
                  // console.log("on_verify", data.rows)
                  commit('set_verified_status', false) 
                  // commit('set_site_type', "single") 
                  reject("Website is not part of UNICORE network")
                }
                
        }).catch(e => {
          reject(e)
          commit('set_verified_status', false) 
        }); 
      } else {
        dispatch('getCMSContent', {hostname: config.root_community}).then(async res => {
             commit('set_verified_status', true) 
              commit('set_is_base', true)
              commit('set_site_type', "platform") 
              commit('set_target_host', config.root_community)
              dispatch('get_target_pools', {target: config.root_community})

              var ahost = await dispatch('fetch_ahosts', {hostname: config.root_community})

              resolve({status: true, site_type: "platform", hostname: config.root_community})

        })
        
       
      }
    }
    })


  }

  // export async function get_roles({state, commit, dispatch}) {
    
  //   return new Promise(async (resolve, reject) => {
  //     var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
  //     api.getTableRows(true, config.core, config.core, 'roles', 'id', 0, -1, 1000).
  //           then(data=> {
  //             commit('set_roles', data.rows)
  //             resolve()
  //     }).catch(e => reject(e));
  //   })

  // }


  export async function set_percents({state, commit, dispatch}, {percents}) {
    
    commit('set_percents', percents)

  }

  export async function setMinPower({state, commit, dispatch}, minpower) {
    
    commit('set_minpower', minpower)

  }


  export async function  get_spiral2({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'spiral2', 'id', 0, -1, 1000).
            then(data=>{
              
              commit('set_spiral2', data.rows[0])
              resolve()
      }).catch(e => reject(e));
    })
  }


  export async function  get_spiral({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'spiral', 'id', 0, -1, 1000).
            then(data=>{
              
              commit('set_spiral', data.rows[0])
              resolve()
      }).catch(e => reject(e));
    })
  }

  export async function  get_conditions({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'conditions', 'key', 0, -1, 1000).
            then(data=>{
              
              let minpower = 0
              let mcond = data.rows.find(el => el.key_string == "minpower")
              if (mcond)
                minpower = mcond.value 

              commit('set_minpower', minpower)

              data.rows.map((cond, index) => {
                if (cond.key_string == "condaddgoal")
                {
                  data.rows[index].value = eosjsAccountName.uint64ToName(cond.value);
                }

                if (cond.key_string == "condaddtask")
                {
                  data.rows[index].value = eosjsAccountName.uint64ToName(cond.value);
                }

                if (cond.key_string == "condjoinhost")
                {
                  data.rows[index].value = eosjsAccountName.uint64ToName(cond.value);
                }

              })
              

              commit('set_conditions', data.rows)
              resolve()
      }).catch(e => reject(e));
    })
  }

  export function modify_goal({state, commit, dispatch}, {fundData}){
    commit('modify_goal', fundData)
  }

  export async function get_pools({state, commit, dispatch, rootState}, {hostname}){
    return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        lazy_fetch_all_table_internal(api, config.core, hostname, 'pool').then(pools => {
              

        // api.getTableRows(true, config.core, hostname, 'pool', 'id', 0, -1, 1000).then(data => {
          
            console.log("get_pools", hostname, pools)  

            //FIND CURRENT LAST POOL
            let last_id = pools.length
            let current_pool = pools[last_id-1]
            if (current_pool){
            //   current_pool = pools.find(el => el.id == state.host_obj.current_pool_id)
            // var current_pool = pool
              //ЗАЧЕМ ЭТО БЫЛО НУЖНО?
            
              if (current_pool.pool_num == 2){
                let prevlastpool = pools[last_id-2]
                if (prevlastpool.remain_quants > 0)
                  current_pool = pools[last_id-2]
              }


            //CALCULATE POOL PARAMS IN FORMAT
            let pool_expiration_date = new Date(current_pool['pool_expired_at']);
            let priority_until_date = new Date(current_pool['priority_until']);
            
            let blockchain_date = new Date(rootState.blockchain.bcinfo.head_block_time)

            let current_pool_color = current_pool['color'].toUpperCase()
            commit('set_pool_color', current_pool_color)
            let isblack = current_pool['color']=='black' ? true : false
            commit('set_is_black', isblack)

            let remain_quants = Math.floor(current_pool['remain_quants'] / quants_precision)
            commit('set_remain_quants', remain_quants)

            let percent = parseFloat(((current_pool['total_quants'] - current_pool['remain_quants']) / current_pool['total_quants'] * 100).toFixed(3))
            
            commit('set_percent', percent)

            let float_quant_cost = parseFloat(current_pool['quant_cost']).toFixed(state.host_obj.precision)
            commit('set_float_quant_cost', float_quant_cost)
            
            let remain_quants_in_tokens_float = current_pool['remain_quants'] / quants_precision < 2 ? float_quant_cost : (Math.trunc(current_pool['remain_quants'] / quants_precision) * float_quant_cost).toFixed(state.host_obj.precision)
            
            let remain_quants_in_tokens = current_pool['remain_quants'] / quants_precision < 2 ? current_pool['quant_cost'] : remain_quants_in_tokens_float + " " + state.host_obj.symbol
            
            let priority_between = (priority_until_date - blockchain_date )/ 1000
            current_pool.priority_seconds = priority_between
            commit('set_priority_seconds', priority_between)
            var expired_flag, pool_expired

            if (current_pool['pool_num'] > 2) {
              expired_flag = pool_expiration_date < blockchain_date
              pool_expired = pool_expiration_date
            } else {
              expired_flag = false
            }
            
            pools.map((el, index) => {
              if (state.rates[el.pool_num - 1])
                pools[index].convert_price = state.rates[el.pool_num - 1].quant_convert_rate
              // pools[index].live_balance_for_convert = el.remain_quants / state.spiral.base_rate / state.spiral.quants_precision * Math.pow(10, state.host_obj.sale_shift) * state.rates[el.pool_num - 1].convert_rate / Math.pow(10, state.host_obj.asset_on_sale_precision)
              // pools[index].live_balance_for_convert = parseFloat(pools[index].live_balance_for_convert).toFixed(state.host_obj.asset_on_sale_precision) + ' ' + state.host_obj.asset_on_sale_symbol
            });

            commit('set_pools', pools)
            commit("set_current_pool", current_pool) 
            
            if (state.deposit_amount == 0)
              commit('set_deposit_amount', float_quant_cost)
            } else {
              commit('set_pools', [])
              commit("set_current_pool", current_pool) 

            }
            console.log("get COmmunity7", hostname)
            resolve()
          
          
        }).catch(e => reject(e))   
    })
  }

  export async function lazy_fetch_all_table({state, commit, dispatch, rootState}, {api, code, scope, table, lower_bound, upper_bound, limit, index_position, key_type}){
    return lazy_fetch_all_table_internal(api, code, scope, table, lower_bound, upper_bound, limit, index_position, key_type)
  }

  export async function lazy_fetch_all_table_internal(api, code, scope, table, lower_bound, upper_bound, limit, index_position, key_type){
    // return new Promise(async (resolve, reject) => {
      
      if (!limit) limit = 100
      if (!lower_bound) lower_bound = 0
    
      
      var data = await api.getTableRows({json: true, code: code, scope: scope, table: table, lower_bound: lower_bound, upper_bound: upper_bound, limit: limit, index_position: index_position, key_type: key_type})
      var result = data.rows

      
      if (data.more == true) {
        
        var redata = await lazy_fetch_all_table_internal(api, code, scope, table, data.next_key, upper_bound, limit, index_position, key_type)
        result = [...result, ...redata]
        return result
      
      } else {
      
        return result
        
      }

    // })
  }


  export async function fetch_all_usdtwithdraws({commit, state, dispatch}, {hostname}){
    return new Promise((resolve, reject) => {
       dispatch('blockchain/getAPI', { blockchain:  config.ual.rootChain}, { root: true }).then(api => {
        
        // api.getTableRows({json: true, code: config.core, scope: hostname, table: 'usdtwithdraw', limit: 1000, lower_bound: username, upper_bound: username, index_position: '2', key_type:"i64", }).
          lazy_fetch_all_table_internal(api, config.core, hostname, 'usdtwithdraw').then(usdtwithdraws => {
            console.log("usdtwithdraws", usdtwithdraws)      
            // then(usdtwithdraw=>{
              usdtwithdraws.map(el => {
                try{
                  el.comment = JSON.parse(el.comment)
                } catch(e){
                  el.comment = ""
                }
              })
            commit('set_all_usdtwithdraw', usdtwithdraws)
            resolve(usdtwithdraws)

          }).catch(e => reject(e))
        }).catch(e => reject(e))

    })
  }

  export async function get_target_pools({state, commit, dispatch, rootState}, {target}) {
    return new Promise(async (resolve, reject) => {
        var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
        
        api.getTableRows({json: true, code: config.core, scope: target, table: 'hosts', limit: 1}).then(host => {
                
            let host_obj = host.rows.find(el => el.username == target)
        
              lazy_fetch_all_table_internal(api, config.core, target, 'pool').then(pools => {
              

              console.log('total lazy result', pools)
              let current_pool = pools[host_obj.current_pool_id]

               
                current_pool['remain_quants'] = Math.floor(current_pool['remain_quants'] / quants_precision)
                
                commit("set_current_target_pool", current_pool) 
              
                lazy_fetch_all_table_internal(api, config.core, target, 'rate').then(rates => {
                  console.log('on rates', rates)
                  rates.map((element, index) => {
                    element['buy_rate'] = element['buy_rate'] / Math.pow(10, host_obj.precision)
                  });

                  var next_target_pool = rates.find(el => el.pool_id == current_pool.id + 1)
                  commit("set_next_current_target_pool_rate", next_target_pool.buy_rate)
                
                  
                  resolve()  

                }).catch(e => reject(e))   
              

            }).catch(e => reject(e))   
          })
    })

  }


  export async function  get_rates({state, commit, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      lazy_fetch_all_table_internal(api, config.core, hostname, 'rate').then(rates => {
        console.log('on rate', hostname, rates)
      // api.getTableRows({json: true, code: config.core, scope: hostname, table: 'rate', limit: 1000}).
      // // api.getTableRows(true, config.core, hostname, 'rate', 'id', 0, -1, 1000).

      //       then(data=>{
              if (state.host_obj){
              
                var last_id = state.host_obj.current_pool_num-1
                

                // if (data.rows[last_id]){

                // console.log("last_id", last_id, data.rows)


                // var buy_rate = parseFloat(data.rows[last_id]['buy_rate']) / Math.pow(10, state.host_obj.precision) + " " + state.host_obj.symbol
                // var sell_rate = parseFloat(data.rows[last_id]['sell_rate']) / Math.pow(10, state.host_obj.precision) + " " + state.host_obj.symbol
                
                // commit('set_sell_rate', sell_rate)
                // commit('set_buy_rate', buy_rate)

                rates.map((element, index) => {
                  element['buy_rate'] = element['buy_rate'] / Math.pow(10, state.host_obj.precision)
                  element['sell_rate'] = element['sell_rate'] / Math.pow( 10, state.host_obj.precision)
                  element.convert_price = (parseFloat(element.quant_buy_rate) / parseFloat(element.quant_convert_rate)).toFixed(state.host_obj.precision) + ' ' + state.host_obj.symbol + '/' + state.host_obj.asset_on_sale_symbol
                });

                let first_rate = rates[0]['sell_rate']  
                let last_rate = rates[rates.length-1]['sell_rate']
                
                var total_growth = last_rate / first_rate * 100
                
                commit('set_total_growth', total_growth)
                commit('set_rates',rates)  

              // }
              }
              console.log("get COmmunity6", hostname)
                
              resolve()

      }).catch(e => reject(e));      
    })

  }





  export function clear({state,commit}){
    commit("clear")
  }

  export async function fetch_bwtradegraph({state, commit, dispatch}, {hostname}){
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      // api.getTableRows(true, config.core, hostname, 'bwtradegraph', 'pool_id', 0, -1, 1000).
      lazy_fetch_all_table_internal(api, config.core, hostname, 'bwtradegraph').then(data => {
        
        // then(data=>{
          
          var graphData = []
          var rawData = data.filter(el => el.cycle_num == state.host_obj.current_cycle_num)

          rawData.map(el =>{
            
            let arr = {x: el.pool_num, y: [el.open, el.high, el.low, el.close, el.is_white]}
            
            graphData.push(arr)

          })

          commit('set_bwtradegraph', graphData)

          resolve()
        }).catch(e => reject())
    })
  }

  export async function get_host({state, commit, dispatch}, {hostname}){
    commit("set_hostname", hostname)
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      api.getTableRows(true, config.core, hostname, 'hosts', 'username', 0, -1, 1000).
        then(data=>{
          let host_obj = data.rows.find(el => el.username == hostname)
          
          if (host_obj){
            host_obj['priority_flag'] = host_obj['priority_flag'] == 0 ? false : true
            if (host_obj['type'] == 'bw')
                dispatch('fetch_bwtradegraph', {hostname: hostname})
            // try{
            //   if (host_obj.meta == ""){
            //     host_obj.meta = {}
            //   }
            //   else{
                
            //     host_obj.meta = JSON.parse(host_obj.meta)
            //     if (host_obj.meta == ""){
            //       host_obj.meta = {}
            //     }
            //   }
            // } catch(e){
            //   host_obj.meta = {}
            // }
            
            commit("set_hostobj", host_obj)
          } else commit("set_hostobj", false)
          resolve()
          return true 
      }).catch(e => reject(e))
    })
  }


  export function setHostMetaToStore({state, commit, dispatch, getters}, {param}){
    let meta = state.meta
    
    meta = {...param}
    
    commit('setHostMeta', meta)
  }



export async function delTask({commit, state, dispatch, rootState}, {task}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'deltask',
                authorization: [{
                  actor: rootState.auth.username,
                  permission: 'active',
                }],
                data: {
                  host: task.host,
                  task_id: task.task_id
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)
              commit('delTask', task)
            }).catch(e => reject(e))

        })
    })
}


export async function updateHostMeta({commit, state, dispatch}, {hostname}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          var data = {
                  architect: hostname,
                  host: hostname,
                  platform: hostname,
                  title: state.host_obj.title,
                  purpose: state.host_obj.purpose,
                  manifest: state.host_obj.manifest,
                  power_market_id: hostname,
                  meta: JSON.stringify(state.host_obj.meta),
                }
          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'edithost',
                authorization: [{
                  actor: hostname,
                  permission: 'active',
                }],
                data: data,
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


export async function setCondition({commit, state, dispatch}, condition){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'setcondition',
                authorization: [{
                  actor: condition.host,
                  permission: 'active',
                }],
                data: condition,
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


export async function setGoal({commit, state, dispatch}, {goal}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          var data = goal
          
          data.is_batch = data.is_batch == 0 ? false : true
          
          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'setgoal',
                authorization: [{
                  actor: goal.creator,
                  permission: 'active',
                }],
                data: data,
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


export async function setTask({commit, state, dispatch}, {task}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          var data = task
          
          var data2 = {
            host: task.host,
            creator: task.creator,
            permlink: task.permlink,
            goal_id: task.goal_id,
            priority: task.priority,
            title: task.title, 
            data: task.data,
            requested: task.requested,
            is_public: task.is_public,
            doer: task.doer,
            for_each: task.for_each,
            with_badge: task.with_badge,
            badge_id: task.badge_id,
            duration: task.duration,
            is_batch: task.is_batch,
            parent_batch_id: task.parent_batch_id,
            is_regular: task.is_regular,
            calendar: task.calendar,
            start_at: task.start_at,
            expired_at: task.expired_at,
            meta: task.meta
          }

          // console.log("data2", data2)

          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'settask',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: data2,
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


export async function changeTaskPriority({commit, state, dispatch}, {task1, task2}){
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          let priority1 = task2.priority
          let priority2 = task1.priority

          task1.priority = priority1
          
          task2.priority = priority2
          
          eos.api.transact({ 
              actions: [{
                account: config.core,
                name: 'settask',
                authorization: [{
                  actor: task1.host,
                  permission: 'active',
                }],
                data: task1,
              },
              {
                account: config.core,
                name: 'settask',
                authorization: [{
                  actor: task2.host,
                  permission: 'active',
                }],
                data: task2,
              }
              ]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}



export async function createOrderWithTransfer({commit, state, dispatch, rootState}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          console.log("order", order)

          eos.api.transact({ 
              actions: [{
                account: order.root_contract,
                name: 'transfer',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: {
                  from: order.username,
                  to: config.p2p,
                  quantity: order.root_quantity,
                  memo: ''
                },
              },
              {
                account: config.p2p,
                name: 'createorder',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('wallet/fetchBalances', {username: rootState.auth.username}, {root: true})
            
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}


export async function createOrder({commit, state, dispatch, rootState}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'createorder',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('wallet/fetchBalances', {username: rootState.auth.username}, {root: true})
            
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}


export async function cancelOrder({commit, state, dispatch, rootState}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'cancel',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('wallet/fetchBalances', {username: rootState.auth.username}, {root: true})
            
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}


export async function confirmOrder({commit, state, dispatch, rootState}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'confirm',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('wallet/fetchBalances', {username: rootState.auth.username}, {root: true})
            
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}


export async function acceptOrder({commit, state, dispatch, rootState}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'accept',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              dispatch('wallet/fetchBalances', {username: rootState.auth.username}, {root: true})
            
              resolve(res)
            }).catch(e => reject(e))

        })
    })
}


export async function approveOrder({commit, state, dispatch, rootState}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'approve',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              resolve(res)
              dispatch('wallet/fetchBalances', {username: rootState.auth.username}, {root: true})
            
            }).catch(e => reject(e))

        })
    })
}


export async function delOrder({commit, state, dispatch}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'del',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
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



export async function setTokenContract({commit, state, dispatch}, {hostname}) {
    return new Promise(async (resolve, reject) => {
      dispatch('auth/init', {}, {root: true}).then(async eos=> {
        const wasmFilePath = '/statics/hosttoken/hosttoken.wasm'
        const abiFilePath = '/statics/hosttoken/hosttoken.abi'

        
        var wasmResponse = await axios.request({
          method: 'GET',
          url: wasmFilePath,
          responseType: 'arraybuffer',
          reponseEncoding: 'binary'

        }, {})
        
        let resp = wasmResponse.data;

        var wasm = Buffer.from(resp, 'utf8');
        wasm = wasm.toString(`hex`)


        const buffer = new Serialize.SerialBuffer({
            textEncoder: eos.api.textEncoder,
            textDecoder: eos.api.textDecoder,
        })

        let abiJSONData = await axios.get(abiFilePath, {})
        
        let abiJSON = abiJSONData.data

        const abiDefinitions = eos.api.abiTypes.get('abi_def')

        abiJSON = abiDefinitions.fields.reduce(
            (acc, { name: fieldName }) =>
                Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
                abiJSON
            )
        abiDefinitions.serialize(buffer, abiJSON)
          
        var serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex')
        

        let data = {
                  account: hostname,
                  vmtype: 0,
                  vmversion: 0,
                  code: wasm,
        }
    
        eos.api.transact({ 
              actions: [
              {
                account: 'eosio',
                name: 'setcode',
                authorization: [{
                  actor: hostname,
                  permission: 'active',
                }],
                data: data
              },
              {
                account: 'eosio',
                name: 'setabi',
                authorization: [
                  {
                    actor: hostname,
                    permission: 'active',
                  },
                ],
                data: {
                  account: hostname,
                  abi: serializedAbiHexString,
                },
              },
              ]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            }).then(res => {
              // console.log("setContract", res)
              resolve(res)
            }).catch(e => {
              // console.log(e.message)
              reject(e)
            })


    
    })
  })
}


export async function disputeOrder({commit, state, dispatch}, {order}) {
    return new Promise((resolve, reject) => {
        dispatch('auth/init', {}, {root: true}).then(eos=> {
          eos.api.transact({ 
              actions: [
              {
                account: config.p2p,
                name: 'dispute',
                authorization: [{
                  actor: eos.accountName,
                  permission: 'active',
                }],
                data: order,
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


export async function  get_usdrates({state, commit, dispatch}) {
    return new Promise(async (resolve, reject) => {
      var api = await dispatch('blockchain/getAPI', {blockchain: config.ual.rootChain}, {root: true})
      
      api.getTableRows({json: true, code: config.p2p, scope: config.p2p, table: 'usdrates', lower_bound: 0, upper_bound: 10, limit: 10}).
        
      // api.getTableRows(true, config.p2p, config.p2p, 'usdrates', 'id', 0, -1, 1000).
            then(data=>{
              if (data.rows.length > 0)
                commit('set_usdrates', data.rows)
              resolve()
      }).catch(e => reject(e));
    })
  }