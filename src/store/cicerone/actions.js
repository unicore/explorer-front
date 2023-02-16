import { uid } from 'quasar'
import config from '@/config/index'
// import router from '@/router'

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

export function reloadLastPath({state, commit}){
  let length = state.path.length
  if (length > 0)
    commit('setCursor', state.path[length-1].item)     
  else {
    this.$router.push({name: 'index'}).then(() => {location.reload()})
    // location.reload()
  }
  
}

export function moveToPath({state, commit}, {index}){
  let length = state.path.length
  if (length > index){
    if (config.slice_path==true){
      //TODO if cut path on click - do it
      let newPath = state.path.slice(0, index + 1)
      commit('setNewPath', newPath)
      commit('setCursor', newPath[newPath.length - 1].item)

    } else {
      commit('setCursor', state.path[index].item)    
      
    }

    commit('setNeedFetchPath', true)
    
  }
}
export function moveBack({state, commit}){
      if (state.path.length > 0){
        if (config.slice_path == true){
          let newPath = state.path.slice(0, state.path.length - 1)
          commit('setNewPath', newPath)
          if (newPath[state.path.length - 1])
            commit('setCursor', newPath[state.path.length - 1].item)
        } else {

        }

        commit('setNeedFetchPath', true)

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
export function setCursor ({commit}, {item}) {
  commit('setCursor', item)
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
