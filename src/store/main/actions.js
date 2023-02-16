export function setIsMobile({state, commit}, {isMobile}){
  commit('setIsMobile', isMobile)
}

export function setSignProcess({state, commit}, {status}){
  commit('setSignProcess', status)
}

export function nextStep({state, commit}){
  commit('nextStep')
}

export function setStep({state, commit}, {step}){
  commit('setStep', step)
}


export function clearBackTo({state, commit}){
  commit('clearBackTo')
}

export function setBackTo({state, commit}, {back_to, back_to_params}){
  commit('setBackTo', {back_to, back_to_params})
}

export function setLoader({state, commit}, {status}){
  commit('setLoader', status)
}

export function setProcessTour({state, commit}, {tour}){
  console.log("setProcessTour", tour)
  commit('setProcessTour', tour)
}

export function leftDrawer({state, commit}, {status}){
  commit('leftDrawer', status)
  // if (status == true)
  //   commit('rightDrawer', false)
}

export function rightDrawer({state, commit}, {status}){
    console.log('on set rightDrawer', status)

  commit('rightDrawer', status)
  // if (status == true)
  //   commit('leftDrawer', false)
}

export function set_rootcontent({state, commit}, {content}){
  commit('set_rootcontent', content)

}


export function setIsSingleEdu({commit}, {status}){
  commit('setIsSingleEdu', status)
}


export function setisEducation({commit}, {isEducation}){
  console.log("SetIsEducation", isEducation)
  commit('setisEducation', isEducation)
}


export function showDescriptor({commit}, {status}){
  commit('showDescriptor', status)
}

export function setRegComplete({state, commit}){
  commit('setRegComplete')
}


export function isFirstEnter({commit, state}){
  commit('setFirstEnter')
}

export function setStatusBar({commit, state}, {status}){
  commit('setStatusBar', status)
}

export function clearTours({commit, state}){
  commit('setTours', {
    homeTour: false,
    menuTour: false,
    coreTour: false,
    lifeTour: false,
    tasksTour: false,
    p2pTour: false,
    stakingTour: false,
    lifeTasksTour: false,
  })
}

export function setTours({commit, state}, {tours}){
  commit('setTours', tours)
}

export function setRenderGlobe({commit, state}, {status}){
  commit('setRenderGlobe', status)
}

export function setActiveCommunity({commit, state}, {community, cmsconfig}){
  commit('setActiveCommunity', community)
  commit('setCMSConfig', cmsconfig)
}

export function set_enter_point({state, commit}, {name, params}){
  commit('set_enter_name', name)
  commit('set_enter_params', params)
}

export function getCMSConfig({commit, state, dispatch}, {community, blockchain, core}){
  return new Promise((resolve, reject) => {
    dispatch('blockchain/getAPI', { blockchain:  blockchain}, { root: true }).then(api => {
      api.getTableRows(true, core, community, 'cmsconfig', 'id', 0, -1, 1000).then(cmsconfig => {
        if (cmsconfig.rows.length == 0){
          resolve(null)
        }
        else{
          resolve(JSON.parse(cmsconfig.rows[0].config))
        }

      }).catch(e => reject(e))
    })  
  })
}



export function clear_proj_route ({commit, state, dispatch}) {
  commit('clear_proj_route')
}


export function slice_proj_route ({commit, state, dispatch}) {
  commit('slice_proj_route')
}

export function slice_proj_after ({commit, state, dispatch}, {route}) {
  commit('slice_proj_after', route)
}





export function set_last_proj_route({rootState, commit}, {route}) {
  let data = {route: route, rootState: rootState}
  commit('set_last_proj_route', data)
}


export function set_last_route({rootState, commit}, {route}) {
  let data = {route: route, rootState: rootState}
  commit('set_last_route', data)
}

export function is({route}, {what}){
  
}