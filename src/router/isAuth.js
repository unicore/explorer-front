export default async function isAuth ({ next, store, to }){

  if (store.state.auth.username && store.getters['auth/isAuth'])
     next()
  else {
   next({ //not a partner
         name: 'be-participant',
         params: {
            community: to.params.community,
            back_to: to.name,
            params: to.params
         },
         props: true
      })
    }
}
