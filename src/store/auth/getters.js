import config from '../../config'

export function isAuth (state) {
  return state.isAuth
}

export function isOwner (state) {
  return state.isAuth && state.community === state.username
}

export function isParticipant (state) {
  return state.isAuth && state.isParticipant
}

export function getWif (state) {
  return state.wif
}

export function isWriter(state) {
  let isAuthed = state.isAuth
  let isAuthor = state.username === config.author
  return isAuthor && isAuthed
}
    