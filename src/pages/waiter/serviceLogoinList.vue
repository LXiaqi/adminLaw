<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-input class="search_ipt" v-model="username" placeholder="用户名"></el-input>
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
    </el-date-picker>
        <el-button type="primary" size="medium" @click="search()">查找</el-button>
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button type="success" size="medium" @click="Exportist()">导出</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column prop="UserName" label="用户名" ></el-table-column>
        <el-table-column prop="LoginTime" label="登录时间" ></el-table-column>
        <el-table-column prop="OutTime" label="退出时间" ></el-table-column>
        <el-table-column prop="Number" label="接待量" ></el-table-column>
        <el-table-column prop="OnlineLength" label="在线时长" ></el-table-column>
        <el-table-column prop="ShowBusyLength" label="示忙时长" ></el-table-column>
        <el-table-column prop="OtherLength" label="其它时长" ></el-table-column>
        <el-table-column prop="AverageResponseTime" label="平均响应时长" ></el-table-column>
        <el-table-column prop="TimeOutNumber" label="超时次数" ></el-table-column>
        <el-table-column prop="TodayTime" label="日期" ></el-table-column>
      </el-table>
      <pagination v-show="listQuery.total > 10" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="info()"/>
    </div>

  </div>
</template>

<script>
import { serviceLogoinList, ExportUserOnline} from "@/api/waiter";
import Pagination from "@/components/Pagination";
import bread from "@/components/bread";
import untilsTime from "@/utils/Datetime";
export default {
  props: [],
  components: {
    Pagination,bread
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
        username:'',
        time:['',''],// 开始时间和结束时间的数组
    };
  },
  created() {
    this.info();    
  },
  mounted() {

  },
  methods: {
      // 客服列表的请求和渲染
      info() {
          serviceLogoinList(this).then(res => {
            for(let i = 0; i < res.data.length;i++){
              res.data[i].LoginTime =  untilsTime.FormatToDate(res.data[i].LoginTime);
              res.data[i].OutTime =  untilsTime.FormatToDate(res.data[i].OutTime);
            }
              this.accountData = res.data;
              this.listQuery.total = res.recordsTotal
          })
      },
      // 查找
      search() {
          this.listQuery.page = 1;
          if(this.time[0] != '' && this.time[1] != '') {
            this.time[0] = untilsTime.formateDate(this.time[0].getTime());
            this.time[1] = untilsTime.formateDate(this.time[1].getTime());
          }
          this.info();
      },
      // 重置
      reset() {
        this.username = '';
        this.time = ['',''];
        this.info();
      },
      // 导出
      Exportist() {
        window.location.href = '/UserInfo/ExportUserOnline?userName='+this.username+'&startTime='+this.time[0]+'&endTime='+this.time[1];
      },
      
  },
};
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