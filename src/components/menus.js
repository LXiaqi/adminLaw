const menus = [
  // {id: 'home', label: '首页', path: '/', icon: 'fa fa-dashboard'},
  {id: 'statements', label: '语句管理', path: '/statements', icon: 'fa fa-dashboard'},
  {id: 'label', label: '标签管理', path: '/label', icon: 'fa fa-dashboard'},
  {
    id: 'waiter',
    icon: 'fa fa-circle-o',
    label: '客服管理',
    submenu: [
      {id: 'account', name: 'account', label: '客服账号'},
      {id: 'serviceLogoinList', name: 'serviceLogoinList', label: '客服坐席'},
    ]
  },
  {
    id: 'chatadmin',
    icon: 'fa fa-circle-o',
    label: '聊天管理',
    submenu: [
      {id: 'record', name: 'record', label: '聊天记录'},
      {id: 'details', name: 'details', label: '接待详情'},
    ]
  },
]
export default menus
