import { uid } from 'quasar'
import config from '@/config/index'
import apollo from '@/boot/apollo'

import router from '@/router'
import { COMMENT_QUERY } from '@/utils/queries.js'


  export async function fetch_cfund({app, rootState, state, commit, dispatch}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, state.owner, 'emission', 'username', 0, -1, 1000).
          then(data=>{
            
            commit("set_cfund", data.rows[0])
            resolve()
          }).catch(e => reject(e))

      })
    })
  }


  export async function fetch_reports({app, rootState, state, commit, dispatch}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        
        api.getTableRows(true, config.core, state.owner, 'reports', 'report_id', 0, -1, 1000).
          then(data=>{
            
            data.rows.map(element => {
              element.need_check = element.need_check == 0 ? false : true
              element.approved = element.approved == 0 ? false : true
            });

            commit("set_reports", data.rows)
            resolve()
          }).catch(e => reject(e))

      })
    })
  }

  export async function fetch_tasks({app, rootState, state, commit, dispatch}){
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {

        api.getTableRows(true, config.core, state.owner, 'tasks', 'task_id', 0, -1, 1000).
          then(data=>{
            
            data.rows.map(element => {
              element.is_public = element.is_public == 0 ? false : true
              element.with_badge = element.with_badge == 0 ? false : true
              element.validated = element.with_badge == 0 ? false : true
              element.filled = element.filled == 0 ? false : true
              element.active = element.active == 0 ? false : true
            });

            commit("set_tasks", data.rows)
            resolve()
          }).catch(e=>reject(e))

      })
    })
  }


  export async function fetch_goals({ app,rootState, state, commit, dispatch, getters }) {
    return new Promise(async (resolve, reject) => {
      dispatch('blockchain/getAPI', { blockchain: config.ual.rootChain }, { root: true }).then(api => {
        api.getTableRows(true, config.core, state.owner, 'goals', 'total_votes', 0, -1, 1000, "i64", 2).
          then(data=>{
            
            data.rows.map(element => {
              element.validated = element.validated == 0 ? false : true
              element.checked = element.checked == 0 ? false : true
              element.completed = element.completed == 0 ? false : true
              element.reported = element.reported == 0 ? false : true


              let el = element.voters.indexOf(rootState.auth.username)
              if (el != -1){
                element.isvoted = true 
              }
              else {
                element.isvoted = false
              }


            });
            
            // commit("set_goals", data.rows.reverse())
            resolve()
        }).catch(e => reject(e))

      }).catch(e => reject(e))

    })
  }

export function set_goal({state, commit}, {goal}){
  commit('set_goal', goal)
}

export function add_task({state, commit}, {task}){
  commit('add_task', task)
}

export function add_report({state, commit}, {report}){
  commit('add_report', report)
}



export function select({state, commit, dispatch, getters}, {item, client}){
      
      dispatch('setCursor', {item: item})
      commit('set_goal', null)

      if (this.$router.currentRoute.params.permlink != item.permlink)
        this.$router.push({params: {community: this.$router.currentRoute.params.community, author: item.author, permlink: item.permlink, type: item.meta.type}})

      if (item.meta.audio){
        dispatch('editor/setAudioToEditor', {name: item.meta.audio}, {root: true})
      } else {
        dispatch('editor/setAudioToEditor', {name: false}, {root: true})
      }

      if (item.meta.type === 'goal'){
        let g = state.goals.find(el => el.permlink == item.permlink)

        commit('set_goal', g)

        dispatch('editor/setContentToEditor', {content: item.body}, {root: true})
        
        
      } 
      else if (item.meta.type === 'audio'){
        
        dispatch('hideDrawer')
        dispatch('editor/setContentToEditor', {content: item.body}, {root: true})
        

      } else if (item.meta.type === 'doc'){
        dispatch('hideDrawer')
        dispatch('editor/setContentToEditor', {content: item.body}, {root: true})
        dispatch('editor/set_images', {images: item.meta.images || []}, {root: true})
        
      } else if (item.meta.type === 'folder'){
        dispatch('main/setLoader', {status: true}, {root: true})

        // commit('setItemsToPrevLevel', state.items)
        
        dispatch('clear')
        dispatch('pushToPath', {path: item.meta.name || item.title, item: item})
        dispatch('set_type', {type: item.meta.type})
        dispatch('fetch_posts', {client: client})

        // this.$store.dispatch('feed/pushToPath', {path: item.meta.name || item.title, item: item})
        
        // this.fetch_posts()

      }
}

export function showDrawer({state, commit}){
  commit('setDrawerStatus', true)
}

export function hideDrawer({state, commit}){
  commit('setDrawerStatus', false)
}

export function toogleDrawer({state, commit}){
  let status = !state.show
  commit('setDrawerStatus', status)
}

export function setPath({state, commit}, {path}){
  commit('setNewPath', path)
}

export function reloadLastPath({state, commit, dispatch}, {client}){
  let length = state.path.length
  
  if (length == 1){
  
    let item = state.path[length-1].item
    this.$router.push({params: {community: state.owner, author : null, permlink: null, type: null}})
    commit('setCursor', state.path[length-1].item) 
    commit('set_type', "manifest")
    commit('set_after', null)
    dispatch('fetch_posts', {client: client})
    
    //TODO RELOAD HERE!
  } else if (length > 1){
    let item = state.path[length-1].item
    // this.$router.push({params: {community: state.owner, author: item.author, permlink: item.permlink, type: item.meta.type}})
    this.$router.push({params: {community: state.owner}})

    commit('setCursor', state.path[length-1].item)     
      
  } 

  else {
    
    this.$router.push({name: 'index'}).then(() => {location.reload()})
  
  }
  
}

export function moveToPath({state, commit, dispatch }, {index, client}){
  let length = state.path.length
  
  if (length > index){
    commit('clear')
    if (config.slice_path==true){
      let newPath = state.path.slice(0, index + 1)
      commit('setNewPath', newPath)
      dispatch('setCursor', {item: newPath[state.path.length - 1].item})
      let item = newPath[state.path.length - 1].item
      this.$router.push({params: {community: state.owner, author: item.author, permlink: item.permlink, type: item.meta.type}})
      
    } 
    dispatch('set_type', {type: "folder"})
    dispatch('fetch_posts', {client: client})
    
  }
}
export function moveBack({state, commit, dispatch}, {client}){
      if (state.path.length > 0){
        commit('clear')

        
        if (config.slice_path == true){
          let newPath = state.path.slice(0, state.path.length - 1)
        
          commit('setNewPath', newPath)
          dispatch('setCursor', {item: newPath[state.path.length - 1].item})
          let item = newPath[state.path.length - 1].item
          this.$router.push({params: {community: state.owner, author: item.author, permlink: item.permlink, type: item.meta.type}})
        } else {

        }
        dispatch('set_type', {type: "folder"})
        dispatch('fetch_posts', {client: client, isMoveBack: true})
        
      }  
}

export function setItemsToCiceroneBar({state, commit}, {items}){
  items.map((item) => {
    commit('pushNewItem', item)
  })
}

export function setNeedDelItem({state, commit}, {status}){
  commit('setNeedDelItem', status)
}

export function delItem({state, commit}){
  commit('delItem')
}

export function getFolderSkeleton({state}){
  
}

export function toogleSettings({state, commit}){
  commit('toogleSettings')
}

export function showSettings({state, commit}, {show}){
  commit('showSettings', show)
}

export function pushToPath({state, commit}, {path, item}){
  commit('pushToPath', {path, item})
}
export function setCursor ({commit, state}, {item}) {
  


  commit('setCursor', item)


  // if((item.meta.type == "manifest") || (item.meta.type=="folder")){
  
  //   commit('setItemsToPrevLevel', {items: state.items})      

  // }

}


export function save({commit}, {status}){
  commit('save', status)
}

export function setNeedLoad({commit}, {status}){
  commit('setNeedLoad', status)
}
export function addNewElement({rootState, commit}, {type}){
  commit('setNeedAdd', type)  
}

export function setAdded({commit}){
  commit('setAdded')
}

export function modifyItem({commit}, {item}){
  commit('modifyItem', item)
}

export function pushNewItem({app, commit}, {item}){
  commit('pushNewItem', item)
}

export function clear({commit}){
  commit('clear')
}
export function setNeedFetchPath({commit}, {status}){
  commit('setNeedFetchPath', status)
}

export function newFolder({commit}, {folder}){
  commit('addNewFolder', folder)
}

export function showUpButton({commit}, {status}){
  commit('showUpButton', status)
}

export function openDB({state, commit}, {address}){
  commit('openDB', address)
  commit('setOpenDB', true)
}

export function setOpenDB({state, commit}, {status}){
  commit('setOpenDB', status)
}

export function sortNow({state, commit}, {status}){
  commit('sortNow', status)
}

export function setItemsToPublicBar({state, commit}, {items}){
  commit('setItemsToPublicBar', items)
}

export function setMakePublic({state, commit}, {status}){
  commit('setMakePublic', status)
}

export function setMakePrivate({state, commit}, {status}){
  commit('setMakePrivate', status)
}

export function makeItemPrivate({state, commit, dispatch}){
  commit('makeItemPrivate')
  dispatch('pushNewItem', {item: state.item})
}

export function makeItemPublic({state, commit, dispatch}){
  commit('makeItemPublic')
  dispatch('pushNewItem', {item: state.item})
}

export function showFolderDialog({state, commit}, {show}){
  commit('showFolderDialog', show)
}

export function setAccessRight({state, commit}, {right}){
  commit('setAccessRight', right)
}

export function cleanAccessRight({state, commit}){
  commit('cleanAccessRight')
}

export function addToOnline({state, commit}, {db_name}){
  commit('addToOnline', db_name)
}

export function shiftFromOnline({state, commit}){
  commit('shiftFromOnline')
}

export function modifyLastPath({state, commit}, {path, item}){
  commit('modifyLastPath', {path, item})

}

  export function set_author({ state, commit }, {author}) {
    // if (author !== state.author) commit('clear')
    commit('set_author', author)
  }

  export function set_permlink({ state, commit }, {permlink}) {
    // if (author !== state.author) commit('clear')
    commit('set_permlink', permlink)
  }

 export function set_type({ state, commit }, {type}) {
    // if (author !== state.author) commit('clear')
    commit('set_type', type)
  }


  export function set_owner({ state, commit }, {owner}) {
    // if (owner !== state.owner) commit('clear')
    commit('set_owner', owner)
  }

  export function set_parentAuthor({ state, commit }, parentAuthor) {
    // if (parentAuthor !== state.parentAuthor) commit('clear')
    commit('set_parentAuthor', parentAuthor)
  }


  export function set_order({state, commit}, orderby) {
    state.list = []
    state.after = undefined
    commit('set_orderby', orderby)
  }

  // export function fetch_blog({ app,rootState, state, commit, dispatch }, {author}) {
  //   commit('setCu')
  // }


  export async function getManifest({app, commit, dispatch}, {client, owner}){
    return new Promise(async (resolve, reject) =>{
      let options = {
        first: 1,
        blockchain: "uni",
        owner: owner,
        author: owner,
        parentAuthor: owner,
        parentPermlink: "",
        permlink: ""
      }

    let { data } = await client.query({query: COMMENT_QUERY, variables: options, fetchPolicy: 'network-only'})

    let manifests = data.posts.edges.map(p => p.node)
    let manifests_deep_copy = JSON.parse(JSON.stringify(manifests))

    if (manifests_deep_copy.length > 0){
      manifests_deep_copy[0]['parent_permlink'] = manifests_deep_copy[0]['parentPermlink']
      manifests_deep_copy[0]['parent_author'] = manifests_deep_copy[0]['parentAuthor']
      manifests_deep_copy[0]['comments_is_enabled'] = manifests_deep_copy[0]['commentsIsEnabled']

      delete manifests_deep_copy[0]['commentsIsEnabled']
      delete manifests_deep_copy[0]['parentAuthor']
      delete manifests_deep_copy[0]['parentPermlink']

      commit('setManifest', manifests_deep_copy[0])
      resolve(manifests_deep_copy[0])
    }
    else {
      resolve(false)
    }

    })
  }

  export function setManifest({commit}, {manifest}){
    commit('setManifest', manifest)
  }

  export async function fetch_discuss({ app,rootState, state, commit, dispatch, getters, rootGetters }, {client, owner, parentPermlink, parentAuthor, permlink, orderBy, meta, after, fetch_single_comment, tags}) {
    return new Promise(async (resolve, reject) => {
      
      let options = {
        first: 10,
        after: after == 0 ? null : state.after,
        owner: owner,
        blockchain: config.ual.rootChain,
        orderby: orderBy,
        // permlink: permlink,
        parentPermlink: parentPermlink,
        parentAuthor: parentAuthor,
        meta: meta,
      }
      // console.log("options on fetch", options)
      var { data } = await client.query({query: COMMENT_QUERY, variables: options, fetchPolicy: 'network-only'})

      let posts = data.posts.edges.map(p => p.node)
      if (posts.length >0){
        // console.log('set_after', data.posts.edges[data.posts.edges.length - 1].cursor)
        commit('set_after', data.posts.edges[data.posts.edges.length - 1].cursor)
      }

      posts = JSON.parse(JSON.stringify(posts))
      posts = dispatch("patch_posts", {postsc: posts})

      // console.log("POSTS", posts)
      resolve(posts)

    })
  }


  export async function fetch_post({ app,rootState, state, commit, dispatch, getters, rootGetters }, {client, author, permlink}) {
    return new Promise(async (resolve, reject) => {
      
      let options = {
        first: 1,
        author: author,
        blockchain: config.ual.rootChain,
        orderBy: 'created_ASC',
        permlink: permlink
      }
      console.log("CLIENT", client)
      // console.log("options on fetch", options)
      var { data } = await client.query({query: COMMENT_QUERY, variables: options, fetchPolicy: 'network-only'})

      let posts = data.posts.edges.map(p => p.node)
      
      posts = JSON.parse(JSON.stringify(posts))
      posts = dispatch("patch_posts", {postsc: posts})

      // console.log("POSTS", posts)
      resolve(posts)

    })
  }


  export async function fetch_mainDiscuss({ app,rootState, state, commit, dispatch, getters, rootGetters }, {client, owner, author, orderBy}) {
    return new Promise(async (resolve, reject) => {
      
      let options = {
        first: 100,
        after: state.after,
        owner: owner,
        blockchain: config.ual.rootChain,
        orderby: orderBy,
        parentPermlink: "",
        author: author
      }

      var { data } = await client.query({query: COMMENT_QUERY, variables: options, fetchPolicy: 'network-only'})

      let posts = data.posts.edges.map(p => p.node)
      posts = JSON.parse(JSON.stringify(posts))
      posts = dispatch("patch_posts", {postsc: posts})

      resolve(posts)

    })
  }

    export function patch_posts({}, {postsc}){

    postsc.map((el, index) => {
      try{
        if (el){
          if (el.meta.type == 'manifest'){
          
            postsc.splice(index, index+1)
          
          } else {

            postsc[index]['parent_permlink'] = postsc[index]['parentPermlink']
            postsc[index]['parent_author'] = postsc[index]['parentAuthor']
            postsc[index]['comments_is_enabled'] = postsc[index]['commentsIsEnabled']
            postsc[index]['is_encrypted'] = postsc[index]['isEncrypted']
            postsc[index]['public_key'] = postsc[index]['publicKey']
            

            delete postsc[index]['commentsIsEnabled']
            delete postsc[index]['parentAuthor']
            delete postsc[index]['parentPermlink']

            delete postsc[index]['isEncrypted']
            delete postsc[index]['publicKey']
            

            el.body = el.body != "" ? JSON.parse(el.body) : el.body

            if (el.comments.length > 0){
              el.comments.map((el2, index2) => {
                postsc[index].comments[index2]['parent_permlink'] = postsc[index].comments[index2]['parentPermlink']
                postsc[index].comments[index2]['parent_author'] = postsc[index].comments[index2]['parentAuthor']
                postsc[index].comments[index2]['comments_is_enabled'] = postsc[index].comments[index2]['commentsIsEnabled']
                postsc[index].comments[index2]['is_encrypted'] = postsc[index].comments[index2]['isEncrypted']
                postsc[index].comments[index2]['public_key'] = postsc[index].comments[index2]['publicKey']
                

                delete postsc[index].comments[index2]['commentsIsEnabled']
                delete postsc[index].comments[index2]['parentAuthor']
                delete postsc[index].comments[index2]['parentPermlink']

                delete postsc[index].comments[index2]['isEncrypted']
                delete postsc[index].comments[index2]['publicKey']
                
                
                el2.body = el2.body != "" ? JSON.parse(el2.body) : el2.body
              })

            }

          }
        }
      } catch(e){
        
        postsc.splice(index, index+1)
      }  
    })
    return postsc
  }

  export async function fetch_posts({ app,rootState, state, commit, dispatch, getters, rootGetters }, {client}) {
    return new Promise(async (resolve, reject) => {

    var type = state.type
    let order_by = getters.getLastPath.item.meta.sortby
    
    let options = {

      first: 100,
      after: state.after,
      owner: this.$router.currentRoute.params.community,
      author: this.$router.currentRoute.params.author,
      blockchain: "uni",
      orderby: order_by
    }

    if (!type){
      if (state.author){
        
        type = "blog"
      } else {
        type="manifest"
      }
    } else if (type=='folder'){
      options.parentPermlink = state.item.permlink
    
    } else if (type == "manifest"){
      options.parentPermlink = ""
    } else if(type) {
      if (state.author){
        options.author = state.author
        if (state.permlink){
          options.permlink = state.permlink
        }
      }
    } 


    try{
      var { data } = await client.query({query: COMMENT_QUERY, variables: options, fetchPolicy: 'network-only'})
    } catch(e){
      dispatch('main/setLoader', {status: false}, {root: true})
      reject(e)
    }

    let posts = data.posts.edges.map(p => p.node)
    let postsc = JSON.parse(JSON.stringify(posts))
    

    postsc.map((el, index) => {
      try{
        if (el){
          if (el.meta.type == 'manifest'){
          
            postsc.splice(index, index+1)
          
          } else {

            postsc[index]['parent_permlink'] = postsc[index]['parentPermlink']
            postsc[index]['parent_author'] = postsc[index]['parentAuthor']
            postsc[index]['comments_is_enabled'] = postsc[index]['commentsIsEnabled']
            postsc[index]['is_encrypted'] = postsc[index]['isEncrypted']
            postsc[index]['public_key'] = postsc[index]['publicKey']
            

            delete postsc[index]['commentsIsEnabled']
            delete postsc[index]['parentAuthor']
            delete postsc[index]['parentPermlink']

            delete postsc[index]['isEncrypted']
            delete postsc[index]['publicKey']
            

            el.body = el.body != "" ? JSON.parse(el.body) : el.body
            
            try{
              el.meta.images = JSON.parse(el.meta.images)  
            } catch(e){
              el.meta.images = []
            }
            

            if (el.comments.length > 0){
              el.comments.map((el2, index2) => {
                postsc[index].comments[index2]['parent_permlink'] = postsc[index].comments[index2]['parentPermlink']
                postsc[index].comments[index2]['parent_author'] = postsc[index].comments[index2]['parentAuthor']
                postsc[index].comments[index2]['comments_is_enabled'] = postsc[index].comments[index2]['commentsIsEnabled']
                postsc[index].comments[index2]['is_encrypted'] = postsc[index].comments[index2]['isEncrypted']
                postsc[index].comments[index2]['public_key'] = postsc[index].comments[index2]['publicKey']
                

                delete postsc[index].comments[index2]['commentsIsEnabled']
                delete postsc[index].comments[index2]['parentAuthor']
                delete postsc[index].comments[index2]['parentPermlink']

                delete postsc[index].comments[index2]['isEncrypted']
                delete postsc[index].comments[index2]['publicKey']
                
                
                el2.body = el2.body != "" ? JSON.parse(el2.body) : el2.body
              })

            }

          }
        }
      } catch(e){
        postsc.splice(index, index+1)
      }  
    })


    //select first item if have
    dispatch('setItemsToCiceroneBar', {items:state.items.concat(postsc)})
    dispatch('main/setLoader', {status: false}, {root: true})
    
    
    if (postsc.length > 0) {
        
        // if (state.prevItems.length == 0) {
        //     commit('setItemsToPrevLevel', postsc)
        // } 

      
      commit('set_after', data.posts.edges[data.posts.edges.length - 1].cursor)
      
      
      if (((type=="blog") || (type=="manifest") || (type=="folder")) && !rootGetters['main/isMobile'] || ((type =='doc')  || (type =='goal') || (type =='audio'))) {
        if (this.$router.currentRoute.params.permlink){
          postsc = postsc.reverse()
          let fitem = postsc.find(el => {
            return el.meta.type !='folder'
          })
          
            
          if (state.permlink){
            dispatch('select', {item: fitem, client: client}) 
          }

          
        }
      } else {

      }
      
      if (!rootGetters['main/isMobile'])
        dispatch('select', {item: postsc[postsc.length-1], client: client}) 

    }

    

   resolve(postsc)
    })
  }

