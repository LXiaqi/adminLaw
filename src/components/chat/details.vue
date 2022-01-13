<template>
  <div class="quick">
    <div class="user_customer">客户名称：{{ customerData.CustomerName }}</div>
    <div class="user_customer">
      客户类型：{{ customerData.Types == 1 ? '个人' : '企业' }}
    </div>
    <div class="user_customer">会员信息：{{ customerData.Vip }}</div>
    <div class="user_customer">会员年限：{{ customerData.VipYears }}</div>
    <div class="user_customer">客户地址：{{ customerData.Location }}</div>
    <div class="user_customer">所属群聊：{{ customerData.GroupName }}</div>
    <div class="user_customer">
      专属法务：{{ customerData.LegalGroupLeader }}
    </div>
    <div class="user_customer">销售：{{ customerData.Salesman }}</div>
    <div class="user_customer">联系方式：{{ customerData.Phone }}</div>
  </div>
</template>

<script>
import { getCustomerInfo } from '@/api/waiters'
export default {
  props: ['KHId'],
  data() {
    return {
      customerData: {},
    }
  },
  mounted() {
    this.info()
  },
  methods: {
    info() {
      console.log(this.KHId)
      getCustomerInfo(this, this.KHId).then((res) => {
        console.log(res)
        this.customerData = res.data
      })
    },
    // sendQuick(msg) {
    //   this.$emit('selectMsg', msg)
    // },
  },
}
</script>

<style scoped>
.quick {
  padding-left: 20px;
  font-size: 14px;
}
</style>