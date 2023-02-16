export default async function isPartner ({ next, store, to }){
    
    let menu = store.getters['host/get_menu']
    let menuel = menu.find(el => el.route_name == to.name)

    // var menu = state.cmscontent.find(el => el.type == "menu")

    if (to.params.community && menuel && menuel.middleware) {
      // if (to.params.community != store.state.host.username)
      //   await store.dispatch('host/get_conditions', {hostname: to.params.community})

      if (store.state.auth.username && store.getters['auth/isAuth']) {
        if (to.params.community == store.state.auth.partner.hostname && store.state.auth.partner.isPartner){
          next()  

        } else {
          store.dispatch('auth/getPartnerStatus', {hostname: to.params.community, partner: store.state.auth.username}).then(res => {
            
            if (store.state.main.isEducation)
              next()
            else if (store.state.auth.isPartner)
              next()
            else if (to.params.community == store.state.auth.username) 
              next()
            else next({ //not a partner
                 name: 'be-partner',
                 params: {
                  community: to.params.community,
                  back_to: to.name,
                  params: to.params
                 },
                 props: true
              })          
          })
        }
        
      } else if (store.state.main.isEducation)
            next()
        else next({ //dont have auth
             name: 'registrator',
             params: {
              community: to.params.community,
              back_to: to.name,
              params: to.params
             },
             props: true
          })
    } else next() //pass if to is not community
   }