const menus = [
  {id: 'home', label: '首页', path: '/', icon: 'fa fa-dashboard'},
  {
    id: 'waiter',
    icon: 'fa fa-circle-o',
    label: '客服管理',
    submenu: [
      {id: 'account', name: 'account', label: '客服账号'},
      {id: 'serviceLogoinList', name: 'serviceLogoinList', label: '客服坐席'},
    ]
  },
  {id: 'statements', label: '语句管理', path: '/statements', icon: 'fa fa-dashboard'},
  
]
export default menus
