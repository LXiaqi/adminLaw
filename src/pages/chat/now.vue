<template>
  <div class="chat_content_pc">
    <div class="chat_list">
      <div class="lable">
        <div>当前会话</div>
      </div>
      <div class="chat_input_pcbox">
        <el-input
          v-model="search_user"
          placeholder="搜索聊天用户"
          clearable
          class="search_chat_ipt"
        ></el-input>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchBtn()"
        ></el-button>
      </div>
      <!-- 聊天侧边栏 -->
      <div class="chats_content_box">
        <div
          @click="viewDetails(item, index)"
          v-for="(item, index) in chat_list"
          :key="item.Id"
          class="chat_on_box"
          :id="chat_state == index ? 'chat_select' : ''"
        >
          <el-image
            class="chat_img"
            :src="'https://images.weserv.nl/?url=' + item.HeadImage"
            alt=""
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <span class="chat_tips" v-if="item.tips"></span>
          <span class="chat_name">{{ item.CustomerName }}</span>
          <div class="chat_time">{{ item.Time }}</div>
          <div class="chat_userinfo" v-html="item.Message"></div>
          <div class="select_label" v-if="item.LabelName.length == 0">
            <el-tag
              size="mini"
              type="success"
              effect="dark"
              @click="selectLabel(item.LabelName)"
              >选择标签</el-tag
            >
          </div>
          <div v-if="item.LabelName.length != 0">
            <el-popover
              class="select_label"
              placement="right"
              width="340"
              trigger="hover"
            >
              <div>
                <el-tag
                  class="tag"
                  v-for="lab in item.LabelName"
                  :key="lab.index"
                  size="mini"
                  type="success"
                  effect="dark"
                  @click="selectLabel(item.LabelName)"
                  >{{ lab.label }}</el-tag
                >
              </div>
              <el-tag
                slot="reference"
                size="mini"
                type="success"
                effect="dark"
                @click="selectLabel(item.LabelName)"
                >查看</el-tag
              >
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <!-- 聊天内容聊天详情 -->
    <div
      :class="quickType == 0 ? 'chat_details' : 'chat_details2'"
      v-if="right_type == 1"
    >
      <el-container>
        <!-- 头部信息 -->
        <el-header class="chat_details_head">
          <img
            class="active_img"
            :src="'https://images.weserv.nl/?url=' + head_img"
            alt=""
          />
          <span> {{ customer_name }}</span>
          <el-button class="head_btn" @click="user_information()"
            >...</el-button
          >
          <el-button
            class="el-icon-chat-round head_btn"
            @click="Fastreply()"
          ></el-button>
        </el-header>
        <!-- 聊天内容 -->
        <el-main style="padding: 0">
          <div class="chat_details_content" ref="content_view">
            <span
              class="tips"
              @click="more()"
              v-loading="more_type"
              v-if="more_show"
              >加载更多</span
            >
            <div
              v-for="item in detailList"
              :key="item.Id"
              :class="item.img == false ? 'chat_my_left' : 'chat_my_left2'"
            >
              <div v-if="item.Types == 1 && item.State != 2">
                <div class="chat_details_info_box">
                  <img
                    :src="
                      'https://images.weserv.nl/?url=' + item.CustomerHeadImage
                    "
                    alt=""
                  />
                  <div class="chat_details_active_time">
                    <div>{{ item.CustomerName }}</div>
                    <span>{{ item.CreateTime }}</span>
                  </div>
                </div>
                <div class="chat_details_sentence" style="margin-top: 18px">
                  <span v-if="item.State == 0" v-html="item.Message"> </span>
                  <el-image
                    class="img_chat"
                    v-if="item.State == 1"
                    :src="'https://images.weserv.nl/?url=' + item.Message"
                    :preview-src-list="[
                      'https://images.weserv.nl/?url=' + item.Message,
                    ]"
                    alt=""
                  ></el-image>
                </div>
              </div>
              <div
                v-if="item.Types == 0 || item.Types == 2"
                class="chat_my_right"
              >
                <div class="chat_details_info_box">
                  <img
                    :src="'https://images.weserv.nl/?url=' + item.UserHeadImage"
                    alt=""
                  />
                  <div class="chat_details_active_time">
                    <div style="text-align: left">{{ item.UserName }}</div>
                    <span>{{ item.CreateTime }}</span>
                  </div>
                </div>
                <div class="chat_my_right_msgbox">
                  <span
                    class="chat_details_sentence_s"
                    v-if="item.State == 0"
                    v-html="item.Message"
                  >
                  </span>
                  <el-image
                    class="img_chat"
                    v-if="item.State == 1"
                    :src="'https://images.weserv.nl/?url=' + item.Message"
                    :preview-src-list="[
                      'https://images.weserv.nl/?url=' + item.Message,
                    ]"
                    alt=""
                  ></el-image>
                </div>
              </div>
            </div>
          </div>
          <!-- 消息发送框 -->
          <div class="chat_sendout_box">
            <!-- <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="chat_sendout" class="chat_sendout_ipt" @keydown.enter.native="keyDown"></el-input> -->
            <div
              contenteditable
              class="chat_sendout_ipt"
              ref="msgInputContainer"
              @input="changeval()"
              @keydown.enter="keyDown"
            >
              <img
                v-for="(item, index) in emojiList"
                :key="index"
                :src="item"
                alt=""
                style="vertical-align: bottom; width: 20px; height: 20px"
              />
            </div>
            <emoji-icon @select="selectIcon"></emoji-icon>
            <el-upload
              class="avatar-uploader"
              action="/BasicData/UploadFiles"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <i class="el-icon-circle-plus-outline"></i>
            </el-upload>
            <el-button type="primary" @click="sendOut()">发送</el-button>
            <el-button type="warning" @click="end()">结束服务</el-button>
          </div>
        </el-main>
      </el-container>
    </div>
    <!-- 快捷回复 -->
    <div class="quick" v-if="quickType == 1">
      <div class="quickTitle">
        <span>快捷回复</span>
        <el-button
          type="warning"
          class="el-icon-close"
          size="mini"
          @click="ShutDown()"
        ></el-button>
        <el-button
          type="success"
          class="el-icon-refresh"
          size="mini"
          @click="Fastreply()"
        ></el-button>
      </div>
      <el-table :data="quickData" height="850" style="width: 100%">
        <el-table-column prop="Contents" label="内容" width="300">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="sendQuick(scope.row.Contents)"
              >发送</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 个人信息的模态框 -->
    <el-drawer title="用户资料" :visible.sync="drawer">
      <div class="user_customer">客户名称：{{ customerData.CustomerName }}</div>
      <div class="user_customer">
        客户类型：{{ customerData.Types == 1 ? '个人' : '企业' }}
      </div>
      <div class="user_customer">会员信息：{{ customerData.Vip }}</div>
      <div class="user_customer">会员年限：{{ customerData.VipYears }}</div>
      <div class="user_customer">客户地址：{{ customerData.Location }}</div>
      <div class="user_customer">联系方式：{{ customerData.Phone }}</div>
    </el-drawer>
    <!-- 标签选择框 -->
    <el-dialog title="标签选择" :visible.sync="dialogType">
      <el-form>
        <el-form-item label="标签" label-width="90px">
          <el-cascader
            v-model="labelval"
            :options="accountData"
            :show-all-levels="false"
            clearable
            :props="{ multiple: true, checkStrictly: true }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogType = false">取 消</el-button>
        <el-button type="primary" @click="labelyes()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  chatList,
  conversation,
  getCustomerInfo,
  GetUserData,
  quickList,
  endSession,
  getreceid,
  labelList,
  setLabel,
} from '@/api/waiters'
import { dingPush } from '@/api/dingTalk'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      labelId: '',
      accountData: [], //label 标签数据的数组
      labelval: [], // 标签的val
      dialogType: false, //标签选择框的显示隐藏
      receptionId: '', // 这个参数不用理会历史那边需要传这边赋空值就好
      receid: '', // 接待id
      types_user: '0',
      searchid: '',
      id: '', //发送方id
      name: '',
      chat_list: [], // 当前会话列表
      search_user: '', // 搜索内容
      chatType: 0, // 聊天列表的状态 0是当前会话 1 是历史会话， 这里固定为0
      chat_state: 0, // 点击选中的状态
      customer_name: '', // 聊天详情中左上角客户名字
      head_img: '', // 顶栏头像
      page: 1, //当前页数
      pagenum: 10, // 每页条数
      user_id: '', // 当前客服id
      chat_sendout: '', // 发送聊天文本域内容
      demoChatHubProxy: {},
      userInformationId: '', // 侧边栏的展开的个用户id
      drawer: false, // 用户信息资料模态框显示隐藏
      customerData: {}, //客户资料
      more_type: false, // 加载动画的显示隐藏
      more_show: false, // 加载的隐藏显示（当数据不足分页的时候隐藏加载提示）
      total: 0, // 总页数
      msg: '',
      quickData: [],
      quickType: 0, // 侧边的快捷状态
      right_type: 1, // 判断聊天列表没有数据的时候右边栏目隐藏, 1是有数据，0 是没有
      emojiList: [],
      detailList: [], // 当前选中会话的聊天内容， 数组
      CustName: '', // 推送的客户名称
      myPhoneNum: '', // 当前客服手机号
      myimg: '',
    }
  },
  created() {},
  computed: {
    ...mapGetters({
      GetMsgs: 'chat/GetMsgs',
      getadduser: 'chat/getadduser',
      getuserinfo: 'chat/getuserinfo',
      getsendshow: 'chat/getsendshow',
      getreceiveShow: 'chat/getreceiveShow',
      getselectreaceid: 'chat/getselectreaceid',
    }),
  },
  watch: {
    getadduser(newadduser) {
      let chat_type = false
      if (this.chat_list.length != 0) {
        for (let i = 0; i < this.chat_list.length; i++) {
          if (this.chat_list[i].CustomerId == newadduser.id) {
            chat_type = true
            break
          }
        }
      }
      if (!chat_type) {
        this.userAddShow(newadduser)
      }
    },
    getsendshow(newsendmsg) {
      this.sendShow(newsendmsg)
    },
    getreceiveShow(newreceivemsg) {
      this.receiveShow(newreceivemsg)
    },
  },
  mounted() {
    this.info()
  },

  methods: {
    ...mapActions({
      setsendMsg: 'chat/setsendMsg',
      setselectreaceid: 'chat/setselectreaceid',
    }),
    // 推送
    dingtalkPush_two() {
      let len = this.chat_list.length
      for (let i = 0; i < len; i++) {
        if (this.chat_list[i].Types == 1) {
          let thisTime = this.chat_list[i].Time
          thisTime = thisTime.replace(/-/g, '/')
          let time = new Date(thisTime)
          time = time.getTime() / 1000
          this.CustName = this.chat_list[i].CustomerName
          if (new Date().getTime() / 1000 - time > 180) {
            this.myPhoneNum = this.getuserinfo.Phone
            dingPush(this).then((res) => {
              console.log(res)
            })
          }
        }
      }
    },
    // 系统推送
    notify() {
      var notification = new Notification('消息提醒', {
        body: '您有一条新的消息请及时回复！',
      })
    },
    changeval() {},
    // 表情选中
    selectIcon(val) {
      let emoji = '.' + val.match(/src=.(\S*).png/)[1] + '.png'
      console.log(emoji)
      this.emojiList.push(emoji)
      // console.log(this.emojiList);
    },
    //搜索按钮
    searchBtn() {
      this.info()
    },
    // 标签选择
    selectLabel(item) {
      labelList(this).then((res) => {
        this.dialogType = true
        let lab1 = []
        // 循环之前选中的标签id
        for (let i = 0; i < item.length; i++) {
          // 如果拥有父级id
          if (item[i].pid != null) {
            // 循环 标签状态树的第一级
            for (let j = 0; j < res.data.length; j++) {
              // 如果该状态树的一级的子集有值
              if (res.data[j].children.length != 0) {
                // 循环 二级状态树
                for (let k = 0; k < res.data[j].children.length; k++) {
                  // 如果之前选中的标签id的父id 等于 二级状态树下的id，就把该二级状态树的父id，添加到数组
                  if (item[i].pid == res.data[j].children[k].value) {
                    lab1.push([
                      res.data[j].children[k].pId,
                      item[i].pid,
                      item[i].value,
                    ])
                  } else {
                    // 否则就说明是一级，不需要操作， 直接添加改数据的pid 和value
                    lab1.push([item[i].pid, item[i].value])
                  }
                }
              }
            }
          } else {
            lab1.push([item[i].value])
          }
        }
        this.labelval = lab1
        this.accountData = res.data
      })
    },

    // 标签提交
    labelyes() {
      let labelType = true
      let labelArr = this.labelval
      let arr = []
      for (let i = 0; i < labelArr.length; i++) {
        arr.push(labelArr[i][labelArr[i].length - 1])
      }
      // 数组去重
      // let arr = Array.from(new Set(arr));
      for (let j = 0; j < arr.length; j++) {
        for (let k = 0; k < this.accountData.length; k++) {
          if (this.accountData[k].children.length != 0) {
            if (arr[j] == this.accountData[k].value) {
              labelType = false
            }
          }
          for (let t = 0; t < this.accountData[k].children.length; t++) {
            if (this.accountData[k].children[t].children.length != 0) {
              if (arr[j] == this.accountData[k].children[t].value) {
                labelType = false
              }
            }
          }
        }
      }
      if (labelType == true && arr.length != 0) {
        this.labelId = arr.join(',')
        setLabel(this).then((res) => {
          this.labelval = []
          this.dialogType = false

          chatList(this).then((res2) => {
            this.right_type = 1
            this.chat_list = res2.data
            this.getwaiter()
            this.dingtalkPush_two()
            this.userinfo()
          })
        })
      } else {
        this.$message.error('必须选择当前标签的最后一级作为选中对象')
      }
    },
    //获取接待id
    getwaiter() {
      getreceid(this).then((res) => {
        this.receid = res.data.Id
      })
    },
    // 新用户加入会话显示
    userAddShow(adduser) {
      let data = {
        CustomerName: adduser.userName,
        CustomerId: adduser.id,
        UserName: this.getuserinfo.sendName,
        UserId: this.getuserinfo.sendId,
        Time: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 19)
          .replace('T', ' '),
        Message: this.GetMsgs,
        LabelName: [],
        tips: true,
      }

      this.chat_list.unshift(data)
      console.log(this.chat_list)
      ;(this.detailList = []), (this.page = 1) //还原
      this.chat_state = 0 // 选中下标改变状态来更改样式
      this.customer_name = adduser.userName // 选中聊天的对方名字
      // this.head_img = adduser.id;
      this.user_id = this.getuserinfo.sendId // 当前会话客服id
      console.log(adduser)
      this.userInformationId = adduser.id
      this.setselectreaceid({
        data: this.userInformationId,
      })
      this.right_type = 1
      this.more_show = false
      this.$notify.info({
        title: '提示',
        message: '客户' + adduser.userName + '加入会话',
        position: 'bottom-right',
        duration: 30000,
      })
      getreceid(this).then((res) => {
        console.log(
          '新用户加入消息之后重新获取一遍接待id（接口）：' + res.data.Id
        )
        this.receid = res.data.Id
        const that = this
        console.log('是否是第二次：' + adduser.state)
        if (adduser.state == false) {
          //  this.sendMsg(this.receid,adduser.id,this.userInformationId,this.GetMsgs,2,0);
          this.setsendMsg({
            data: {
              receid: that.receid,
              send: this.getuserinfo.sendId,
              receive: that.userInformationId,
              msg: that.GetMsgs,
              type: 2,
              states: 0,
            },
          })
        }
        this.notify()
      })
    },
    // 发送私聊消息的展示
    sendShow(newSendmsg) {
      let datas = {
        UserId: newSendmsg.sendId,
        UserName: newSendmsg.sengName,
        Message: newSendmsg.message,
        Types: newSendmsg.types,
        CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 19)
          .replace('T', ' '),
        State: newSendmsg.states,
        UserHeadImage: this.getuserinfo.Image,
      }
      this.detailList.push(datas)
      // 滚动条到底
      this.$nextTick(() => {
        this.$refs.content_view.scrollTop =
          this.$refs.content_view.scrollHeight + 60
      })
      // 侧边栏的显示
      if (newSendmsg.states == 1) {
        this.chat_list[this.chat_state].Message = '图片'
        this.chat_list[this.chat_state].Time = new Date(
          +new Date() + 8 * 3600 * 1000
        )
          .toJSON()
          .substr(0, 19)
          .replace('T', ' ')
      } else if (newSendmsg.states == 0) {
        this.chat_list[this.chat_state].Message = newSendmsg.message
        this.chat_list[this.chat_state].Time = new Date(
          +new Date() + 8 * 3600 * 1000
        )
          .toJSON()
          .substr(0, 19)
          .replace('T', ' ')
      } else {
      }
    },
    // 接收私聊消息的展示
    receiveShow(newreceivemsg) {
      if (newreceivemsg.sendId == this.userInformationId) {
        let datas = {
          CustomerId: newreceivemsg.sendId,
          CustomerName: newreceivemsg.sengName,
          Message: newreceivemsg.message,
          Types: newreceivemsg.types,
          CreateTime: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 19)
            .replace('T', ' '),
          State: newreceivemsg.state,
          CustomerHeadImage: this.head_img,
        }
        this.detailList.push(datas)
      }
      // 滚动条到底
      this.$nextTick(() => {
        this.$refs.content_view.scrollTop =
          this.$refs.content_view.scrollHeight + 60
      })
      // 侧边栏的显示
      for (let i = 0; i < this.chat_list.length; i++) {
        if (newreceivemsg.sendId == this.chat_list[i].CustomerId) {
          if (newreceivemsg.state == 1) {
            this.chat_list[i].tips = true
            this.chat_list[i].Message = '图片'
            this.chat_list[i].Time = new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 19)
              .replace('T', ' ')
          } else if (newreceivemsg.state == 0) {
            // 侧边栏的显示
            this.chat_list[i].tips = true
            this.chat_list[i].Message = newreceivemsg.message
            this.chat_list[i].Time = new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 19)
              .replace('T', ' ')
          } else {
          }
        }
      }
    },

    // 左侧聊天列表的渲染
    info() {
      console.log(this.getselectreaceid)
      chatList(this).then((res) => {
        if (res.data.length == 0) {
          this.chat_list = []
          this.right_type = 0
        } else {
          this.right_type = 1
          this.chat_list = res.data
          this.customer_name = this.chat_list[0].CustomerName
          this.head_img = this.chat_list[0].HeadImage
          this.user_id = this.chat_list[0].UserId
          this.userInformationId = this.chat_list[0].CustomerId
          this.setselectreaceid({
            data: this.userInformationId,
          })
          this.getwaiter()
          this.dingtalkPush_two()
          this.userinfo()
        }
      })
    },
    // 聊天详情的渲染
    userinfo() {
      conversation(this).then((res) => {
        if (res.recordsTotal <= 10) {
          this.more_show = false
        } else {
          this.more_show = true
        }
        this.total = Math.ceil(res.recordsTotal / 10)
        this.detailList = res.data
        // 页面滚动到最底
        this.$nextTick(() => {
          this.$refs.content_view.scrollTop =
            this.$refs.content_view.scrollHeight + 60
        })
      })
    },
    // 列表的点击
    viewDetails(data, index) {
      this.page = 1 //还原
      this.chat_state = index // 选中下标改变状态来更改样式
      this.customer_name = data.CustomerName // 选中聊天的对方名字
      this.head_img = data.HeadImage
      this.user_id = data.UserId // 当前会话客服id
      this.userInformationId = data.CustomerId // 选中会话的对方id
      this.setselectreaceid({
        data: this.userInformationId,
      })
      this.chat_list[index].tips = false
      this.userinfo()
      this.getwaiter()
    },
    // 点击加载更多，渲染更多聊天内容
    more() {
      this.page++
      if (this.page <= this.total) {
        this.more_type = true
        conversation(this).then((res) => {
          for (let i = res.data.length - 1; i >= 0; i--) {
            this.detailList.unshift(res.data[i])
          }
          this.more_type = false
        })
      } else {
        this.more_type = false
        this.more_show = false
      }
    },
    // 消息发送
    sendOut() {
      this.chat_sendout = this.$refs.msgInputContainer.innerHTML
      if (this.chat_sendout == '') {
        this.$message.error('发送消息不能为空！')
      } else {
        this.setsendMsg({
          data: {
            receid: this.receid,
            send: this.getuserinfo.sendId,
            receive: this.userInformationId,
            msg: this.chat_sendout,
            type: 0,
            states: 0,
          },
        })
        this.chat_sendout = ''
        this.$refs.msgInputContainer.innerHTML = ''
        this.emojiList = []
      }
    },
    // 个人信息的展开
    user_information() {
      this.drawer = true
      getCustomerInfo(this).then((res) => {
        this.customerData = res.data
      })
    },
    // 选择图片
    handleAvatarSuccess(res, file) {
      let imgUrl = 'https://files.365lawhelp.com/' + res.data
      console.log(imgUrl)
      this.sendBtnType = true
      this.setsendMsg({
        data: {
          receid: this.receid,
          send: this.getuserinfo.sendId,
          receive: this.userInformationId,
          msg: imgUrl,
          type: 0,
          states: 1,
        },
      })
    },
    // 键盘事件
    keyDown(e) {
      if (e.ctrlKey && e.keyCode == 13) {
        this.chat_sendout = this.$refs.msgInputContainer.innerHTML
        if (this.chat_sendout == '') {
          this.$message.error('发送消息不能为空！')
        } else {
          //用户点击了ctrl+enter触发
          this.setsendMsg({
            data: {
              receid: this.receid,
              send: this.getuserinfo.sendId,
              receive: this.userInformationId,
              msg: this.chat_sendout,
              type: 0,
              states: 0,
            },
          })
          this.chat_sendout = ''
          this.$refs.msgInputContainer.innerHTML = ''
        }
      } else {
        console.log(e)
        //用户点击了enter触发
        // 执行一些逻辑方法
        if (e != undefined) {
          e.preventDefault() // 阻止浏览器默认的敲击回车换行的方法
        }
      }
    },
    // 快捷回复
    Fastreply() {
      this.quickType = 1
      quickList(this).then((res) => {
        this.quickData = res.data
      })
    },
    // 快捷发送
    sendQuick(content) {
      this.setsendMsg({
        data: {
          receid: this.receid,
          send: this.getuserinfo.sendId,
          receive: this.userInformationId,
          msg: content,
          type: 0,
          states: 0,
        },
      })
    },
    // 关闭快捷侧边栏
    ShutDown() {
      this.quickType = 0
    },
    // 结束会话
    end() {
      if (this.chat_list[this.chat_state].LabelName.length != 0) {
        this.setsendMsg({
          data: {
            receid: this.receid,
            send: this.getuserinfo.sendId,
            receive: this.userInformationId,
            msg: '能不能麻烦您对我的服务做出评价，万分感谢！',
            type: 0,
            states: 0,
          },
        })
        endSession(this).then((res) => {
          this.setsendMsg({
            data: {
              receid: this.receid,
              send: this.getuserinfo.sendId,
              receive: this.userInformationId,
              msg: '',
              type: 0,
              states: 2,
            },
          })
          this.info()
        })
      } else {
        this.$message.error('标签还未选择，请选择标签后结束会话！')
      }
    },
  },
}
</script>

<style scoped>
.chat_content_pc {
  height: 94vh;
  display: flex;
}
.chat_list {
  width: 350px;
  height: 94vh;
  border-right: 1px solid #ebebeb;
}
.chat_tips {
  width: 12px;
  height: 12px;
  background: red;
  border-radius: 50%;
  position: absolute;
  left: 57px;
  top: 18px;
}
.lable {
  margin-left: 32px;
  font-size: 20px;
  line-height: 60px;
  font-weight: bold;
}
/* 搜索框 */
.chat_input_pcbox {
  margin: 20px;
}
.search_chat_ipt {
  width: 80%;
}
/* 聊天列表 */
#chat_select {
  background-color: #f5f5f5;
}
.chats_content_box {
  height: 776px;
  overflow: hidden;
  overflow-y: scroll;
}
.chat_on_box {
  position: relative;
  width: 340px;
  height: 80px;
}

.chat_img {
  width: 40px;
  height: 40px;
  border-right: 50%;
  position: absolute;
  left: 24px;
  top: 18px;
}
.chat_time {
  font-size: 12px;
  color: #ccc;
  position: absolute;
  right: 24px;
  top: 18px;
}
.chat_name {
  width: 100px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  left: 80px;
  top: 16px;
}
.chat_userinfo {
  width: 100px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  position: absolute;
  left: 80px;
  top: 46px;
}
.select_label {
  position: absolute;
  bottom: 10px;
  right: 24px;
}
.tag {
  margin: 2px;
}
/* 聊天内容聊天详情 */
.chat_details {
  width: 1360px;
}
.chat_details2 {
  width: 962px;
}
.chat_details_head {
  border-bottom: 1px solid #ebebeb;
}
.active_img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
}
.chat_details_head span {
  display: inline-block;
  padding-top: 18px;
}
.head_btn {
  float: right;
  margin-top: 12px;
  margin-right: 20px;
}
/* 聊天内容 */
.chat_details_content {
  height: 720px;
  padding: 20px;
  border-bottom: 1px solid #ebebeb;
  overflow: hidden;
  overflow-y: scroll;
}
.tips {
  text-align: center;
  color: #778899;
  font-size: 12px;
  display: block;
}
/* 聊天细节 */
.chat_details_info_box img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.chat_details_active_time {
  display: inline-block;
  vertical-align: top;
  margin-left: 18px;
}
.chat_details_active_time span {
  font-size: 12px;
  color: #cccc;
  font-style: oblique;
}
.chat_details_sentence {
  background: #ebebeb;
  padding: 10px;
  border-radius: 6px;
  width: max-content;
  margin: 0 0 36px 0;
  max-width: 1000px;
  word-wrap: break-word;
}
.chat_my_right {
  text-align: end;
  margin-inline-end: 20px;
}

.chat_my_right_msgbox {
  margin-top: 18px;
}
.chat_details_sentence_s {
  background: #0a80ff;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  margin: 0 0 36px 0;
  max-width: 1000px;
  word-wrap: break-word;
  display: inline-block;
}
/* 聊天文本域部分 */
.chat_sendout_box {
  margin: 10px;
}
.chat_sendout_ipt {
  width: 900px;
  height: 62px;
  margin: 0px 20px 0 0;
  padding: 10px;
  display: inline-block;
  border: 1px solid #ccc;
  vertical-align: middle;
  overflow: hidden;
  overflow-y: scroll;
}
/* 用户信息 */
.user_customer {
  margin: 25px 15px;
}
.img_chat {
  width: 300px;
  height: 300px;
}
.avatar-uploader {
  display: inline-block;
  font-size: 24px;
  margin: 0 30px;
}
/* 快捷回复 */
.quick {
  width: 399px;
  border-left: 1px solid #ccc;
}
.quickTitle {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 30px;
}
.el-icon-close {
  float: right;
  margin-right: 30px;
}
.el-icon-refresh {
  float: right;
  margin-right: 10px;
}
.el-icon-picture-outline {
  font-size: 40px;
}
</style>