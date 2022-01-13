<template>
  <div class="left">
    <div class="left_head">
      <el-input v-model="keymords" class="left_ipt" size="mini" clearable />
    </div>
    <div class="left_content">
      <div
        v-for="item in chat_list"
        :key="item.CustomerId"
        :class="
          selectChatData.CustomerId == item.CustomerId
            ? 'left_select_item'
            : 'left_item'
        "
        @click="selectChat(item)"
      >
        <div class="left_item_img">
          <img
            class="chat_img"
            :src="
              item.HeadImage.indexOf('http') == -1
                ? 'https://images.weserv.nl/?url=https://api.365lawhelp.com/uploads/default_avatar.png'
                : 'https://images.weserv.nl/?url=' + item.HeadImage
            "
            alt=""
          />
        </div>
        <div>
          <div class="left_item_name">
            <span>{{ item.CustomerName }}</span>
          </div>
          <div class="left_item_name">
            <span class="lastmsg" v-html="item.Message"></span>
            <span class="item_time">{{ item.Time }}</span>
          </div>
          <div
            class="count"
            v-show="item.count != undefined && item.count != 0"
          >
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chatList } from '@/api/waiters'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      keymords: '',
      chat_list: [], // 会话列表
      chatType: 0, // 聊天列表的状态 0是当前会话 1 是历史会话， 这里固定为0
      selectChatData: {},
      timer: null,
    }
  },
  computed: {
    ...mapGetters({
      getadduser: 'chat/getadduser',
      getuserinfo: 'chat/getuserinfo',
      getsendshow: 'chat/getsendshow',
      getreceiveShow: 'chat/getreceiveShow',
      getsendImgshow: 'chat/getsendImgshow',
      getreceiveImgShow: 'chat/getreceiveImgShow',
      getsendEvaluateshow: 'chat/getsendEvaluateshow',
      getoverConversation: 'chat/getoverConversation',
    }),
  },
  watch: {
    getadduser(newdata) {
      console.log(newdata)
      let flag = false
      this.chat_list.forEach((item) => {
        if (item.CustomerId == newdata.id) {
          flag = true
          return
        }
      })
      if (!flag) {
        this.userAddShow(newdata)
      }
    },
    getsendshow(newdata) {
      this.sendShow(newdata)
    },
    getreceiveShow(newreceivemsg) {
      this.receiveShow(newreceivemsg)
    },
    getsendImgshow(newreceivemsg) {
      this.sendImgShow(newreceivemsg)
    },
    getreceiveImgShow(newreceivemsg) {
      this.receiveImgShow(newreceivemsg)
    },
    getsendEvaluateshow(newreceivemsg) {
      this.sendEvaluateshow(newreceivemsg)
    },
    getoverConversation(newdata) {
      this.removeSession(newdata)
    },
  },
  mounted() {
    this.info()
  },
  methods: {
    ...mapActions({
      setoverConversation: 'chat/setoverConversation',
    }),
    //拉取会话列表
    info() {
      chatList(this).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.chat_list = []
        } else {
          this.chat_list = res.data
        }
      })
    },
    // 会话点击选中
    selectChat(row) {
      row.count = 0
      this.selectChatData = row
      this.$bus.$emit('selectChat', row)
    },

    // 数据加入会话
    userAddShow(row) {
      console.log(row)
      let data = {
        UserId: this.getuserinfo.sendId,
        Id: row.linkid,
        CustomerId: row.id,
        CustomerName: row.userName,
        Message: '',
        HeadImage:
          row.userphoto.indexOf('http') == -1
            ? 'https://images.weserv.nl/?url=https://api.365lawhelp.com/uploads/default_avatar.png'
            : row.userphoto,
        count: 0,
      }
      this.chat_list.unshift(data)
    },
    // 发送消息渲染到侧边栏
    sendShow(row) {
      console.log(row)
      console.log(this.chat_list)
      this.chat_list.forEach((item) => {
        if (row.toId == item.CustomerId) {
          item.Time = new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' ')
          item.Message = row.msg
          item.count = 0
        }
      })
    },
    // 发送图片渲染到侧边栏
    sendImgShow(row) {
      this.chat_list.forEach((item) => {
        if (row.toId == item.CustomerId) {
          item.Time = new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' ')
          item.Message = '图片'
          item.count = 0
        }
      })
    },
    //发送评价消息到侧边栏
    sendEvaluateshow(row) {
      this.chat_list.forEach((item) => {
        if (row.toId == item.CustomerId) {
          item.Time = new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' ')
          item.Message = row.msg
          item.count = 0
        }
      })
    },
    // 接收图消息渲染到侧边栏
    receiveImgShow(row) {
      this.chat_list.forEach((item) => {
        if (row.sendId == item.CustomerId) {
          item.Time = new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' ')
          item.Message = '图片'
          item.count =
            this.selectChatData.CustomerId == row.sendId ? 0 : item.count + 1
        }
      })
    },
    // 接收消息渲染到侧边栏
    receiveShow(row) {
      // selectChatData.CustomerId
      this.chat_list.forEach((item) => {
        if (row.sendId == item.CustomerId) {
          item.Time = new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' ')
          item.Message = row.msg
          item.count =
            this.selectChatData.CustomerId == row.sendId ? 0 : item.count + 1
        }
      })
    },
    // 结束会话删除侧边栏的数据
    removeSession(row) {
      if (row.type) {
        for (let i = 0; i < this.chat_list.length; i++) {
          if (row.id == this.chat_list[i].CustomerId) {
            this.chat_list.splice(i, 1)
            return
          }
        }
        this.timer = setTimeout(() => {
          this.setoverConversation({
            data: {
              type: false,
              id: '',
            },
          })
        }, 100)
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style scoped>
.left {
  width: 20%;
  background: #363e47;
  height: 94.8vh;
  overflow: hidden;
  overflow-y: scroll;
}
.left_head {
  height: 45px;
  border-bottom: 1px solid #303841;
}
.left_ipt {
  width: 300px;
  margin: 6px 16px;
  background: #303841;
  border: 0;
  color: #fff;
}
.left_ipt /deep/ .el-input__inner {
  background: #303841;
  color: #fff;
  border: 0;
}
.left_item {
  padding: 15px 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
}
.left_select_item {
  background: #404953;
  padding: 15px 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
}
.chat_img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.left_item_img {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.left_item_name {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
  color: #fff;
}
.left_item_name span {
  display: inline-block;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.left_item_name .item_time {
  float: right;
  width: 120px;
  font-size: 12px;
  text-align: right;
  color: #76828c;
}
.lastmsg {
  color: #a5b5c1;
}
.count {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  background: red;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  line-height: 20px;
}
</style>