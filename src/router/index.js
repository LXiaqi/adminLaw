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
        {path: '/serviceLogoinList', name: 'serviceLogoinList', component: page('waiter/serviceLogoinList'),meta:{title:'客服坐席'}},
        {path: '/statements', name: 'statements', component: page('statements'),meta:{title:'语句管理'}},
        {path: '/record', name: 'record', component: page('chatadmin/record'),meta:{title:'聊天记录'}},
        {path: '/details', name: 'details', component: page('chatadmin/details'),meta:{title:'接待详情'}},
        {path: '/label', name: 'label', component: page('label'),meta:{title:'标签管理'}},
        {path: '/leaveMsg', name: 'leaveMsg', component: page('leaveMsg'),meta:{title:'留言管理'}},
        {path: '/now', name: 'now', component: page('chat/now'),meta:{title:'在线客服'}},
        {path: '/history', name: 'history', component: page('chat/history'),meta:{title:'历史会话'}},

      ]
    },
    {path: '/login', name: 'login', component: page('login')},
   
   
  ]
})
