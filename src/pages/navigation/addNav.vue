<template>
  <el-card class="addbox">
    <div>
      <el-card>
        <div slot="header" class="clearfix">
          <span>一级导航</span>
        </div>
        <span>一级：</span>
        <el-input class="oneipt" v-model="leveNav.Question" />
      </el-card>
      <el-card class="twoCard">
        <div slot="header" class="clearfix">
          <span style="margin: 0 10px 0 0">二级导航 </span>
          <el-radio @change="readChange()" v-model="leveNav.Type" label="1"
            >问题</el-radio
          >
          <el-radio @change="readChange()" v-model="leveNav.Type" label="2"
            >答案</el-radio
          >
          <el-button
            class="addbtn"
            type="success"
            size="mini"
            @click="addItem()"
            v-show="leveNav.Type == '1'"
            >添加</el-button
          >
        </div>
        <div class="twobox">
          <div
            v-for="item in leveNav.Childrens"
            :key="item.index"
            class="twoItem"
          >
            <span>二级：</span>
            <el-input
              type="textarea"
              :rows="4"
              class="oneipt_textarea"
              v-model="item.Question"
            />
            <span class="threetitle" v-show="leveNav.Type == '1'">三级：</span>
            <el-input
              v-show="leveNav.Type == '1'"
              class="oneipt_textarea"
              v-model="item.Answer"
              type="textarea"
              :rows="4"
            />
            <span
              v-show="leveNav.Type == '1'"
              class="el-icon-delete"
              @click="delItem(item)"
            ></span>
          </div>
        </div>
      </el-card>
      <el-button type="primary" class="submit" @click="submit()"
        >提交</el-button
      >
    </div>
  </el-card>
</template>

<script>
import { addNavLevel } from '@/api/navLevel'
export default {
  data() {
    return {
      leveNav: {
        Question: '',
        Type: '1',
        Childrens: [
          {
            Question: '',
            Answer: '',
          },
        ],
      },
    }
  },
  methods: {
    addItem() {
      this.leveNav.Childrens.push({
        Question: '',
        Answer: '',
      })
    },
    delItem(row) {
      this.leveNav.Childrens.splice(row.$index, 1)
    },
    // 单选框选择判断 （如果选择的是答案，那么这个二级有且只能有一个答案）
    readChange() {
      if (this.leveNav.Type == '2') {
        this.leveNav.Childrens = [
          {
            Question: '',
            Answer: '',
          },
        ]
      }
    },
    submit() {
      addNavLevel(this).then((res) => {
        if (res.success) {
          this.$emit('closeAdd', false)
        }
      })
    },
  },
}
</script>

<style scoped>
.addbox {
  margin: 10px;
  height: 86vh;
}
.oneipt {
  width: 300px;
}
.oneipt_textarea {
  width: 600px;
  vertical-align: middle;
}
.twoCard {
  margin: 10px 0;
}
.threetitle {
  margin: 0 0 0 20px;
}
.twobox {
  height: 50vh;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.twobox::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.twoItem {
  padding-bottom: 10px;
}
.addbtn {
  float: right;
}
.el-icon-delete {
  color: red;
  margin: 0 10px;
  font-weight: bold;
}
.submit {
  width: 20%;
  margin: 0px 40%;
}
</style>