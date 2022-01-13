<template>
  <div>
    <bread></bread>
    <div class="content" v-show="!addshow">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-button type="success" size="medium" @click="add()">添加</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%" :show-header="status">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.children"
              style="width: 100%"
              :show-header="status"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table
                    :data="scope.row.children"
                    style="width: 100%"
                    :show-header="status"
                  >
                    <el-table-column
                      label="三级标签"
                      prop="label"
                    ></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="二级标签" prop="label"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="一级标签"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编辑</el-button
            > -->
            <el-button type="danger" size="mini" @click="del(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddNav v-if="addshow" @closeAdd="closeAdd" />
  </div>
</template>

<script>
import bread from '@/components/bread'
import AddNav from './addNav.vue'
import untilsTime from '@/utils/Datetime'
import { getNavLevel, delNavLevel } from '@/api/navLevel'

export default {
  props: [],
  components: { bread, AddNav },
  data() {
    return {
      accountData: [], // 导航列表
      status: false, // 表头隐藏
      addshow: false, // 添加部分的显示隐藏
    }
  },
  created() {
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      getNavLevel(this).then((res) => {
        this.accountData = res.data
      })
    },
    // 添加
    add() {
      this.addshow = true
    },
    closeAdd(e) {
      this.addshow = e
      this.info()
    },
    //删除
    del(row) {
      console.log(row)
      this.$confirm('此操作将永久删除该分类下的所有分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delNavLevel(this, row.value).then((res) => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.info()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
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
.user_ipt {
  width: 220px;
}
</style>