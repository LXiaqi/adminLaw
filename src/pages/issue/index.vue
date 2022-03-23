<template>
  <div>
    <bread></bread>
    <div class="content">
      <!-- 头部信息 -->
      <div class="searchbox">
        <span>关键字：</span>
        <el-input
          class="search_ipt"
          v-model="keywords"
          placeholder="输入群名、用户名、手机号"
        ></el-input>
        <span>VIP类型：</span>
        <el-select v-model="vipType" placeholder="请选择">
          <el-option label="普通用户" :value="0"> </el-option>
          <el-option label="VIP" :value="3"> </el-option>
          <el-option label="SVIP" :value="13"> </el-option>
        </el-select>
        <span>状态：</span>
        <el-select v-model="status" placeholder="请选择">
          <el-option label="待处理" :value="0"> </el-option>
          <el-option label="处理中" :value="1"> </el-option>
          <el-option label="已完成" :value="2"> </el-option>
        </el-select>
        <span>时间：</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button type="primary" size="medium" @click="search()"
          >查找</el-button
        >
        <el-button size="medium" @click="reset()">重置</el-button>
        <el-button type="success" size="medium" @click="newOrder()"
          >新建</el-button
        >
      </div>
      <!-- 表格数据 -->
      <el-table :data="accountData" style="width: 100%">
        <el-table-column align="center" prop="GroupName" label="群聊名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="UserName"
          label="绑定用户"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="Phone"
          label="手机号"
          width="110"
        ></el-table-column>
        <el-table-column align="center" label="VIP类型" width="80">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.VipType === 0
                  ? '普通用户'
                  : scope.row.VipType === 3
                  ? 'VIP'
                  : 'SVIP'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="AgentName"
          label="所属代理商"
        ></el-table-column>

        <el-table-column
          prop="Contents"
          align="center"
          label="反馈内容"
        ></el-table-column>
        <el-table-column
          prop="Reminder"
          label="催单次数"
          width="80"
        ></el-table-column>

        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.Status === 0
                  ? '待处理'
                  : scope.row.Status === 1
                  ? '处理中'
                  : '已完成'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="提交人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="CustomerService"
          label="处理客服"
          align="center"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="SubmitTime"
          label="时间"
          max-width="80"
        ></el-table-column>
        <el-table-column align="center" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getSchedule(scope.row.Id)"
              >查看</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="dispose(scope.row.Id)"
              v-show="scope.row.Status != 2 && userType != 0"
              >处理</el-button
            >
            <el-button
              type="danger"
              v-show="scope.row.Status != 2 && userType != 0"
              size="mini"
              @click="del(scope.row.Id)"
              >结束</el-button
            >
            <el-popover placement="right" width="400" trigger="click">
              <el-select
                size="mini"
                v-model="CustomerServiceId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in KFList"
                  :key="item.Id"
                  :label="item.UserName"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
              <el-button size="mini" @click="againAllocation(scope.row.Id)"
                >确认</el-button
              >
              <el-button
                slot="reference"
                type="warning"
                v-show="scope.row.Status == 0 && userType == 0"
                size="mini"
                @click="again()"
                >重新分配</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="listQuery.total > 10"
        :total="listQuery.total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="info()"
      />
    </div>
    <!-- 留言处理模态框 -->
    <el-dialog title="处理" :visible.sync="dialogType">
      <div class="serveBox">
        <div class="serveItemTwo">
          <span>内容：</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="groupinfo.Explain"
            placeholder="请输入内容"
          />
        </div>
        <div class="uploadimgT">
          <span>图片：</span>
          <el-upload
            class="upload-demo"
            drag
            action="/BasicData/UploadFiles"
            multiple
            :on-success="kfImgUpload"
            :file-list="fileImgList"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
          </el-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogType = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情进度 -->
    <el-dialog :visible.sync="seeType" width="50%" class="dialogbox">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="查看详情" name="see">
            <el-timeline :reverse="false">
              <el-timeline-item
                v-for="item in activities"
                :key="item.Id"
                :timestamp="item.CreateTime"
              >
                <div>
                  <span style="font-weight: 700"> 内容： </span
                  >{{ item.Contents.Contents }}
                </div>
                <div style="margin-top: 20px">
                  <span style="font-weight: 700"> 图片： </span>

                  <el-popover
                    v-for="img in item.Images"
                    :key="img.Id"
                    placement="bottom"
                    trigger="click"
                    width="1200"
                  >
                    <el-image
                      :src="
                        'https://fbwfiles.oss-cn-hangzhou.aliyuncs.com/' +
                        img.Image
                      "
                    >
                    </el-image>
                    <el-image
                      slot="reference"
                      style="width: 60px; height: 60px; margin: 0 10px"
                      :src="
                        'https://fbwfiles.oss-cn-hangzhou.aliyuncs.com/' +
                        img.Image
                      "
                    >
                    </el-image>
                  </el-popover>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
          <el-tab-pane label="处理进度" name="schedule">
            <el-timeline :reverse="false">
              <el-timeline-item
                v-for="item in activitiesT"
                :key="item.Id"
                :timestamp="item.CreateTime"
              >
                <div>
                  <span style="font-weight: 700"> 内容： </span
                  >{{ item.Explains.Explain }}
                </div>
                <div style="margin-top: 20px">
                  <span style="font-weight: 700"> 图片： </span>

                  <el-popover
                    v-for="img in item.Images"
                    :key="img.Id"
                    placement="bottom"
                    trigger="click"
                    width="1200"
                  >
                    <el-image
                      :src="
                        'https://fbwfiles.oss-cn-hangzhou.aliyuncs.com/' +
                        img.Url
                      "
                    >
                    </el-image>
                    <el-image
                      slot="reference"
                      style="width: 60px; height: 60px; margin: 0 10px"
                      :src="
                        'https://fbwfiles.oss-cn-hangzhou.aliyuncs.com/' +
                        img.Url
                      "
                    >
                    </el-image>
                  </el-popover>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 新建日常问题 -->
    <el-dialog
      title="新建日常问题"
      :visible.sync="upType"
      width="44%"
      class="dialogServe"
    >
      <div class="serveBox">
        <div class="serveItemOne">
          <span>手机号码：</span>
          <el-input clearable v-model="orderInfo.Phone" size="mini" />
          <el-button type="primary" size="mini" @click="queryUser()"
            >查询</el-button
          >
        </div>
        <div class="serveItem">
          <span>群聊名称：</span>
          <el-input
            v-show="!type"
            clearable
            v-model="orderInfo.GroupName"
            size="mini"
          />
          <el-select
            v-show="type"
            size="mini"
            ref="cascader"
            v-model="orderInfo.GroupId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in groupsList"
              :key="item.chat_group_id"
              :label="item.chat_group_name"
              :value="item.chat_group_id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="serveItem">
          <span>绑定用户：</span>
          <el-input :disabled="type" v-model="orderInfo.UserName" size="mini" />
        </div>

        <div class="serveItem">
          <span>VIP类型：</span>
          <el-select
            :disabled="type"
            size="mini"
            v-model="orderInfo.VipType"
            placeholder="请选择"
          >
            <el-option label="VIP" :value="3"> </el-option>
            <el-option label="SVIP" :value="13"> </el-option>
            <el-option label="普通用户" :value="0"> </el-option>
          </el-select>
        </div>
        <div class="serveItem">
          <span>所属代理商：</span>
          <el-input
            :disabled="type"
            v-model="orderInfo.AgentName"
            size="mini"
          />
        </div>
        <div class="serveItemTwo">
          <span>反馈内容：</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="orderInfo.Contents"
            placeholder="请输入反馈内容"
          />
        </div>
        <div class="uploadimg">
          <span>反馈图片：</span>
          <el-upload
            class="upload-demo"
            drag
            action="http://192.168.6.126:8081/BasicData/UploadFiles"
            multiple
            :on-success="kfImgUploadT"
            :file-list="fileImgListT"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="serviceOrder">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDayIssuePageList,
  dealDayIssue,
  finishDayIssue,
  getDayIssueByLegalDeatil,
  dealDayIssuaDeatil,
  getDataByPhone,
  dayIssueByCustomerService,
  getCustomerServiceList,
  ManualAllocation,
} from '@/api/issue'
import Pagination from '@/components/Pagination'
import bread from '@/components/bread'
export default {
  props: [],
  components: {
    Pagination,
    bread,
  },
  data() {
    return {
      type: false,
      upType: false,
      accountData: [], // 客服列表
      listQuery: {
        page: 1, // 当前页码
        limit: 10, // 表格一页的数量
        searchStatus: false,
        total: 0, // 总条数
      },
      phone: '',
      time: ['', ''], // 开始时间和结束时间的数组
      vipType: '',
      status: '',
      dialogType: false, // 模态框状态
      seeType: false,
      activeName: 'see',
      keywords: '',
      groupinfo: {
        Id: '',
        Explain: '',
        Images: [],
      },
      orderInfo: {
        GroupId: '',
        GroupName: '',
        Phone: '',
        UserId: 0,
        UserName: '',
        VipType: '',
        AgentId: 0,
        AgentName: '',
        Contents: '',
        Images: [],
      },
      fileImgList: [],
      fileImgListT: [],
      selectid: '',
      activitiesT: [], // 进度
      activities: [], // 详情信息
      groupsList: [],
      userType: 1,
      KFList: [], // 客服列表
      CustomerServiceId: '', // 客服id
    }
  },
  created() {
    this.userType = sessionStorage.getItem('userType')
    this.info()
  },
  mounted() {},
  methods: {
    // 客服列表的请求和渲染
    info() {
      getDayIssuePageList(this).then((res) => {
        this.accountData = res.data
        this.listQuery.total = res.Total
      })
    },
    // 查找
    search() {
      this.listQuery.page = 1
      if (!this.time) {
        this.time = ['', '']
      }
      this.info()
    },
    // 重置
    reset() {
      this.keywords = ''
      this.vipType = ''
      this.status = ''
      this.time = ['', '']
      this.info()
    },
    // 图上传
    kfImgUpload(e) {
      this.groupinfo.Images.push(e.data)
    },
    kfImgUploadT(e) {
      this.orderInfo.Images.push(e.data)
    },
    // 处理
    dispose(id) {
      this.groupinfo.Id = id
      this.dialogType = true
    },
    //提交处理
    submit() {
      dealDayIssue(this).then(() => {
        this.groupinfo.Contents = ''
        this.groupinfo.Images = []
        this.fileImgList = []
        this.info()
        this.dialogType = false
      })
    },
    // 结束
    del(id) {
      finishDayIssue(this, id).then(() => {
        this.info()
      })
    },
    getSchedule(id) {
      this.selectid = id
      if (this.activeName == 'see') {
        getDayIssueByLegalDeatil(this, id).then((res) => {
          console.log(res)
          this.activities = res.data.detail
        })
      } else {
        dealDayIssuaDeatil(this, id).then((res) => {
          this.activitiesT = res.data
        })
      }
      this.seeType = true
    },
    handleClick() {
      if (this.activeName == 'see') {
        getDayIssueByLegalDeatil(this, this.selectid).then((res) => {
          this.activities = res.data.detail
        })
      } else {
        dealDayIssuaDeatil(this, this.selectid).then((res) => {
          this.activitiesT = res.data
        })
      }
    },
    // 新建日常问题
    newOrder() {
      this.upType = true
    },

    // 通过手机号查询
    queryUser() {
      if (this.orderInfo.Phone == '') {
        this.orderInfo.UserId = 0
        this.orderInfo.UserName = ''
        this.orderInfo.AgentId = 0
        this.orderInfo.AgentName = ''
        this.orderInfo.VipType = ''
        this.orderInfo.GroupId = ''
        this.orderInfo.GroupName = ''
        this.groupsList = ''
        this.type = false
        return this.$message.warning('请输入用户手机号查询')
      }
      getDataByPhone(this).then((res) => {
        if (res.data == null) {
          this.$message.warning('未查到用户，请确认用户手机号')
          this.orderInfo.UserId = 0
          this.orderInfo.UserName = ''
          this.orderInfo.AgentId = 0
          this.orderInfo.AgentName = ''
          this.orderInfo.VipType = ''
          this.orderInfo.GroupId = ''
          this.orderInfo.GroupName = ''
          this.groupsList = ''
          this.type = false
        } else {
          this.orderInfo.UserId = res.data.userId
          this.orderInfo.UserName = res.data.userName
          this.orderInfo.AgentId = res.data.agentid
          this.orderInfo.AgentName = res.data.agentName
          this.orderInfo.VipType = res.data.vipType
          this.groupsList = res.data.groups
          this.type = true
        }
      })
    },
    serviceOrder() {
      if (this.orderInfo.Phone == '') {
        return this.$message.warning('请输入用户手机号查询后提交')
      }
      if (this.type) {
        if (this.orderInfo.VipType == 3 || this.orderInfo.VipType == 13) {
          if (this.orderInfo.GroupId == '') {
            return this.$message.warning('请选择用户所在群聊')
          } else {
            this.orderInfo.GroupName = this.$refs.cascader.selected.label
          }
        }
      } else {
        if (this.orderInfo.GroupName == '') {
          return this.$message.warning('请填写群聊')
        }
      }

      if (this.orderInfo.Contents == '') {
        return this.$message.warning('请输入反馈内容')
      }

      dayIssueByCustomerService(this).then((res) => {
        if (res.success) {
          this.orderInfo = {
            GroupId: '',
            GroupName: '',
            Phone: '',
            UserId: 0,
            UserName: '',
            VipType: '',
            AgentId: 0,
            AgentName: '',
            Contents: '',
            Images: [],
          }
          this.type = false
          this.fileImgListT = []
          this.upType = false
          this.info()
        }
      })
    },
    // 重新分配
    again() {
      getCustomerServiceList(this).then((res) => {
        this.KFList = res.data
      })
    },
    againAllocation(id) {
      ManualAllocation(this, id).then(() => {
        this.info()
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
.search_ipt {
  width: 200px;
}
.red {
  color: red;
}
.green {
  color: green;
}
.user_ipt {
  width: 580px;
}
.img_ {
  width: 60px;
  height: 60px;
}

.dialogbox >>> .el-dialog__body {
  overflow-y: scroll;
  height: 580px;
}
.serveItem {
  display: inline-block;
  width: 40%;
  margin: 8px 2%;
}
.serveItem .el-input {
  width: 60% !important;
}
.serveItemOne {
  margin: 8px 5%;
}

.serveItemOne .el-input {
  width: 26.8% !important;
}
.serveItemOne .el-button {
  margin: 0 20px;
}
.serveItem span {
  width: 30%;
  display: inline-block;
  text-align: end;
}
.serveItemTwo {
  margin: 12px 0;
}
.serveItemTwo .el-textarea {
  width: 75% !important;
}
.serveItemTwo span {
  vertical-align: top;
  width: 14%;
  display: inline-block;
  text-align: end;
}
.uploadimg {
  margin-left: 6%;
}
.upload-demo {
  display: inline-block;
  width: 70%;
}
.uploadimg span {
  vertical-align: top;
}
.uploadimgT {
  margin-left: 10%;
}
.uploadimgT span {
  vertical-align: top;
}
</style>