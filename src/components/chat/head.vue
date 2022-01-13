<template>
  <div class="head" v-show="name != ''">
    <span>{{ name }}</span>
    <el-button
      size="mini"
      class="el-icon-s-unfold"
      @click="openDetails()"
    ></el-button>
    <el-drawer
      title="用户信息"
      :visible.sync="drawer"
      direction="rtl"
      size="20%"
    >
      <Details v-if="drawer" :KHId="id" />
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Details from './details.vue'
export default {
  components: { Details },
  data() {
    return {
      name: '',
      id: '',
      drawer: false,
    }
  },
  computed: {
    ...mapGetters({
      getoverConversation: 'chat/getoverConversation',
    }),
  },
  watch: {
    getoverConversation(newdata) {
      this.removeSession(newdata)
    },
  },
  mounted() {
    this.info()
  },
  methods: {
    info() {
      this.$bus.$on('selectChat', (msg) => {
        this.name = msg.CustomerName
        this.id = msg.CustomerId
      })
    },
    // 清除会话
    removeSession(row) {
      if (row.type) {
        this.name = ''
      }
    },
    //查看详情
    openDetails() {
      this.drawer = true
    },
  },
}
</script>

<style scoped>
.head {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  color: #1c2438;
  font-size: 18px;
  font-weight: bold;
  line-height: 50px;
  text-shadow: #76828c 0 0 0.1rem;
  border-bottom: 1px solid #dcdcdc;
}
.el-icon-s-unfold {
  float: right;
  margin-top: 10px;
}
</style>