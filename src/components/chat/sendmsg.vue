<template>
  <div class="sendmsg" v-show="name != ''">
    <div class="icon">
      <el-tooltip
        content="发送图片"
        class="icon_tip"
        placement="bottom"
        effect="light"
      >
        <el-upload
          class="load"
          action="/BasicData/UploadFiles"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <div class="el-icon-picture-outline"></div>
        </el-upload>
      </el-tooltip>
      <el-tooltip
        content="发送表情"
        placement="bottom"
        effect="light"
        class="icon_tip"
      >
        <emoji-icon @select="selectIcon"></emoji-icon>
      </el-tooltip>

      <el-tooltip
        content="邀请评价"
        placement="bottom"
        effect="light"
        class="icon_tip"
      >
        <span @click="evaluate()" class="el-icon-bangzhu"></span>
      </el-tooltip>
      <el-tooltip
        content="快捷话术"
        placement="bottom"
        effect="light"
        class="icon_tip"
      >
        <span @click="fastMsg()" class="el-icon-tickets"></span>
      </el-tooltip>
      <el-tooltip
        content="结束会话"
        placement="bottom"
        effect="light"
        class="icon_tip"
      >
        <span @click="over()" class="el-icon-switch-button"></span>
      </el-tooltip>
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
    <el-dialog
      title="选择标签"
      :visible.sync="labelType"
      width="20%"
      top="32vh"
      class="dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
    >
      <el-cascader
        class="casipt"
        v-model="labs"
        :options="options"
        clearable
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="labelType = false">取 消</el-button>
        <el-button type="primary" @click="onOver()">结束会话</el-button>
      </span>
    </el-dialog>
    <el-drawer
      title="快捷话术"
      :visible.sync="drawer"
      direction="rtl"
      size="20%"
    >
      <FastMsg
        v-if="drawer"
        :id="this.selectConversation.CustomerId"
        @selectMsg="selectFastMsg"
      />
    </el-drawer>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { labelList, commitLab } from '@/api/waiters'
import FastMsg from './fastMsg.vue'
export default {
  components: { FastMsg },
  data() {
    return {
      value: '',
      selectConversation: {},
      emojiList: [],
      name: '',
      labelType: false,
      options: [],
      labs: [],
      drawer: false,
    }
  },
  computed: {},
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
      setsendEvaluate: 'chat/setsendEvaluate',
      setoverConversation: 'chat/setoverConversation',
    }),
    info() {},
    selectFastMsg(e) {
      this.$refs.msgInputContainer.innerHTML = e
    },
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
    // 发送的图片格式限制
    beforeAvatarUpload(file) {
      console.log(file.type)
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      if (!isJPG && !isPng) {
        this.$message.error('上传头像图片只能是 JPG  PNG格式!')
      }
      return
    },
    // 邀请评价
    evaluate() {
      console.log('邀请评价')
      this.setsendEvaluate({
        data: {
          sendid: this.selectConversation.UserId,
          toId: this.selectConversation.CustomerId,
          linkid: this.selectConversation.Id,
          type: 0,
        },
      })
    },
    // 结束会话
    over() {
      labelList(this).then((res) => {
        console.log(res)
        let len = res.data.length
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < res.data[i].children.length; j++) {
            if (res.data[i].children[j].children.length == '') {
              delete res.data[i].children[j].children
            }
          }
        }
        this.options = res.data
      })
      this.labelType = true
    },
    //提交标签结束会话
    onOver() {
      console.log()
      commitLab(this, this.selectConversation.Id, this.labs.toString()).then(
        (res) => {
          if (res.success == true) {
            this.setsendMsg({
              data: {
                sendid: this.selectConversation.UserId,
                toId: this.selectConversation.CustomerId,
                linkid: this.selectConversation.Id,
                type: 0,
                msg: '结束会话!',
              },
            })
            this.name = ''
            this.setoverConversation({
              data: {
                type: true,
                id: this.selectConversation.CustomerId,
              },
            })
            this.labs = []
            this.labelType = false
          }
        }
      )
    },
    // 结束会话
    fastMsg() {
      this.drawer = true
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
.icon_tip {
  margin: 0 4px;
}
.dialog >>> .el-dialog {
  border-radius: 8px;
}
.dialog >>> .el-dialog__body {
  text-align: center;
}
.casipt {
  width: 280px;
}
</style>