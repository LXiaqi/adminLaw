<template>
  <div class="content">
    <Head />
    <div class="chatRecord" ref="content_view">
      <!-- 历史消息 -->
      <div v-for="item in chatRecordList" :key="item.Id">
        <div class="item_left" v-show="item.Types == 1">
          <div class="item_img">
            <img
              :src="'https://images.weserv.nl/?url=' + item.CustomerHeadImage"
              alt=""
            />
          </div>
          <div
            class="msgbox"
            v-show="item.State == 0"
            v-html="item.Message"
          ></div>
          <div class="msgbox" v-show="item.State == 1">
            <el-image
              class="img_chat"
              :src="'https://images.weserv.nl/?url=' + item.Message"
              :preview-src-list="[
                'https://images.weserv.nl/?url=' + item.Message,
              ]"
              alt=""
            ></el-image>
          </div>
          <div class="item_content_left">
            <span class="chatName">{{ item.CustomerName }}</span>
            <span class="chatName">{{ item.CreateTime }}</span>
          </div>
        </div>
        <div class="item_right" v-show="item.Types == 0">
          <div class="item_img">
            <img
              :src="'https://images.weserv.nl/?url=' + item.UserHeadImage"
              alt=""
            />
          </div>
          <div
            class="msgbox msg_right"
            v-show="item.State == 0"
            v-html="item.Message"
          ></div>
          <div class="msgbox msg_right" v-show="item.State == 1">
            <el-image
              class="img_chat"
              :src="'https://images.weserv.nl/?url=' + item.Message"
              :preview-src-list="[
                'https://images.weserv.nl/?url=' + item.Message,
              ]"
              alt=""
            ></el-image>
          </div>
          <div class="item_content_right">
            <span class="chatName">{{ item.UserName }}</span>
            <span class="chatName">{{ item.CreateTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <SendMsg :selectConversation="selectChat" />
  </div>
</template>

<script>
import Head from '@/components/chat/head'
import SendMsg from '@/components/chat/sendmsg'
import { mapGetters } from 'vuex'
import { conversation } from '@/api/waiters'
export default {
  components: {
    Head,
    SendMsg,
  },
  computed: {
    ...mapGetters({
      GetMsgs: 'chat/GetMsgs',
      getadduser: 'chat/getadduser',
      getuserinfo: 'chat/getuserinfo',
      getsendMsg: 'chat/getsendMsg',
      getselectreaceid: 'chat/getselectreaceid',
      getsendshow: 'chat/getsendshow',
      getsendImgshow: 'chat/getsendImgshow',
      getreceiveShow: 'chat/getreceiveShow',
      getreceiveImgShow: 'chat/getreceiveImgShow',
      getsendEvaluateshow: 'chat/getsendEvaluateshow',
      getoverConversation: 'chat/getoverConversation',
    }),
  },
  watch: {
    getsendshow(newdata) {
      this.sendShow(newdata)
    },
    getsendImgshow(newdata) {
      this.sendImgShow(newdata)
    },
    getreceiveShow(newreceivemsg) {
      this.receiveShow(newreceivemsg)
    },
    getreceiveImgShow(newreceivemsg) {
      this.receiveImgShow(newreceivemsg)
    },
    getsendEvaluateshow(newreceivemsg) {
      this.evaluateshow(newreceivemsg)
    },
    getoverConversation(newdata) {
      this.removeSession(newdata)
    },
  },
  data() {
    return {
      chatRecordList: [],
      paging: {
        page: 1,
        pageSize: 10,
      },
      selectChat: {}, // 选中的会话
    }
  },
  mounted() {
    this.info()
  },
  methods: {
    //拉取会话列表
    info() {
      this.$bus.$on('selectChat', (msg) => {
        console.log(msg)
        this.selectChat = msg
        conversation(this, msg.CustomerId).then((res) => {
          this.chatRecordList = res.data
        })
      })
    },
    // 发送的消息上屏
    sendShow(row) {
      console.log(row)
      if (row.msg != '结束会话!') {
        if (row.toId == this.selectChat.CustomerId) {
          this.chatRecordList.push({
            State: 0,
            Types: 0,
            Message: row.msg,
            UserName: this.getuserinfo.sendName,
            UserHeadImage: this.getuserinfo.Image,
            CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 19)
              .replace('T', ' '),
          })
          this.$nextTick(() => {
            this.$refs.content_view.scrollTop =
              this.$refs.content_view.scrollHeight + 60
          })
        }
      }
    },
    // 发送图片消息的上屏
    sendImgShow(row) {
      if (row.toId == this.selectChat.CustomerId) {
        this.chatRecordList.push({
          State: 1,
          Types: 0,
          Message: row.msg,
          UserName: this.getuserinfo.sendName,
          UserHeadImage: this.getuserinfo.Image,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' '),
        })
        this.$nextTick(() => {
          this.$refs.content_view.scrollTop =
            this.$refs.content_view.scrollHeight + 60
        })
      }
    },
    // 发送邀请上屏
    evaluateshow(row) {
      if (row.toId == this.selectChat.CustomerId) {
        this.chatRecordList.push({
          State: 0,
          Types: 0,
          Message: row.msg,
          UserName: this.getuserinfo.sendName,
          UserHeadImage: this.getuserinfo.Image,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' '),
        })
        this.$nextTick(() => {
          this.$refs.content_view.scrollTop =
            this.$refs.content_view.scrollHeight + 60
        })
      }
    },
    // 接收消息的上屏
    receiveShow(row) {
      console.log(row)
      if (row.sendId == this.selectChat.CustomerId) {
        this.chatRecordList.push({
          State: 0,
          Types: 1,
          Message: row.msg,
          CustomerName: this.selectChat.CustomerName,
          CustomerHeadImage: this.selectChat.HeadImage,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' '),
        })
        this.$nextTick(() => {
          this.$refs.content_view.scrollTop =
            this.$refs.content_view.scrollHeight + 60
        })
      }
    },
    // 接收图片消息上屏
    receiveImgShow(row) {
      console.log(row)
      if (row.sendId == this.selectChat.CustomerId) {
        this.chatRecordList.push({
          State: 1,
          Types: 1,
          Message: row.msg,
          CustomerName: this.selectChat.CustomerName,
          CustomerHeadImage: this.selectChat.HeadImage,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' '),
        })
        this.$nextTick(() => {
          this.$refs.content_view.scrollTop =
            this.$refs.content_view.scrollHeight + 60
        })
      }
    },
    // 清除会话
    removeSession(row) {
      if (row.type) {
        this.chatRecordList = []
      }
    },
  },
}
</script>

<style scoped>
.content {
  width: 80%;
}
.chatRecord {
  border-bottom: 1px solid #dcdcdc;
  height: 78vh;
  overflow: hidden;
  overflow-y: scroll;
  padding: 0 20px;
}
.item_left {
  display: flex;
  margin: 14px 0;
  position: relative;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  align-items: flex-end;
}
.item_right {
  position: relative;
  display: flex;
  margin: 14px 0;
  text-align: end;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  align-items: flex-end;
}
.item_img img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}
.chatName {
  color: #a5b5c1;
  font-size: 12px;
}
.item_content_right {
  margin: 0 12px;
  position: absolute;
  right: 56px;
  top: 0;
}
.item_content_left {
  margin: 0 12px;
  position: absolute;
  left: 56px;
  top: 0;
}
.msgbox {
  margin-top: 6px;
  background-color: #fff;
  border-radius: 0 4px 4px 4px;
  outline: none;
  font-size: 14px;
  position: relative;
  max-width: 350px;
  word-wrap: break-word;
  word-break: break-all;
  padding: 10px;
  -webkit-box-shadow: 0 5px 10px 0 rgb(0 0 0 / 10%);
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 10%);
  margin: 24px 12px 0 12px;
}
.msg_right {
  background: #5cadff !important;
  color: #fff;
}
.img_chat {
  max-width: 300px;
}
</style>