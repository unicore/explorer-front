export function getItems (state) {
  let items = JSON.parse(JSON.stringify(state.items))

  items.sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });
  return items
}

export function getPathCursor(state){
  if ((state.item.module == 'cicerone') && (state.item.content_type == 'folder')){

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