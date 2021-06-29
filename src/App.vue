<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import {GetUserData,} from "@/api/waiters";
import {dingPush} from '@/api/dingTalk';
import {logout} from '@/api/login';

export default {
  name: 'app',
  data() {
    return {
      custId:'',
      sendTime:'',
      myPhoneNum:''
    }
  },
  created() {
    this.SignalRfc();
  },
  computed: {
			...mapGetters({
	            GetMsgs: 'chat/GetMsgs',
              getadduser:'chat/getadduser',
              getuserinfo:'chat/getuserinfo',
              getsendMsg:'chat/getsendMsg',
              getselectreaceid:'chat/getselectreaceid'
	        }),
	},
  watch: {
    getsendMsg(msgdata){
      console.log(msgdata);
      this.sendMsg(msgdata);
    },
    getuserinfo(user) {
      this.addChatUser();
      this.myPhoneNum = user.Phone;
    }
	},
  mounted() {
    Notification.requestPermission().then(res => {
        console.log(res);
      });
    let that = this
        let beginTime = 0; //开始时间
        let differTime = 0; //时间差
        window.onunload = function () {
          differTime = new Date().getTime() - beginTime;
          if (differTime <= 5) {
            console.log("这是关闭");
            logout(that).then(res => {
                that.$router.replace("/login");
            })
          } else {
            console.log("这是刷新");
          }
        };
        window.onbeforeunload = function (e) {
          //  e.returnValue = '关闭提示';  
          beginTime = new Date().getTime();
        };
        
  },
  methods: {
    ...mapActions({
				setMsg: 'chat/setMsg',
				setAdduser: 'chat/setAdduser',
        setUserinfo:'chat/setUserinfo',
        setsendshow:'chat/setsendshow',
        setreceiveShow:'chat/setreceiveShow'
		}),
     // 系统推送
    notify() {
      var notification = new Notification('消息提醒', { body: '您有一条新的消息请及时回复！' });
    },
        //钉钉推送 (实时方法)
    dingtalkPush(sengName,sendid,gettime) {
      const that = this;
      var t = setInterval(() => {
        console.log('当前客服回复（客户id）：'+ that.getselectreaceid+'，当前客服回复（时间戳）：'+that.sendTime+',客服收到消息的客户id：'+sendid+',客服接收消息时间戳：'+ gettime);
        if(that.getselectreaceid == sendid && that.sendTime > gettime){
          if(that.sendTime - gettime < 180){
            clearInterval(t);
          }else {
            that.CustName = sengName;
            dingPush(that).then(res => {
              console.log(res);
              clearInterval(t);
            })
          }
        }else {
          if(new Date().getTime()/1000 - gettime > 180){
             that.CustName = sengName;
             dingPush(that).then(res => {
              console.log(res);
              clearInterval(t);
            })
          }else {
            return;
          }
        }
      },3000);
     
    },
    SignalRfc() {
      // 获取用户信息
      GetUserData(this).then((res) => {
        // this.myPhoneNum = res.Phone
         this.setUserinfo({
					data:res
				});
      const _this = this;
      var connection = $.hubConnection("");
      _this.demoChatHubProxy = connection.createHubProxy("chatHub");
    
    // 首问语
    _this.demoChatHubProxy.on("addContosoChatMessageToPage",
      function (message, type) {
        // _this.msg = message;
        console.log('获取首问语--内容：'+message+',类型type：'+type);
        _this.setMsg({
					data:message
				})
      }
    );
    //显示新用户加入消息
    _this.demoChatHubProxy.on("showJoinMessage", function (id, userName, type,state) {
      console.log('新用户加入消息--用户id：'+id+',名字：'+userName+'，身份：'+type+',是否是第二次：'+state);
      _this.setAdduser({
        data:{
          id:id,
          userName:userName,
          type:type,
          state:state
        }
      })
      // _this.userAddShow(id, userName, type,state);
    });
    //接收私聊消息
    _this.demoChatHubProxy.on("remindMsg", function (sendId, sengName, message, types,state) {
        console.log('接收私聊消息--发送发id：'+sendId+',发送方名字：'+sengName+'，消息内容：'+message+',状态types:'+types+',类型state：'+state);
        _this.setreceiveShow({
          data:{
            sendId:sendId,
            sengName:sengName,
            message:message,
            types:types,
            state:state
          }
        });
         _this.dingtalkPush(sengName,sendId,new Date().getTime()/1000);
        _this.$notify.info({
          title: '提示',
          message: '您有一条新的消息请及时回复',
          position: 'bottom-right',
          duration: 30000
        });
        _this.notify();
      }
    );
    //显示发送的私聊消息
    _this.demoChatHubProxy.on("showMsgToPages", function (sendId, sengName, message, types, state) {
        console.log('发送私聊消息--发送发id：'+sendId+',发送方名字：'+sengName+'，消息内容：'+message+',状态types:'+types+',类型state：'+state);
        _this.setsendshow({
          data:{
            sendId:sendId,
            sengName:sengName,
            message:message,
            types:types,
            states:state,
          }
        });
        // _this.sendShow(sendId, sengName, message, types, state,);
        _this.sendTime = new Date().getTime()/1000;
      }
    );
      connection.error((error)=>{
        console.log(error)
      })  
      connection.disconnected(()=>{
          console.log('断线')
          setTimeout(() => {
            connection.start();
            _this.addChatUser();
            console.log('重连');
          }, 500);
      })
    connection.start()
      .done(function () {
          _this.addChatUser();
      })
      .fail(function () {
        _this.$message.error("连接失败");
      });
      });
    },

    addChatUser() {
      console.log('添加会话成员--发送方id：'+this.getuserinfo.sendId+',发送方名字：'+this.getuserinfo.sendName+',发送方身份：0');
      this.demoChatHubProxy.invoke("addOnlineUser",'', this.getuserinfo.sendId, this.getuserinfo.sendName, 0,false);
    },
    // 发送消息 方法
    sendMsg(msgdata) {
        console.log('发送消息--接待id：'+msgdata.receid+',发送方id：'+msgdata.send+',接收方id：'+msgdata.receive+',发送内容：'+msgdata.msg+',消息状态：'+msgdata.type+',消息类型：'+msgdata.states);
        this.demoChatHubProxy.invoke('sendPrivateMsg',msgdata.receid,msgdata.send,msgdata.receive,msgdata.msg,msgdata.type,msgdata.states); 
    },
  }, 
}
</script>
