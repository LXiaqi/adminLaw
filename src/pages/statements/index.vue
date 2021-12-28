<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <span>类型：</span>
        <el-select v-model="types" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span>状态：</span>
        <el-select v-model="useStatuz" placeholder="请选择">
          <el-option
            v-for="item in useStatuzList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="search()"
          >查找</el-button
        >
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button type="success" size="medium" @click="add()">新增</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column prop="Contents" label="内容"></el-table-column>
        <el-table-column prop="styleType" label="类型"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.UseStatuz == 0 ? '未使用' : '使用中' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人"></el-table-column>
        <el-table-column label="操作">
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
    <!-- 添加和编辑的模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogType">
      <el-form :model="language">
        <el-form-item label="类型" label-width="90px">
          <el-select v-model="language.Types" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="90px">
          <el-select v-model="language.UseStatuz" placeholder="请选择">
            <el-option
              v-for="item in useStatuzList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" label-width="90px">
          <el-input
            v-model="language.Contents"
            autocomplete="off"
            placeholder="内容"
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
  </div>
</template>

<script>
import {
  statementsList,
  DelStatements,
  AddStatements,
  EditStatements,
} from '@/api/statements'
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
      useStatuz: '', // 状态
      types: '', // 类型
      delId: [], // 删除的id
      typeList: [
        {
          value: 0,
          label: '问候语',
        },
        {
          value: 1,
          label: '企业快捷语',
        },
        {
          value: 2,
          label: '个人快捷语',
        },
        {
          value: 3,
          label: '自动回复',
        },
      ], // 类型列表
      useStatuzList: [
        {
          value: 0,
          label: '未使用',
        },
        {
          value: 1,
          label: '使用中',
        },
      ], //状态列表
      language: {}, // 添加或者编辑的数据存放对象
      dialogType: false, // 添加或者编辑的模态框 显示隐藏
      dialogTitle: '', // 模态框的title （添加或者编辑）
    }
  },
  created() {
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      statementsList(this).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          switch (res.data[i].Types) {
            case 0:
              res.data[i].styleType = '问候语'
              break
            case 1:
              res.data[i].styleType = '企业快捷语'
              break
            case 2:
              res.data[i].styleType = '个人快捷语 '
              break
            case 3:
              res.data[i].styleType = '自动回复'
              break
            default:
              break
          }
        }
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
      this.useStatuz = ''
      ;(this.types = ''), (this.listQuery.page = 1)
      this.info()
    },
    // 删除
    del(id) {
      this.delId = [id]
      DelStatements(this).then((res) => {
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
      if (this.dialogTitle == '添加') {
        AddStatements(this).then((res) => {
          ;(this.language = {}), (this.dialogType = false)
          this.info()
        })
      } else {
        EditStatements(this).then((res) => {
          ;(this.language = {}), (this.dialogType = false)
          this.info()
        })
      }
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
.user_ipt {
  width: 420px;
}
</style>