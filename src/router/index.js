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
      meta:{title:'首页'},
      children: [
        {path: '/', name: 'home', component: Home,},
        {path: '/account', name: 'account', component: page('waiter/account'),meta:{title:'客服账号'}},
        {path: '/serviceLogoinList', name: 'serviceLogoinList', component: page('waiter/serviceLogoinList'),meta:{title:'客服账号'}},
        {path: '/statements', name: 'statements', component: page('statements')},
        {path: '/record', name: 'record', component: page('chatadmin/record')},
        {path: '/details', name: 'details', component: page('chatadmin/details')},
      ]
    },
    {path: '/login', name: 'login', component: page('login')},
   
   
  ]
})
