import isPartner from './isPartner'

const routes = [
  {
    path: '/:query?',
    component: () => import('layouts/simple.vue'),
    name: 'base',
    children: [
        { path: '', name:'home',component: () => import('components/Explorer/index.vue')}
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
