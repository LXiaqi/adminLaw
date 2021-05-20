<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-button type="primary" size="medium" @click="add()">添加</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%" :show-header="status">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-table :data="scope.row.children" style="width: 100%" :show-header="status">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-table :data="scope.row.children" style="width: 100%" :show-header="status">
                                <el-table-column label="三级标签" prop="label"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                                        <el-button type="danger" size="mini" @click="del(scope.row.value)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column label="二级标签" prop="label"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini" @click="del(scope.row.value)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <el-table-column prop="label" label="一级标签"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="del(scope.row.value)">删除</el-button>
            </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 添加的模态框 -->
    <el-dialog  :title="dialogTitle" :visible.sync="dialogType">
      <el-form >
        <el-form-item label="标签名:" label-width="90px">
          <el-input v-model="name" autocomplete="off" placeholder="标签名" class="user_ipt" ></el-input>
        </el-form-item>
        <el-form-item label="上级标签" label-width="90px">
          <el-cascader v-model="value" :options="accountDataTwo" @change="handleChange" :show-all-levels="false" clearable :props="{ checkStrictly: true }"></el-cascader>
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
import { addLabel,labelList,delLabel,TwoLabelTree,editLabel} from "@/api/label";
import bread from "@/components/bread";
import untilsTime from "@/utils/Datetime";
export default {
  props: [],
  components: {bread},
  data() {
    return {
        dialogType:false, // 添加的模态框隐藏显示
        accountData: [], // 客服列表
        dialogTitle:'', // 模态框的title
        status:false, // 表头隐藏
        name:'', // 添加的标签名
        value:'', //添加的选中的 父级id
        delId:'', // 删除的id
        accountDataTwo:[],// 一二级下拉列表
        editid:'', // 编辑的id
    };
  },
  created() {
    this.info();    
  },
  mounted() {

  },
  methods: {
      // 客服列表的请求和渲染
      info() {
         labelList(this).then(res => {
             this.accountData = res.data;
         })
      },
      // 添加
      add() {
          this.dialogTitle ='添加';
          this.dialogType = true;
          TwoLabelTree(this).then(res => {
              this.accountDataTwo = res.data;
          })
      },
      // 添加的提交事件
      submit() {
        if(this.dialogTitle == '添加') {
            addLabel(this).then(res => {
                this.dialogType = false;
                this.name = '';
                this.value = '';
                this.info();
            })
        }else{
            editLabel(this).then(res => {
                this.dialogType = false;
                this.name = '';
                this.value = '';
                this.editid = ''; 
                this.info();
            })
        } 
      },
      // 选中的父级id
      handleChange(val) {
          console.log(val);
          this.value = val[val.length-1];
      },
      // 编辑
      edit(row) {
        this.dialogTitle ='编辑';
        TwoLabelTree(this).then(res => {
            this.accountDataTwo = res.data;
            this.name = row.label;
            this.value = row.pId;
            this.editid = row.value;
            this.dialogType = true;
        })
      },
      // 删除
      del(id) {
         this.delId = id;
         delLabel(this).then(res => {
             this.info();
         })
      }
  },
};
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