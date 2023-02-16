// your main.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueYandexMetrika from 'vue-yandex-metrika'                               
import config from '@/config'

import routes from '@/router/routes'
const router = new VueRouter(routes) // your routes

const env = config.prod == true ? 'production' : 'development'

let options = {
    id: config.yandex_metrika_id,
    router: router,
    env: env
    
}

Vue.use(VueYandexMetrika, options)