import { Platform } from 'quasar'

export function getTours(state){
  return state.tours
}

export function getCurrentCommunity(state){
  return state.community
}

export function isMobile(state){
 return state.isMobile
}



export function getRootContent(state){
 let mainpage = state.root_content.find(el => el.type == "mainpage")
 if (mainpage)
  return mainpage.content
 else return {}

}


