
  export function set_tags (state, tags) {
     state.tags.push(tags)
     
  }

  export function set_host (state, hostname){
    state.host = hostname
  }

  export function set_reports (state, reports) {
    state.reports = reports
  }

  export function set_goals (state, goals){
    state.goals = goals
  }

  export function set_all_goals (state, all_goals)  {
    state.all_goals = all_goals
  }

  export function set_posts (state, posts) {
    state.list = posts
  }


  export function set_orderby (state, orderby) {
    state.orderby = orderby
  }

  export function clear (state) {
    state.list = []
    state.tags = [process.env.BLOCKCHAIN_NAME]
    state.after = undefined
    state.author = undefined
  }

  export function set_author (state, author) {
    state.author = author
  }

  export function set_after (state, after) {
    state.after = after
  }