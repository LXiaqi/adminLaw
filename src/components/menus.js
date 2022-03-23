const menus = [
  // {id: 'home', label: '在线客服', path: '/', icon: 'fa fa-dashboard'},
  {
    id: "chat",
    icon: "fa fa-circle-o",
    label: "在线客服",
    submenu: [
      { id: "newChat", name: "newChat", label: "在线客服" },
      // {id: 'now', name: 'now', label: '在线客服'},
      { id: "history", name: "history", label: "历史会话" }
    ]
  },
  {
    id: "navigation",
    label: "导航管理",
    path: "/navigation",
    icon: "fa fa-dashboard"
  },
  {
    id: "language",
    label: "语句管理",
    icon: "fa fa-dashboard",
    submenu: [
      { id: "statements", name: "statements", label: "快捷话术" },
      { id: "knowledge", name: "knowledge", label: "知识库" }
    ]
  },
  { id: "label", label: "标签管理", path: "/label", icon: "fa fa-dashboard" },
  {
    id: "leaveMsg",
    label: "留言管理",
    path: "/leaveMsg",
    icon: "fa fa-dashboard"
  },
  {
    id: "waiter",
    icon: "fa fa-circle-o",
    label: "客服管理",
    submenu: [
      { id: "account", name: "account", label: "客服账号" },
      { id: "serviceLogoinList", name: "serviceLogoinList", label: "客服坐席" }
    ]
  },
  {
    id: "chatadmin",
    icon: "fa fa-circle-o",
    label: "聊天管理",
    submenu: [
      { id: "record", name: "record", label: "聊天记录" },
      { id: "details", name: "details", label: "接待详情" }
    ]
  },
  {
    id: "dailyissue",
    label: "日常问题",
    path: "/issue",
    icon: "fa fa-dashboard"
  }
];
export default menus;
