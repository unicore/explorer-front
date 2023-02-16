export default async function isArch ({ next, store, to }){
    if (to.params.community) {
      
      if (store.state.auth.username && store.getters['auth/isAuth']){
        if (to.params.community == store.state.auth.username) 
         next()
        else next({ //not a partner
             name: 'be-arch'
          })
      } else next({ //dont have auth
             name: 'be-arch'
          })
    } else next() //pass if to is not community
   }