<template>
  <div class="head" v-show="name != ''">
    <span>{{ name }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      name: '',
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
      })
    },
    // 清除会话
    removeSession(row) {
      if (row.type) {
        this.name = ''
      }
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
</style>