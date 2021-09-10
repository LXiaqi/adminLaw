<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-input
          class="search_ipt"
          v-model="receptionName"
          placeholder="接待人"
        ></el-input>
        <el-input
          class="search_ipt"
          v-model="customerName"
          placeholder="客户姓名"
        ></el-input>
        <el-input
          class="search_ipt"
          v-model="phone"
          placeholder="手机号"
        ></el-input>
        <el-date-picker
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button type="primary" size="medium" @click="search()"
          >查找</el-button
        >
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button size="medium" type="success" @click="chatexport()"
          >导出</el-button
        >
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column prop="SendId" label="发送ID"></el-table-column>
        <el-table-column prop="SendName" label="发送人"></el-table-column>
        <el-table-column prop="ToId" label="接收ID"></el-table-column>
        <el-table-column prop="ToName" label="接收人"></el-table-column>
        <el-table-column prop="Message" label="消息内容">
          <template slot-scope="scope">
            <span
              class="msg"
              v-show="!scope.row.img"
              v-html="scope.row.Message"
            ></span>
            <el-image
              class="img"
              v-if="scope.row.img"
              :src="'https://images.weserv.nl/?url=' + scope.row.Message"
              alt=""
              :preview-src-list="[
                'https://images.weserv.nl/?url=' + scope.row.Message,
              ]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="时间"></el-table-column>
      </el-table>
      <pagination
        v-show="listQuery.total > 10"
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="info()"
      />
    </div>
  </div>
</template>

<script>
import { chatList } from '@/api/chatadmin'
import Pagination from '@/components/Pagination'
import bread from '@/components/bread'
import untilsTime from '@/utils/Datetime'
export default {
  components: {
    Pagination,
    bread,
  },
  data() {
    return {
      accountData: [], // 聊天列表
      listQuery: {
        page: 1, // 当前页码
        limit: 10, // 表格一页的数量
        searchStatus: false,
        total: 0, // 总条数
      },
      customerName: '', // 客户姓名
      receptionName: '', // 接待人
      phone: '', // 手机号
      time: ['', ''], // 开始时间和结束时间的数组
    }
  },
  created() {
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      chatList(this).then((res) => {
        if (res.data.length != 0) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].CreateTime = untilsTime.FormatToDate(
              res.data[i].CreateTime
            )
            if (
              res.data[i].Message.indexOf('https://files.365lawhelp.com') == -1
            ) {
              res.data[i].img = false
            } else {
              res.data[i].img = true
            }
          }
        }
        this.accountData = res.data
        this.listQuery.total = res.recordsTotal
      })
    },
    // 查找
    search() {
      this.listQuery.page = 1
      console.log(this.time)

      this.info()
    },
    // 重置
    reset() {
      this.customerName = ''
      this.receptionName = ''
      this.phone = ''
      this.time = ['', '']
      this.info()
    },
    // 导出
    chatexport() {
      window.location.href =
        '/ChatHistory/ExportChatHistory?phone=' +
        this.phone +
        '&receptionName=' +
        this.receptionName +
        '&customerName=' +
        this.customerName +
        '&startTime=' +
        this.time[0] +
        '&endTime=' +
        this.time[1]
    },
  },
}
</script>

<style scoped >
.content {
  margin: 20px;
}
.searchbox {
  margin: 10px;
}
.search_ipt {
  width: 200px;
}
.msg {
  color: red;
}
.img {
  width: 46px;
  height: 46px;
}
</style>