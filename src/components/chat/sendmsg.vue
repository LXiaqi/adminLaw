<template>
  <div class="sendmsg" v-show="name != ''">
    <div class="icon">
      <el-upload
        class="load"
        action="/BasicData/UploadFiles"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <div class="el-icon-picture-outline"></div>
      </el-upload>
      <emoji-icon @select="selectIcon"></emoji-icon>
    </div>
    <div
      contenteditable
      @keydown.enter="keyDown"
      class="sendtext"
      ref="msgInputContainer"
    >
      <img
        v-for="(item, index) in emojiList"
        :key="index"
        :src="item"
        alt=""
        style="vertical-align: bottom; width: 20px; height: 20px"
      />
    </div>
    <div class="el-icon-s-promotion" @click="sendMsg()"></div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      value: '',
      selectConversation: {},
      emojiList: [],
      name: '',
    }
  },
  mounted() {
    this.info(
      this.$bus.$on('selectChat', (msg) => {
        this.selectConversation = msg
        this.name = msg.CustomerName
      })
    )
  },
  methods: {
    ...mapActions({
      setsendMsg: 'chat/setsendMsg',
      setsendImg: 'chat/setsendImg',
    }),
    info() {},
    sendMsg() {
      this.value = this.$refs.msgInputContainer.innerHTML
      if (this.value == '') {
        this.$message.error('发送消息不能为空！')
        return
      }
      this.setsendMsg({
        data: {
          sendid: this.selectConversation.UserId,
          toId: this.selectConversation.CustomerId,
          linkid: this.selectConversation.Id,
          type: 0,
          msg: this.value,
        },
      })
      this.value = ''
      this.$refs.msgInputContainer.innerHTML = ''
    },
    // 回车发送消息
    keyDown(e) {
      if (e.ctrlKey && e.keyCode == 13) {
        this.sendMsg()
      }
    },
    // 表情选中
    selectIcon(val) {
      let emoji = '.' + val.match(/src=.(\S*).png/)[1] + '.png'
      this.emojiList.push(emoji)
      // console.log(this.emojiList);
    },
    // 发送图片
    handleAvatarSuccess(res, file) {
      let imgUrl = 'https://files.365lawhelp.com/' + res.data
      this.setsendImg({
        data: {
          sendid: this.selectConversation.UserId,
          toId: this.selectConversation.CustomerId,
          linkid: this.selectConversation.Id,
          type: 0,
          msg: imgUrl,
        },
      })
    },
  },
}
</script>

<style scoped>
.sendmsg {
  position: relative;
  background: #fff;
}
.icon {
  height: 36px;
  font-size: 24px;
  padding: 0 20px;
}
.load {
  display: inline-block;
}
.icon /deep/ .fa-smile-o {
  font-size: 24px !important;
  color: #000 !important;
}

.sendtext {
  padding: 6px 30px 6px 20px;
  height: 74px;
  border: 0;
}
[contenteditable]:focus {
  outline: none;
}

.el-icon-s-promotion {
  font-size: 30px;
  color: #2d8cf0;
  position: absolute;
  right: 12px;
  bottom: 12px;
}
</style>