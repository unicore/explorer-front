
export function setCursor (state, item) {
  
  state.item = item
}
export function delItem(state){
  let filtered = state.items.filter(fitem => {
    return fitem._id !== state.item._id
  })
  state.items = filtered
}

export function save(state, status){
  state.needSave = status
}

export function pushNewItem(state, item){
  let exist = state.items.find(it => it._id === item._id)
  if (exist){
    state.items.map((el, index) => {
      if (el._id === item._id){
        // el = item
        state.items[index] = item
      } else {
      }
    })
  } else {
    state.items.unshift(item)  
  }
  
}
export function clear(state){
  state.items = []
  // state.item = null
}
export function modifyItem(state, item){
  state.items.map(sitem =>{
    if (sitem._id === item._id){
      sitem.db_name = item.db_name
      sitem.publishedAt = item.publishedAt
    }
  })
}

export function setNeedLoad(state, loadStatus){
  state.needLoad = loadStatus
}

export function setNeedDelItem(state, delStatus){
  state.needDelete = delStatus
}

export function setNeedAdd(state, type){
  state.needAdd.flag = true
  state.needAdd.type = type
}

export function setAdded(state){
  state.needAdd.flag = false
  state.needAdd.type = ''
}

export function setNeedFetchPath(state, status){
  state.needFetchPath = status
}
export function addNewFolder(state, folder){
  state.newFolder = folder
}

export function pushToPath(state, path){
  state.path.push(path)
}

export function setNewPath(state, path){
  state.path = path
}

export function showUpButton(state, status){
  state.showUpButton = status
}

export function openDB(state, address){
  state.needOpen.address = address
}

export function setOpenDB(state, status){
  state.needOpen.flag = status
  // state.needOpen.address = ''
}

export function setDrawerStatus(state, status){
  state.show = status
}

export function showSettings(state, show){
  state.showSettings = show
}

export function toogleSettings(state){
  state.showSettings = !state.showSettings
}

export function sortNow(state, status){
  state.sortNow = status
}

export function setItemsToPublicBar(state, items){
  state.public = items
}

export function setMakePublic(state, status){
  state.makePublic = status
}

export function setMakePrivate(state, status){
  state.makePrivate = status
}


export function makeItemPublic(state){
  state.item.isPrivate = false
}

export function makeItemPrivate(state){
  state.item.isPrivate = true
}

export function showFolderDialog(state, show){
  state.showFolderDialog = show
}

export function setAccessRight(state, right){
  state.accessRight[right.type] = right.rule

}

export function cleanAccessRight(state){
  state.accessRight = {
    read: false,
    write: false,
    admin: false
  }
}

export function addToOnline(state, db_name){
  state.dbs_online.push(db_name)
}

export function shiftFromOnline(state){
  state.dbs_online.shift()
}