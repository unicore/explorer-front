export function setContent (state, content) {
  state.content = content
}


export function needClean(state, status){
  state.needClean = status
}

export function needUpdate(state, status){
  state.needUpdate = status
}
export function set_images(state, images){
  state.images = images
}
export function clear(state){
  state.content = null
  state.images = []
  state.json = {}
  state.html = null
  state.audio = false
}

export function setHTML(state, html) {
  state.html = html
}

export function setJSON(state, json){
  state.json = json
}
export function setItems(state, items){
  state.items = items
}

export function setKey(state, key){
  state.key = key
}

export function showEditor(state, status){
  state.show = status
}

export function setAudioToEditor(state, name){
  state.audio = name
}