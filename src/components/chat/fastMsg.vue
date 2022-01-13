<template>
  <div class="quick">
    <el-table :data="quickData" height="850" style="width: 100%">
      <el-table-column prop="Contents" label="内容" width="300">
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="sendQuick(scope.row.Contents)"
            >选中</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { quickList } from '@/api/waiters'
export default {
  props: ['id'],
  data() {
    return {
      quickData: [],
    }
  },
  mounted() {
    this.info()
  },
  methods: {
    info() {
      quickList(this, this.id).then((res) => {
        this.quickData = res.data
      })
    },
    sendQuick(msg) {
      this.$emit('selectMsg', msg)
    },
  },
}
</script>

<style scoped>
</style>