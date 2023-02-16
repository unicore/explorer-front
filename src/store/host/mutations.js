/*
export function someMutation (state) {
}
*/
export function set_username (state, username) {
    state.username = username
  }

export function set_all_usdtwithdraw (state, withdraws) {
    state.all_usdt_withdraws = withdraws
  }




export function set_cmscontent(state, content){
  state.cmscontent = content
}

export function set_events(state, events){
  state.events = events
}

export function set_partner_meta(state, meta){
  state.partner.meta = meta 
  state.partner.profile_is_completed = true
}

export function set_usdrates(state, usdrates) {
  state.usdrates = usdrates 
}

export function set_doers(state, doers) {
  state.doers = doers 
}

export function set_balances(state, balances){
  state.balance = balances
}

export function setActivePrincipal(state, principal){
  state.principal = principal
}

export function set_reg_balance(state, reg_balance){
  state.reg_balance = reg_balance
}

export function set_order_token(state, token){
  state.orderToken = token
}

export function set_principals(state, principals){
  state.principals = principals
}

export function set_host_tokens(state, tokens){
  function parseTokenString(tokenString) {
    const [amountString, symbol] = tokenString.split(" ")
    const amount = parseFloat(amountString)
    return { amount, symbol }
  }

  state.tokens = []
  tokens.map(el => {
    el.symbol = parseTokenString(el.max_supply).symbol
  })
  if (tokens.lenght > 0)
    commit("set_order_token", tokens[0])

  state.tokens = tokens
}

export function set_orders(state, orders){
  state.orders = orders
}

export function set_dacs(state, dacs){
  state.dacs = dacs
}

export function set_vacs(state, vacs){
  state.vacs = vacs
}

export function set_vproposals(state, vproposals) {
  state.vproposals = vproposals
}

export function set_incoming(state, incoming){
  state.incoming = incoming
}

export function set_conditions(state, conditions){
  state.conditions = conditions
}

export function set_sincome(state, sincome){
  state.sincome = sincome
}

export function set_roles(state, roles){
  state.roles = roles
}

export function set_percents(state, percents){
  state.host_obj.referral_percent = percents.ref_percent
  state.host_obj.dacs_percent = percents.dacs_percent
  state.host_obj.hfund_percent = percents.hfund_percent
  state.host_obj.cfund_percent = percents.cfund_percent
}

export function set_methods(state, methods){
  state.methods = methods
}

export function showOrderDialog(state, status){
  state.orderDialog = status
}

export function set_categories(state, categories){
  state.categories = categories
}

export function set_is_base(state, status){
  state.is_base = true
}

export function set_marathon_user_status(state, status){
  state.user_marathons = status
}

export function set_locations(state, locations){
  state.locations = locations
}

export function set_pool_color(state, color){
  state.current_pool_color = color
}

export function set_is_black(state, isblack){
  state.is_black = isblack
}

export function set_remain_quants(state, remain_quants){
  state.remain_quants = remain_quants
}

export function set_verified_status(state, status){
  state.verified = status
}

export function set_hosts_on_funds(state, funds){
  state.hostsonfunds = funds
}

export function set_gfunds(state, gfunds){

  state.gfunds = gfunds

}

export function set_token_stat(state, stat){

  state.token_stat = stat

}




export function set_priority_seconds(state, seconds){
  state.set_priority_seconds = seconds
}

export function set_site_type(state, type){
  state.site_type = type
}

export function set_target_host(state, host){
  state.target_host = host
}

export function set_target_page(state, target){
  state.target_page = target
}

export function set_target_params(state, params){
  state.target_params = params
}

export function set_partner(state, partner){
  state.partner = partner
}

export function set_deposit_amount(state, deposit_amount){
  state.deposit_amount = deposit_amount
}

  export function set_spiral (state, spiral)  {
    state.spiral = spiral
    
  }

  export function set_spiral2 (state, spiral)  {
    state.spiral2 = spiral
  }


  export function set_float_quant_cost (state, float_quant_cost)  {
    state.float_quant_cost = float_quant_cost
    
  }

  export function set_percent(state, percent){
    state.percent = percent
  }
  export function set_bwtradegraph(state, bwtradegraph){
    state.bwtradegraph[0].data = bwtradegraph
  }

  export function set_hostname (state, hostname)  {
    state.hostname = hostname
  }

  export function setHostMeta(state, meta){
    state.host_obj.meta = meta
  }

  export function set_hostobj (state, host_obj){
    state.host_obj = host_obj
  }

  export function set_pools (state, pools){
    state.pools = pools
  }

  export function set_current_pool(state, current_pool){
    state.current_pool = current_pool
  }

  export function set_current_target_pool(state, current_pool){
    state.current_target_pool = current_pool
  }

  export function set_next_current_target_pool_rate(state, next_buy_rate){
    state.next_current_target_pool_rate = next_buy_rate
  }


  export function set_reports (state, reports)  {
    // state.reports = reports
    reports.map(goal => {
      let exist = state.reports.find(el => el.id == goal.id)
      if (!exist)
        state.reports.push(goal)
    })

  }

  export function set_badges (state, badges)  {
    state.badges = badges
  }
  
  export function set_usbadges(state, usbadges){
    state.usbadges = usbadges
  }

  export function clear_goals(state){
    state.goals = []
  }

  export function addPowerToWheel(state, data){
 
    state.goals[data.sector].gifted_power += data.quantity
 
  }

  export function clear_tasks(state){
    state.tasks = []
  }

  export function set_tasks (state, tasks)  {
    var tmp = JSON.parse(JSON.stringify(state.tasks))
    state.tasks = []
   
    const result = Object.values(
       [].concat(tmp, tasks)
         .reduce((r, c) => (r[c.task_id] = Object.assign((r[c.task_id] || {}), c), r), {})
    );



    state.tasks = result


  
  }
  

  export function set_upower(state, upower){
    state.upower = upower
  }


  export function add_goal (state, goal)  {
    state.goals.push(goal)
  }

  export function delTask (state, task)  {
    console.log("onDelTask", task, state.tasks)
    var tmp = state.tasks
    state.tasks = []

    state.tasks = tmp.filter(el => el.task_id != task.task_id)
    console.log("onDelTask2", state.tasks)
  }




  export function set_goals (state, goals)  {
    // goals.map(goal => {
    //   let exist = state.goals.find(el => el.id == goal.id)
    //   if (!exist)
    //     state.goals.push(goal)

    // })

    var tmp = JSON.parse(JSON.stringify(state.goals))
    state.goals = []
   
    const result = Object.values(
       [].concat(tmp, goals)
         .reduce((r, c) => (r[c.id] = Object.assign((r[c.id] || {}), c), r), {})
    );



    state.goals = result

    
  }

  export function set_all_goals (state, all_goals)  {
    state.all_goals = all_goals
  }

  export function set_orderby (state, orderby)  {
    state.orderby = orderby
  }

  export function set_posts (state, posts)  {
    state.list = posts
  }

  export function set_ahosts (state, ahosts)  {
    state.ahosts = ahosts 
  }

  export function set_coreahosts(state, coreahosts){
    state.coreahosts = coreahosts
  }

  export function clear (state)  {
    state.list = []
    state.after = undefined
  }

  export function set_author (state, author)  {
    state.author = author
  }

  export function set_cfund(state, cfund){
    state.cfund = cfund
  }

  export function set_market(state, market){
    state.market = market
  }

  export function set_after (state, after)  {
    state.after = after
  }

  export function set_dhistory(state, dhistory){
    state.dhistory = dhistory
  }

  export function set_cycles(state, cycles){
    state.cycles = cycles
  }

  export function set_buy_rate(state, buy_rate){
    state.buy_rate = buy_rate
  }

  export function set_sell_rate(state, sell_rate){
    state.sell_rate = sell_rate
  }

  export function set_syspercent(state, sys_percent){
    state.sys_percent = sys_percent
  }

  export function add_task(state, task){
    state.tasks.push(task)
  }

  export function set_minpower2(state, minpower){
    state.minpower = minpower    
  }

  export function set_referals(state, referals){
    state.referals = referals    
  }

  export function set_all_partners(state, all_partners) {
    all_partners.map(part => {
      state.all_partners.push(part)
    })
  }

  export function set_last_partner_id(state, last_partner_id) {
    state.last_partner_id = last_partner_id    
  }  


  export function set_minpower(state, minpower) {

    let exist = state.conditions.find(el => el.key_string == "minpower")
    if (exist)
      exist.value = minpower
    else state.conditions.push({key_string: 'minpower', value: 0})

    state.minpower = minpower
  }

  export function add_report(state, report){

    let exist = state.reports.find(el => el.task_id == report.task_id && el.username == report.username && el.goal_id == report.goal_id)
    
    state.tasks.map((task, index) => {
      if (task.task_id == report.task_id && task.goal_id == report.goal_id){
        task.has_report = report.has_report
      }

    })

    if (exist){
      state.reports.map((el, index) => {
        if (el.task_id == report.task_id && el.username == report.username && el.goal_id == report.goal_id){
          let temp = el
          temp.comment = report.comment
          temp.approved = report.approved
          temp.data = report.data
          temp.need_check = report.need_check

          delete state.reports[index]; 
          
          state.reports[index] = temp
        }
      })
    } else state.reports.push(report)
    
  }

  export function modify_goal(state, fundData){
   state.goals.map(goal =>{

    if ((goal.id === fundData.goal_id) && (goal.host === fundData.host)) {
      goal.available = parseFloat(goal.available) + parseFloat(fundData.amount)
      goal.available = goal.available + ' ' + state.host_obj.symbol
    }
  })
  }

  export function set_total_growth(state, total_growth){
    state.total_growth = total_growth
  }

  export function set_rates(state, rates){
    state.rates = rates
  }

  export function set_pvesting_balances (state, pvests)  {
    state.pvests = pvests
  }

  export function set_p2p_vbalances (state, p2pvests)  {
    state.p2pvests = p2pvests
  }


