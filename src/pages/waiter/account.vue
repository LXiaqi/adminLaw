<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <el-input class="search_ipt" v-model="username" placeholder="账号"></el-input>
        <el-button type="primary" size="medium" @click="search()">查找</el-button>
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button type="success" size="medium" @click="add()">添加</el-button>
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column prop="UserName" label="账号" ></el-table-column>
        <el-table-column prop="Nick" label="昵称" ></el-table-column>
        <el-table-column  label="头像" >
            <template slot-scope="scope">
              <el-image class="img"  :src="scope.row.HeadImg" alt="" :preview-src-list="[scope.row.HeadImg]"></el-image>
            </template>
        </el-table-column>
         <el-table-column prop="Phone" label="手机号" ></el-table-column>
         <el-table-column prop="state" label="状态" ></el-table-column>
        <el-table-column prop="Age" label="年龄" ></el-table-column>
        <el-table-column label="性别">
            <template slot-scope="scope">
                <span>{{scope.row.Sex == 1 ? '男' : '女'}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" >
           <template slot-scope="scope">
                   <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                   <el-button type="danger" size="mini" @click="del(scope.row.Id)">删除</el-button>
           </template>
        </el-table-column>
      </el-table>
      <pagination v-show="listQuery.total > 10" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="info()"/>
    </div>
    <!-- 添加和编辑的模态框 -->
    <el-dialog  :title="dialogTitle" :visible.sync="dialogType">
      <el-form :model="userinfo">
        <el-form-item label="头像" label-width="90px">
          <el-upload
            class="avatar-uploader"
            action="/BasicData/UploadFiles"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="userinfo.HeadImg" :src="userinfo.HeadImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" label-width="90px">
          <el-input v-model="userinfo.UserName" autocomplete="off" placeholder="账号" class="user_ipt"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="90px">
          <el-input v-model="userinfo.Nick" autocomplete="off" placeholder="昵称" class="user_ipt"></el-input>
        </el-form-item>
         <el-form-item label="手机号" label-width="90px">
          <el-input v-model="userinfo.Phone" autocomplete="off" placeholder="手机号" class="user_ipt"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="90px">
          <el-input placeholder="密码" v-model="userinfo.Pwd" autocomplete="off" show-password class="user_ipt"></el-input>
        </el-form-item>
        <el-form-item label="年龄" label-width="90px">
          <el-input v-model="userinfo.Age" autocomplete="off" class="user_ipt"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="90px">
          <el-radio-group v-model="userinfo.Sex">
            <el-radio :label=1>男</el-radio>
            <el-radio :label=0>女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="no()">取 消</el-button>
        <el-button type="primary" @click="submitUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { accountList,Delaccount,Addaccount,Editaccount } from "@/api/waiter";
import Pagination from "@/components/Pagination";
import bread from "@/components/bread";

export default {
  props: [],
  components: {
    Pagination,bread
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
        username:'', // 输入框内容
        delId:[], // 选中的id
        dialogTitle:'', // 添加还是编辑的title
        dialogType:false, // 模态框的显示隐藏
        userinfo: {}, // 添加编辑 的模态框数据
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
          accountList(this).then(res => {
              for(let i = 0; i < res.data.length; i++){
                switch(res.data[i].Statuz){
                    case 0:
                    res.data[i].state = '未登录';
                    break;
                    case 1:
                    res.data[i].state = '在线';
                    break;
                    case 2:
                    res.data[i].state = '示忙 ';
                    break;  
                    case 3:
                    res.data[i].state = '其它';
                    break;  
                    case 4:
                    res.data[i].state = '离线';
                    break;  
                    default:
                    break;  
                  }
              }
              this.accountData = res.data;
              this.listQuery.total = res.recordsTotal
          })
      },
      // 查找
      search() {
        this.listQuery.page = 1;
        this.info();
      },
      // 重置
      reset() {
        this.username = '';
        this.info();
      },
      // 删除
      del(id) {
        this.delId = [id];
        Delaccount(this).then(res => {
          this.info();
        })
      },
      // 添加
      add() {
        this.userinfo = {};
        this.dialogType = true;
        this.dialogTitle = '添加客服账号'
      },
      // 用户信息提交
      submitUser() {
        if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.userinfo.Phone))){
            this.$message.error('手机号码有误请重新输入');
            return;
        }
        if( this.dialogTitle == '添加客服账号') {
          Addaccount(this).then(res => {
            this.dialogType = false;
            this.info();
            this.userinfo = {}
          })
        }else {
          Editaccount(this).then(res => {
              this.dialogType = false;
              this.info();
              this.userinfo = {}
          })
        }
        
      },
      // 编辑模态框
      edit(user) {
        this.dialogType = true;
        this.dialogTitle = '编辑账户'
        this.userinfo = user;
      },
      // 头像上传
      handleAvatarSuccess(res) {
        console.log(res.data);
        this.userinfo.HeadImg = 'https://files.365lawhelp.com/'+res.data;
      },
      no() {
        this.dialogType = false;
        this.info();
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
.search_ipt {
  width: 200px;
}
.user_ipt {
  width: 220px;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }
  .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
  .img {
    width: 50px;
    height: 50px;
  }
</style>