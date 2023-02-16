export function setIsMobile(state, isMobile){
  state.isMobile = isMobile
}

export function setIsSingleEdu(state,singleEdu){
  state.singleEdu = singleEdu
}

export function setSignProcess(state, status){
  state.signProcess = status
}

export function setStep (state, step) {
  state.step = step
}

export function setProcessTour (state, tour) {
  state.processTour = tour
}

export function setBackTo (state, back) {
  state.back_to = back.back_to
  state.back_to_params = back.back_to_params
}

export function clearBackTo (state, back) {
  state.back_to = null
  state.back_to_params = {}
}





export function set_last_proj_route (state, data) {
  
  let route = data.route
  let rootState = data.rootState

  let ex = state.history.find(el => el.name == route.name && el.params.community == route.params.community)
  let tmp = state.history

  


  if (tmp.length == 0 || !ex) {

    tmp.push({name: route.name, params: route.params})

  } else if (ex){
    var idx
    console.log('slice_proj1', tmp)
    console.log('ex', ex)  
    tmp.map((el, index) => {
      if (el.name == route.name && el.params.community == route.params.community)
        idx = index
    })

    tmp = tmp.slice(0, idx + 1)

    console.log('slice_proj2', tmp)
  }



  state.history = tmp
  
}



export function clear_proj_route (state) {
  state.history = []
}



export function slice_proj_after (state, route) {
  var idx

  state.history.map((el, index) => {
    if (el.name == route.name && el.params.community == route.params.community)
      idx = index
  })

  state.history = state.history.slice(0, idx)
}

export function slice_proj_route (state) {
  
  state.history = state.history.slice(0, state.history.length - 1)

}



export function set_last_route (state, data) {
  
  // let route = data.route
  // let rootState = data.rootState

  // let ex = state.history.find(el => el.name == route.name)
  // let tmp = state.history

  // console.log('set_last_route', rootState)


  // if (tmp.length == 0 && rootState.host.site_type == 'platform') {

  //   tmp.push({name: 'home'})

  // } else if (tmp.length == 0 && rootState.host.site_type == 'simple' && route.params.community && route.name != rootState.host.target_page) {

  //   tmp.push({name: rootState.host.target_page, params: route.params})
  
  // }

  // if (ex) {

  //   tmp.map((el, index) => {
      
  //     if (el.name == route.name) {
  //       tmp[index] = route

  //       console.log('state.history.slice', tmp.slice(0, index + 1))
  //       tmp = tmp.slice(0, index + 1)
  //     }



  //   })

  // } else if (route.mathed[0]['path'] == "/:community?") {
  //   tmp.push(route) 
  // }


  // state.history = tmp
  // console.log('state.history', state.history)
}

export function nextStep (state) {
  state.step = state.step + 1
}

export function showDescriptor(state, status){
  state.showDescriptor = status
}

export function leftDrawer(state, status){
  state.leftDrawer = status
}
export function rightDrawer(state, status){

  console.log('on set rightDrawer', status)
  
  state.rightDrawer = status
}
export function set_rootcontent(state, content){
  state.root_content = content

}

export function setisEducation(state, status){
  state.isEducation = status
}

export function set_enter_name(state, name){

  state.enter_name = name
}

export function set_enter_params(state, params){
  state.enter_params = params
}




export function setLoader(state, status){
  state.loading = status
  // if (status == false){
  //   let current_time = new Date().getTime()
  //   if (current_time - state.loading_start_at > 3000){ 
  //     state.loading = status
  //   } else {
  //     setTimeout(() => state.loading = status, 1000);
  //   }

  // } else {
  //   state.loading_start_at = new Date().getTime()
  //   state.loading = status
  // }
  
  
}

export function setRegComplete(state){
  state.regComplete = true
}

export function setFirstEnter(state) {
  state.isFirstEnter = false
}

export function setStatusBar(state, status){
  state.statusBar = status
}


export function setTours(state, tours){
  state.tours = tours
}

export function setRenderGlobe (state, status){
  state.renderGlobe = status
}

export function setActiveCommunity(state, community){
  state.community = community
}

export function setCMSConfig(state, CMSConfig){
  state.cmsconfig = CMSConfig
}