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
        <el-table-column prop="UserName" label="客服名称"></el-table-column>
        <el-table-column prop="CustomerName" label="客户名称"></el-table-column>
        <el-table-column prop="Location" label="客户地址"></el-table-column>
        <el-table-column prop="Phone" label="手机号"></el-table-column>
        <el-table-column prop="GroupName" label="群名"></el-table-column>
        <el-table-column prop="LegalGroupLeader" label="法务"></el-table-column>
        <el-table-column prop="Salesman" label="销售"></el-table-column>
        <el-table-column prop="Name" label="标签"></el-table-column>
        <el-table-column prop="Satisfaction" label="评价"></el-table-column>
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
import { detailsList } from '@/api/chatadmin'
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
    }
  },
  created() {
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      detailsList(this).then((res) => {
        if (res.data.length != 0) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].CreateTime = untilsTime.FormatToDate(
              res.data[i].CreateTime
            )
            switch (res.data[i].Satisfaction) {
              case 0:
                res.data[i].Satisfaction = '非常满意'
                break
              case 1:
                res.data[i].Satisfaction = '满意'
                break
              case 2:
                res.data[i].Satisfaction = '一般 '
                break
              case 3:
                res.data[i].Satisfaction = '差'
                break
              default:
                break
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
        '/Reception/ExportReception?phone=' +
        this.phone +
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
</style>