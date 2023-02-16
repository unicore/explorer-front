export function getItems (state, getters) {
  let items = JSON.parse(JSON.stringify(state.items || []))
  let last_path = getters.getLastPath
  
  if (last_path){
    let sortby = getters.getLastPath.item.meta.sortby
  
    if (sortby == "priority_DESC"){
      items.sort((a, b) => b.priority - a.priority)
    }

    if (sortby == "priority_ASC"){
      items.sort((a, b) => a.priority - b.priority)
    }
    
    if (sortby == "created_DESC"){
      items.sort((a, b) => new Date(b.created) - new Date(a.created))
    }
    
    if (sortby == "created_ASC"){
      items.sort((a, b) => new Date(a.created) - new Date(b.created))
    }

    // items.map((el, index) => {
    //   el.next = items[index + 1 ] ? 
    //         items[index+1] : undefined
      
    //   el.prev = items[index - 1 ] ? 
    //         items[index-1] : undefined
    // })
          
  }
  
  return items
  

  
}

export function getPrev(state, getters){
    let cursor = state.item
    
    if (!cursor)
      return null
    let items = getters.getItems
    var index 
    
    items.map((item, idx) => {
      if (item.permlink == cursor.permlink){
        index = idx
      }
    })

    if (index > 0)
      if (items[index-1])
        return items[index - 1]
    
    return null
}


export function getNext(state, getters){
    let cursor = state.item
    if (!cursor)
      return null
    let items = getters.getItems
    
    var index 
    
    items.map((item, idx) => {
      if (item.permlink == cursor.permlink){
        index = idx
      }
    })


    if (items[index+1])
      return items[index + 1]
    else return null
}

export function getPathCursor(state){
  if ((state.item.meta.type == 'cicerone') && (state.item.content_type == 'folder')){

    return state.item
  } else {
    let _id = state.item.parent_db.split('/')[3]
    return _id
 
  }

  return state.path[state.path.length - 1].item
}
export function getPrevFullPath(state){
  return state.path[state.path.length - 2]
}

export function getContentDBParams(state){
  return state.db
}

export function getLastPath(state){
  
  return state.path[state.path.length - 1]
}
