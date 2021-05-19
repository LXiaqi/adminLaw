<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
</el-breadcrumb>
</div>  
</template>

<script>
export default {
    name: 'bread',
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped>
.el-breadcrumb {
    height: 60px;
    line-height: 60px;
    background: #fff;
    padding-left: 20px;
}
</style>