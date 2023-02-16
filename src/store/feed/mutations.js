
export function setManifest(state, manifest){
  state.manifest = manifest
}

export function setCursor (state, item) {
  
  state.item = item
}
export function delItem(state){
  let filtered = state.items.filter(fitem => {
    return fitem.permlink !== state.item.permlink
  })
  state.items = filtered
}

export function save(state, status){
  state.needSave = status
}
export function modifyLastPath(state, obj){
  state.path[state.path.length - 1].path = obj.path
  state.path[state.path.length - 1].item = obj.item  
}


export function setItemsToPrevLevel(state, items){
  state.prevItems = items
}

export function pushNewItem(state, item){
  let exist = state.items.find(it => it.permlink === item.permlink && it.author === item.author)
  if (exist){
    let items = state.items
    state.items = []
    state.items = items
    state.items.map((el, index) => {
      
      if ((el.author === item.author) && (el.permlink === item.permlink)) {
        // el = item
        delete state.items[index]; 
        state.items[index] = item
      } 
    })
  } else {
    state.items.unshift(item)  
  }
  
}
// export function clear(state){
//   state.items = []
//   // state.item = null
// }
export function modifyItem(state, item){
  state.items.map(sitem =>{

    if ((sitem.author === item.author) && (sitem.permlink === item.permlink)) {
      sitem.title = item.title
      sitem.permlink = item.permlink
      sitem.meta = item.meta
      sitem.body = item.body
      sitem.parent_permlink = item.parent_permlink
      sitem.owner = item.owner
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

  export function set_goals(state, goals){
    state.goals = goals
  }

  export function set_cfund(state, cfund){
    state.cfund = cfund
  }

  export function set_goal(state, goal){
    if ((state.goal) && (goal)){
      if ((state.goal.host == goal.host) && (state.goal.id == goal.id)){
        state.goal = Object.assign(state.goal, goal);
      } else state.goal = goal 
    } else state.goal = goal
  }

  export function add_task(state, task){
    state.tasks.push(task)
  }

  export function add_report(state, report){

    let exist = state.reports.find(el => el.task_id == report.task_id && el.username == report.username && el.goal_id == report.goal_id)
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



  export function set_reports(state, reports){
    state.reports = reports
  }

  export function set_tasks(state, tasks){
    state.tasks = tasks
  }

  export function set_orderby (state, orderby) {
    state.orderby = orderby
  }

  export function clear (state) {
    state.items = []
    // state.item = undefined
    state.after = undefined
    // state.author = undefined
    // state.owner = undefined
  }

  export function set_owner(state, owner){
    state.owner = owner
  }
  
  export function set_parentAuthor(state, parentAuthor){
    state.parentAuthor = parentAuthor
  }

  export function set_author (state, author) {
    state.author = author
  }
  export function set_permlink (state, permlink) {
    state.permlink = permlink
  }

  export function set_type (state, type) {
    state.type = type
  }


  export function set_after (state, after) {
    state.after = after
  }