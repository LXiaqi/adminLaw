<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-input
          class="search_ipt"
          v-model="phone"
          placeholder="手机号"
        ></el-input>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button type="primary" size="medium" @click="search()"
          >查找</el-button
        >
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button type="success" size="medium" @click="Exportist()"
          >导出</el-button
        >
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column
          prop="OrderCode"
          label="订单号"
          min-width="45"
        ></el-table-column>
        <el-table-column prop="Msg" label="问题描述"> </el-table-column>
        <el-table-column prop="Remarks" label="补充内容"></el-table-column>
        <el-table-column label="图片" min-width="40">
          <template slot-scope="scope">
            <el-image
              class="img_"
              v-if="scope.row.Images.length != 0"
              :src="'https://images.weserv.nl/?url=' + scope.row.Images[0]"
              :preview-src-list="
                'https://images.weserv.nl/?url=' + scope.row.Images
              "
              alt=""
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.CustomerInfo.CustomerName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="40">
          <template slot-scope="scope">
            <span>{{ scope.row.Phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接待人" min-width="30">
          <template slot-scope="scope">
            <span>{{ scope.row.UserInfo.UserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="30">
          <template slot-scope="scope">
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="时间"></el-table-column>

        <!-- <el-table-column prop="Explain" label="处理说明" ></el-table-column> -->

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getSchedule(scope.row.Id)"
              >查看</el-button
            >
            <el-button
              type="warning"
              :disabled="scope.row.state == '已处理'"
              size="mini"
              @click="dispose(scope.row.Id)"
              >处理</el-button
            >
            <el-button type="danger" size="mini" @click="del(scope.row.Id)"
              >结束</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="listQuery.total > 10"
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="info()"
      />
    </div>
    <!-- 留言处理模态框 -->
    <el-dialog title="处理" :visible.sync="dialogType">
      <el-form>
        <el-form-item label="回复:" label-width="90px">
          <el-input
            v-model="Explain"
            autocomplete="off"
            placeholder="输入回复内容"
            class="user_ipt"
            type="textarea"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogType = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看处理进度 -->
    <el-dialog title="处理进度" :visible.sync="schedule" class="dialogbox">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.CreateTime"
          placement="top"
          v-for="item in scheduleList"
          :key="item.index"
        >
          <el-card>
            <h4>处理内容:{{ item.Explain }}</h4>
            <p>处理人:{{ item.CreateUser }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="schedule = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { LeaveMsgList, reply, GetDealInfo, FinishDeal } from '@/api/leaveMsg'
import Pagination from '@/components/Pagination'
import bread from '@/components/bread'
import untilsTime from '@/utils/Datetime'
export default {
  props: [],
  components: {
    Pagination,
    bread,
  },
  data() {
    return {
      accountData: [], // 客服列表
      listQuery: {
        page: 1, // 当前页码
        limit: 10, // 表格一页的数量
        searchStatus: false,
        total: 0, // 总条数
      },
      phone: '',
      time: ['', ''], // 开始时间和结束时间的数组
      dialogType: false, // 模态框状态
      Explain: '', // 回复内容
      replyid: '', // 回复id
      schedule: false,
      scheduleId: '',
      scheduleList: [],
    }
  },
  created() {
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      LeaveMsgList(this).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].CreateTime = untilsTime.FormatToDate(
            res.data[i].CreateTime
          )
          if (res.data[i].DealTime != null) {
            res.data[i].DealTime = untilsTime.FormatToDate(res.data[i].DealTime)
          }
          if (res.data[i].Statuz == 0) {
            res.data[i].state = '未处理'
          } else if (res.data[i].Statuz == 1) {
            res.data[i].state = '已处理'
          } else {
            res.data[i].state = '处理中'
          }
        }
        this.accountData = res.data
        this.listQuery.total = res.recordsTotal
      })
    },
    // 查找
    search() {
      this.listQuery.page = 1

      this.info()
    },
    // 重置
    reset() {
      this.phone = ''
      this.time = ['', '']
      this.info()
    },
    // 导出
    Exportist() {
      window.location.href =
        '/MessageOrder/ExportMsgOrder?phone=' +
        this.phone +
        '&startTime=' +
        this.time[0] +
        '&endTime=' +
        this.time[1]
    },
    // 处理
    dispose(id) {
      this.replyid = id
      this.dialogType = true
    },
    //提交
    submit() {
      reply(this).then((res) => {
        this.dialogType = false
        this.Explain = ''
        this.info()
      })
    },
    // 查看处理进度
    getSchedule(id) {
      this.schedule = true
      this.scheduleId = id
      GetDealInfo(this).then((res) => {
        this.scheduleList = res.data
      })
    },
    // 结束
    del(id) {
      this.scheduleId = id
      FinishDeal(this).then((res) => {
        this.info()
      })
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
.red {
  color: red;
}
.green {
  color: green;
}
.user_ipt {
  width: 580px;
}
.img_ {
  width: 60px;
  height: 60px;
}

.dialogbox >>> .el-dialog__body {
  overflow-y: scroll;
  height: 580px;
}
</style>