import Vue from 'vue'
const state = {
  greetingsMsg:'',// s首问语
  adduser:{},// 新用户加入会话
  newMsg:{}, // 接收新消息
  sendMsg:{}, // 发送消息
  userinfo:{}, //用户信息
  sendImg:{}, // 发送图片消息
  sendshow:{}, // 发送消息显示
  sendImgshow:{}, // 发送图片消息显示
  receiveShow:{}, // 接收私聊消息的展示
  receiveImgShow:{}, // 接收图片私聊消息的展示
  selectreaceid:''
}
const getters = {
  GetMsgs:state => state.greetingsMsg,
  getadduser:state => state.adduser,
  getuserinfo:state => state.userinfo,
  getsendMsg:state => state.sendMsg,
  getsendImg:state => state.sendImg,
  getsendshow:state => state.sendshow,
  getsendImgshow:state => state.sendImgshow,
  getreceiveShow:state => state.receiveShow,
  getreceiveImgShow:state => state.receiveImgShow,
  getselectreaceid:state => state.selectreaceid,
  
  
}

const actions = {
    setMsg({ commit }, { data }) {
        commit('setMsg', data);
    },
    setAdduser({ commit }, { data }) {
        commit('setAdduser', data);
    },
    setUserinfo({ commit }, { data }) {
        commit('setUserinfo', data);
    },
    setsendMsg({ commit }, { data }) {
        commit('setsendMsg', data);
    },
    setsendImg({ commit }, { data }) {
        commit('setsendImg', data);
    },
    setsendshow({ commit }, { data }) {
        commit('setsendshow', data);
    },
    setsendImgshow({ commit }, { data }) {
        commit('setsendImgshow', data);
    },
    setreceiveShow({ commit }, { data }) {
        commit('setreceiveShow', data);
    },
    setreceiveImgShow({ commit }, { data }) {
        commit('setreceiveImgShow', data);
    },
    setselectreaceid({ commit }, { data }) {
        commit('setselectreaceid', data);
    },
}

const mutations = {
    setMsg(state, data) {
        state.greetingsMsg = data;
    },
    setAdduser(state, data) {
        state.adduser = data;
    },
    setUserinfo(state, data) {
        state.userinfo = data;
    },
    setsendMsg(state, data) {
        state.sendMsg = data;
    },
    setsendImg(state, data) {
        state.sendImg = data;
    },
    setsendshow(state, data) {
        state.sendshow = data;
    },
    setsendImgshow(state, data) {
        state.sendImgshow = data;
    },
    setreceiveShow(state, data) {
        state.receiveShow = data;
    },
    setreceiveImgShow(state, data) {
        state.receiveImgShow = data;
    },
    setselectreaceid(state, data) {
        state.selectreaceid = data;
    },
}

export default {
  namespaced:true,
  state,
  getters,
  actions,
  mutations,
  
}
