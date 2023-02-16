export function setContentToEditor ({ state, dispatch, commit }, { content }) {
  commit('setContent', content)
}

export function needClean({commit}, {status}){
  commit('needClean', status)
}

export function needUpdate({commit}, {status}){
  commit('needUpdate', status)
}
export function set_images({commit}, {images}){
  commit('set_images', images)
}

export function clear({commit}){
  commit('clear')
}
export function setJSON({commit}, {json}){
  commit('setJSON', json)
}
export function setHTML({commit}, {html}){
  commit('setHTML', html)
}
export function setItems({commit}, {items}){
  commit('setItems', items)
}

export function setKey({commit}, { key }){
  commit('setKey', key)
}

export function showEditor({commit}, {status}){
  commit('showEditor', status)
}

export function setAudioToEditor({commit}, {name}){
commit('setAudioToEditor', name)
}