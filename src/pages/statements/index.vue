<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        
        <el-button type="primary" size="medium" @click="search()">查找</el-button>
        <el-button size="medium" @click="reset()">重置</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column prop="Contents" label="内容" ></el-table-column>
        <el-table-column prop="Types" label="类型" ></el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <span>{{scope.row.UseStatuz == 0 ? '未使用' : '使用中'}}</span> 
           </template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" ></el-table-column>
        <el-table-column  label="操作">
            <template slot-scope="scope">
               <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="del(scope.row.Id)">删除</el-button>
           </template>
        </el-table-column>
      </el-table>
      <pagination v-show="listQuery.total > 10" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="info()"/>
    </div>

  </div>
</template>

<script>
import { statementsList,DelStatements } from "@/api/statements";
import Pagination from "@/components/Pagination";
import bread from "@/components/bread";

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
       useStatuz:'', // 状态
       types:'', // 类型
       delId:[], // 删除的id
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
          statementsList(this).then(res => {
              for(let i = 0; i < res.data.length; i++){
                  switch(res.data[i].Types){
                    case 0:
                    res.data[i].Types = '问候语';
                    break;
                    case 1:
                    res.data[i].Types = '企业快捷语';
                    break;
                    case 2:
                    res.data[i].Types = '个人快捷语 ';
                    break;  
                    case 3:
                    res.data[i].Types = '自动回复';
                    break;  
                    default:
                    break;  
                  }
              }
              this.accountData = res.data;
              this.listQuery.total = res.recordsTotal
          })
      },
      // 查找
      search() {
         
          this.info();
      },
      // 重置
      reset() {
        
        this.info();
      },
      // 删除
      del(id) {
          this.delId = [id];
          DelStatements(this).then(res => {
              this.info();
          })
      }
      
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