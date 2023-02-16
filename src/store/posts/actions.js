import { POSTS_QUERY, GOALS_QUERY, COMMENT_QUERY } from '@/utils/queries.js'

  export async function fetch_posts({ app,rootState, state, commit }, {client}) {
        
  
    // let client = this._vm.$apolloProvider
    let options = {
      first: 10,//process.env.fetchAMOUNT
      author: state.author,
      after: state.after,
      parentAuthor: "",
      blockchain: "dacom", //process.env.BLOCKCHAIN_NAME
      meta: {
        tags: state.tags
      }

    }
    if (process.env.APP != 'DACom')
      options.meta.app = process.env.APP

    let { data } = await client.query({query: COMMENT_QUERY, variables: options})

    let posts = data.posts.edges.map(p => p.node)
    let posts_deep_copy = JSON.parse(JSON.stringify(posts))
    
    commit('set_posts', state.list.concat(posts_deep_copy))
    
    if (posts.length > 0) {
      commit('set_after', data.posts.edges[data.posts.edges.length - 1].cursor)
    }
  }


  export function set_author({ state, commit }, author) {
    if (author !== state.author) commit('clear')
    // commit('set_author', author)
  }

  export function set_order({state, commit}, orderby) {
    state.list = []
    state.after = undefined
    commit('set_orderby', orderby)
  }

  export function set_host({state, commit}, hostname) { 
    state.host = hostname
    commit('set_host', hostname)

  }
  export function clear({state,commit}){
    commit("clear")
  }
  export function set_posts({state, commit}, posts){
    state.list = posts
    commit('set_posts', posts)
  }
  export function set_tags({ state, commit }, tags) {
    
    commit('set_tags', tags)
  }