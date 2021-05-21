<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="item in breadList" :key ="item.index">{{item.meta.title}}</el-breadcrumb-item>
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
            let matched = this.$route.matched.filter(item => item.name)
             this.breadList = matched
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