import Vue from 'vue'
import Router from 'vue-router'

import AppView from '@/components/app-view'
import Home from '@/pages/home'

Vue.use(Router)

const page = name => () => import('@/pages/' + name)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '',
      component: AppView,
      children: [
        {path: '/', name: 'home', component: Home},
        {path: '/account', name: 'account', component: page('waiter/account')},
        {path: '/serviceLogoinList', name: 'serviceLogoinList', component: page('waiter/serviceLogoinList')},
        {path: '/statements', name: 'statements', component: page('statements')},
      ]
    },
    {path: '/login', name: 'login', component: page('login')},
   
   
  ]
})
