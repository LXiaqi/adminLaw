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
            breadList:[]
        }
    },

    created() {
        this.getBreadcrumb();
    },
    mounted() {

    },
    methods: {
        getBreadcrumb() {
            console.log(this.information);
            // let matched = this.$route.matched.filter(item => item.name)
            //  console.log(matched);
        }
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