<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-input class="search_ipt" v-model="keywords"></el-input>
        <el-button type="primary" size="medium" @click="search()"
          >查找</el-button
        >
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button type="success" size="medium" @click="add()">新增</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 99%" height="680">
        <el-table-column
          prop="keywords"
          label="关键字"
          width="400"
        ></el-table-column>
        <el-table-column prop="Contents" label="内容"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="del(scope.row.Id)"
              >删除</el-button
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogType" width="30%">
      <el-form label-position="right" label-width="90px">
        <el-form-item label="关键字：">
          <el-input v-model="language.keywords"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input
            v-model="language.Contents"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogType = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getKnowledg, addKnowledg, delKnowledg } from '@/api/knowledge'
import Pagination from '@/components/Pagination'
import bread from '@/components/bread'
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
      keywords: '',
      dialogType: false, //模态框的隐藏显示
      dialogTitle: '', // 模态框是新增还是编辑
      language: {
        keywords: '',
        Contents: '',
      }, // 模态框内容
    }
  },
  created() {
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      getKnowledg(this).then((res) => {
        console.log(res)
        this.accountData = res.data
        this.listQuery.total = res.Total
      })
    },
    // 查找
    search() {
      this.listQuery.page = 1
      this.info()
    },
    // 重置
    reset() {
      this.keywords = ''
      this.listQuery.page = 1
      this.info()
    },
    // 删除
    del(id) {
      delKnowledg(this, id).then(() => {
        this.info()
      })
    },
    // 添加
    add() {
      this.language = {}
      this.dialogType = true
      this.dialogTitle = '添加'
    },
    // 编辑
    edit(row) {
      this.dialogType = true
      this.dialogTitle = '编辑'
      this.language = row
    },
    // 添加或者编辑的提交
    submit() {
      let type
      if (this.dialogTitle == '添加') {
        type = 0
      } else {
        type = 1
      }
      addKnowledg(this, type).then((res) => {
        if (res.success) {
          this.dialogType = false
          this.language = {}
          this.info()
        }
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
  margin: 0 12px;
}
.user_ipt {
  width: 420px;
}
</style>