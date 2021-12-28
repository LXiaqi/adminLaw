<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { GetUserData } from '@/api/waiters'
import { dingPush } from '@/api/dingTalk'
import { logout } from '@/api/login'

export default {
  name: 'app',
  data() {
    return {
      custId: '',
      sendTime: '',
      hearId: '',
      SignalRfcType: false,
    }
  },
  created() {},
  computed: {
    ...mapGetters({
      GetMsgs: 'chat/GetMsgs',
      getadduser: 'chat/getadduser',
      getuserinfo: 'chat/getuserinfo',
      getsendMsg: 'chat/getsendMsg',
      getsendImg: 'chat/getsendImg',
      getselectreaceid: 'chat/getselectreaceid',
      getsendEvaluate: 'chat/getsendEvaluate',
    }),
  },
  watch: {
    getsendMsg(msgdata) {
      console.log(msgdata)
      this.sendMsg(msgdata)
    },
    getsendImg(msgdata) {
      this.sendImg(msgdata)
    },
    getsendEvaluate(msgdata) {
      console.log(msgdata)
      this.sendEvaluate(msgdata)
    },
    getuserinfo(user) {
      console.log(user)
      if (user != undefined) {
        this.SignalRfcType = true
        console.log('这是个登录')
        // this.SignalRfc()
      }
    },
    SignalRfcType(newval) {
      if (newval) {
        this.SignalRfc()
      }
    },
  },
  mounted() {
    // Notification.requestPermission().then((res) => {
    //   console.log(res)
    // })
    // let that = this
    // let beginTime = 0 //开始时间
    // let differTime = 0 //时间差
    // window.onunload = function () {
    //   differTime = new Date().getTime() - beginTime
    //   if (differTime <= 5) {
    //     console.log('这是关闭')
    //     logout(that).then((res) => {
    //       that.$router.replace('/login')
    //     })
    //   } else {
    //     console.log('这是刷新')
    //   }
    // }
    // window.onbeforeunload = function (e) {
    //   //  e.returnValue = '关闭提示';
    //   beginTime = new Date().getTime()
    // }
  },
  methods: {
    ...mapActions({
      setMsg: 'chat/setMsg',
      setAdduser: 'chat/setAdduser',
      setUserinfo: 'chat/setUserinfo',
      setsendshow: 'chat/setsendshow',
      setreceiveShow: 'chat/setreceiveShow',
      setreceiveImgShow: 'chat/setreceiveImgShow',
      setsendshow: 'chat/setsendshow',
      setsendImgshow: 'chat/setsendImgshow',
      setsendEvaluateshow: 'chat/setsendEvaluateshow',
    }),

    // 系统推送
    notify() {
      var notification = new Notification('消息提醒', {
        body: '您有一条新的消息请及时回复！',
      })
    },
    //钉钉推送 (实时方法)
    dingtalkPush(sengName, sendid, gettime) {
      const that = this
      var t = setInterval(() => {
        console.log(
          '当前客服回复（客户id）：' +
            that.getselectreaceid +
            '，当前客服回复（时间戳）：' +
            that.sendTime +
            ',客服收到消息的客户id：' +
            sendid +
            ',客服接收消息时间戳：' +
            gettime
        )
        if (that.getselectreaceid == sendid && that.sendTime > gettime) {
          if (that.sendTime - gettime < 180) {
            clearInterval(t)
          } else {
            that.CustName = sengName
            dingPush(that).then((res) => {
              console.log(res)
              clearInterval(t)
            })
          }
        } else {
          if (new Date().getTime() / 1000 - gettime > 180) {
            that.CustName = sengName
            dingPush(that).then((res) => {
              console.log(res)
              clearInterval(t)
            })
          } else {
            return
          }
        }
      }, 3000)
    },
    SignalRfc() {
      // 获取客服信息
      GetUserData(this).then((res) => {
        this.setUserinfo({
          data: res,
        })
        const _this = this
        var connection = $.hubConnection('')
        _this.demoChatHubProxy = connection.createHubProxy('chatHub')
        // 接收心跳包
        _this.demoChatHubProxy.on('recieveHeartBeat', function (heartbeat) {
          _this.hearId = heartbeat
          console.log('接收心跳:' + heartbeat)
          _this.sendheartbeat()
        })
        // 接收用户加入会话
        _this.demoChatHubProxy.on(
          'showJoinList',
          function (linkid, userid, username, userphoto) {
            console.log(
              'showJoinList加入用户的id:' +
                userid +
                ',加入会话的用户名:' +
                username +
                ',加入会话的用户头像:' +
                userphoto +
                ',接待id：' +
                linkid
            )
            _this.setAdduser({
              data: {
                id: userid,
                userName: username,
                userphoto: userphoto,
                linkid: linkid,
              },
            })
            _this.hello()
          }
        )
        // 首问语
        _this.demoChatHubProxy.on('greetingsMessageToPage', function (message) {
          // _this.msg = message;
          console.log('获取首问语--内容：' + message)
          _this.setMsg({
            data: message,
          })
          console.log(_this.getadduser)
          let data = {
            sendid: _this.getuserinfo.sendId,
            toId: _this.getadduser.id,
            linkid: _this.getadduser.linkid,
            type: 0,
            msg: message,
          }
          _this.sendMsg(data)
        })
        //显示新用户加入消息
        _this.demoChatHubProxy.on(
          'showJoinMessage',
          function (linkid, id, userName, state) {
            console.log(
              '新用户加入消息showJoinMessage--用户id：' +
                id +
                ',名字：' +
                userName +
                ',加入会话的身份：' +
                state +
                ',链接id:' +
                linkid
            )
          }
        )
        //接收私聊消息
        _this.demoChatHubProxy.on(
          'remindMsg',
          function (sendId, toId, receid, type, msg) {
            console.log(
              '接收私聊消息--发送发id：' +
                sendId +
                ',接收方id' +
                toId +
                '，消息内容：' +
                msg +
                ',消息状态:' +
                type +
                ',接待id：' +
                receid
            )
            _this.setreceiveShow({
              data: {
                sendId: sendId,
                toId: toId,
                msg: msg,
                type: type,
              },
            })
            // _this.dingtalkPush(sengName, sendId, new Date().getTime() / 1000)
            // _this.$notify.info({
            //   title: '提示',
            //   message: '您有一条新的消息请及时回复',
            //   position: 'bottom-right',
            //   duration: 30000,
            // })
            // _this.notify()
          }
        )
        // 显示收到的图片消息
        _this.demoChatHubProxy.on(
          'remindImgMsg',
          function (sendId, toId, receid, type, msg) {
            console.log(
              '接收图片消息--发送发id：' +
                sendId +
                ',接收方id' +
                toId +
                '，消息内容：' +
                msg +
                ',消息状态:' +
                type +
                ',接待id：' +
                receid
            )
            _this.setreceiveImgShow({
              data: {
                sendId: sendId,
                toId: toId,
                msg: msg,
                type: type,
              },
            })
          }
        )
        //显示发送的私聊消息
        _this.demoChatHubProxy.on(
          'showMsgToPages',
          function (sendId, toId, receid, types, msg) {
            console.log(
              '发送私聊消息--发送发id：' +
                sendId +
                ',接收方id' +
                toId +
                '，接待id：' +
                receid +
                ',状态types:' +
                types +
                ',消息' +
                msg
            )
            _this.setsendshow({
              data: {
                sendId: sendId,
                toId: toId,
                receid: receid,
                types: types,
                msg: msg,
              },
            })
            // _this.sendShow(sendId, sengName, message, types, state,);
            _this.sendTime = new Date().getTime() / 1000
          }
        )
        //显示发送的图片消息
        _this.demoChatHubProxy.on(
          'showImgMsgToPages',
          function (sendId, toId, receid, types, msg) {
            console.log(
              '发送图片消息--发送发id：' +
                sendId +
                ',接收方id' +
                toId +
                '，接待id：' +
                receid +
                ',状态types:' +
                types +
                ',消息' +
                msg
            )
            _this.setsendImgshow({
              data: {
                sendId: sendId,
                toId: toId,
                receid: receid,
                types: types,
                msg: msg,
              },
            })
            // _this.sendShow(sendId, sengName, message, types, state,);
            _this.sendTime = new Date().getTime() / 1000
          }
        )
        //显示发送的邀评消息
        _this.demoChatHubProxy.on(
          'showAppraiseMsgToPages',
          function (sendId, toId, receid, msg) {
            console.log(
              '发送评价消息--发送发id：' +
                sendId +
                ',接收方id' +
                toId +
                '，接待id：' +
                receid +
                ',消息' +
                msg
            )
            _this.setsendEvaluateshow({
              data: {
                sendId: sendId,
                toId: toId,
                receid: receid,
                types: 0,
                msg: msg,
              },
            })
            // _this.sendShow(sendId, sengName, message, types, state,);
            _this.sendTime = new Date().getTime() / 1000
          }
        )
        connection.error((error) => {
          console.log(error)
          connection
            .start()
            .done(function () {
              _this.addChatUser()
            })
            .fail(function () {
              _this.$message.error('连接失败')
            })
          console.log('重连')
        })
        connection.disconnected(() => {
          console.log('断线')
          connection
            .start()
            .done(function () {
              _this.addChatUser()
            })
            .fail(function () {
              _this.$message.error('连接失败')
            })
          console.log('重连')
        })
        connection
          .start()
          .done(function () {
            _this.addChatUser()
          })
          .fail(function () {
            _this.$message.error('连接失败')
          })
      })
    },
    // 发送心跳包
    sendheartbeat() {
      this.demoChatHubProxy.invoke('RecieveHeartBeat', this.hearId)
    },
    // 把自己添加进连接池
    addChatUser() {
      console.log(
        '添加会话成员addConUser--发送方id：' +
          this.getuserinfo.sendId +
          ',发送方名字：' +
          this.getuserinfo.sendName +
          ',发送方身份：客服'
      )
      this.demoChatHubProxy.invoke(
        'addConUser',
        this.getuserinfo.sendId,
        this.getuserinfo.sendName,
        0
      )
    },
    // 发送消息 方法
    sendMsg(msgdata) {
      console.log(
        '发送消息--接待id：' +
          msgdata.linkid +
          ',发送方id：' +
          msgdata.sendid +
          ',接收方id：' +
          msgdata.toId +
          ',发送内容：' +
          msgdata.msg +
          ',消息状态：' +
          msgdata.type
      )

      this.demoChatHubProxy.invoke(
        'SendMsg',
        msgdata.sendid,
        msgdata.toId,
        msgdata.linkid,
        msgdata.type,
        msgdata.msg
      )
    },
    sendImg(msgdata) {
      console.log(
        '发送图片--接待id：' +
          msgdata.linkid +
          ',发送方id：' +
          msgdata.sendid +
          ',接收方id：' +
          msgdata.toId +
          ',发送内容：' +
          msgdata.msg +
          ',消息状态：' +
          msgdata.type
      )

      this.demoChatHubProxy.invoke(
        'SendImgMsg',
        msgdata.sendid,
        msgdata.toId,
        msgdata.linkid,
        msgdata.type,
        msgdata.msg
      )
    },
    // 发送邀评
    sendEvaluate(msgdata) {
      console.log(
        '发送图片--接待id：' +
          msgdata.linkid +
          ',发送方id：' +
          msgdata.sendid +
          ',接收方id：' +
          msgdata.toId +
          ',消息状态：' +
          msgdata.type
      )

      this.demoChatHubProxy.invoke(
        'SendAppraiseMsg',
        msgdata.sendid,
        msgdata.toId,
        msgdata.linkid,
        msgdata.type
      )
    },
    // 获取问候语
    hello() {
      this.demoChatHubProxy.invoke('GetGeegtingData', 0)
    },
  },
}
</script>
