<template>
<m-navbar :theme="theme.theme.headerTheme">
  <m-navbar-brand>
    <i class="side-switch"
      :class="{
        'el-icon-more': !mini,
        'el-icon-more-outline': mini
      }"
      @click="handleSwitchSide"
      ></i>
  </m-navbar-brand>
 
  <m-nav align="right">
    <m-nav-item padding="0">
      <m-dropdown align="right" v-if="user" padding="0 10px">
         <span :class="userinfos.statuz == 1 ? 'green' : (userinfos.statuz == 2 ? 'red' : 'yellow') "></span>
        <a href="#" style="display: inline-block; padding: 0px; color: inherit">
          <!-- <img src="../assets/user.jpg" alt="" style="border-radius: 3px;vertical-align: middle;"> -->
          <span>{{user.username}}</span> 
          <span class="caret"></span>
        </a>
        <m-dropdown-panel >
          <m-dropdown-item >
             <div @click="out(1)">在线</div>
          </m-dropdown-item>
          <m-dropdown-item >
            <div @click="out(2)">
              忙碌
            </div>
          </m-dropdown-item>
          <m-dropdown-item>
            <div @click="out(3)">
              其它
            </div>
          </m-dropdown-item>
          <div class="test-line"></div>
          <m-dropdown-item >
            <div @click="out(4)">
                退出账号
            </div>  </m-dropdown-item>
        </m-dropdown-panel>
      </m-dropdown>
    </m-nav-item>
    <m-nav-item padding="0 5px">
      <a href="#" @click.stop.prevent="handleSwitchScreen">
        <i 
          class="fa" 
          :class="isFullScreen ? 'fa-compress' : 'fa-expand'"
          ></i>
      </a>
    </m-nav-item>

   
  </m-nav>
</m-navbar>
</template>
<script type="text/javascript">
import {mapActions, mapState} from 'vuex'
import {
  requestFullScreen,
  exitFullscreen
} from '@/utils'
import themes from './theme'
import { changeStatus,logout, GetUserData} from "@/api/login";
export default {
  name: 'app-header',
  data () {
    return {
      mini: false,
      isFullScreen: false,
      themes,
      themeType: '',
      showAside: true,
      theme: {theme: {headerTheme: 'dark'}},
      out_types:0,
      searchid:'',
      userinfos:{}
    }
  },
  computed: {
    ...mapState({
      user: ({user}) => user.user
    })
  },
  watch: {
    themeType (val) {
      this.theme = this.themes.find(e => e.name === val) || {}
      this.$emit('set-theme', this.theme)
      localStorage.setItem('theme', val)
    }
  },
  methods: {
    ...mapActions(['getLoginUser', 'logout']),
    handleSwitchSide () {
      this.mini = !this.mini
      this.$emit('switch', this.mini)
    },
    handleSwitchScreen () {
      if (this.isFullScreen) {
        exitFullscreen()
        this.isFullScreen = false
      } else {
        requestFullScreen()
        this.isFullScreen = true
      }
    },
    handleSwitchHideSide () {
      console.log('change')
      this.$emit('hide-side')
    },
     info() {
         GetUserData(this).then(res => {
           console.log(res);
            this.userinfos = res
         }) 
      },
    // 更改状态
    out(type) {
      console.log('aaaa');
        this.out_types = type;
        if(type == 4) {
          logout(this).then(res => {
             this.$router.replace("/login");
          })
        }else {
            changeStatus(this).then(res => {
              
              this.info();
            })
        }
      }
  },
  created () {
    this.getLoginUser()
    var theme = localStorage.getItem('theme') || 'default'
    this.themeType = theme;
    this.info();
  }
}
</script>
<style type="text/css">
  .side-switch{
    display: inline-block;
    font-size: 32px;
    cursor: pointer;
    color: inherit;
    margin-top: 10px;
  }
  .side-switch:hover{
    color: #fff;
  }
  .tabs_navs {
    display: inline-block;
 
    height: 50px;
  }
  .tabs_pane {
    color: #fff;
  }
 
 .green {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: green;
  border-radius: 50%;
  margin: 0 0 4px -10px;
}
.red {
   width: 10px;
  display: inline-block;
  height: 10px;
  background: red;
  border-radius: 50%;
  margin: 0 0 4px -10px;
}
.yellow {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: yellow;
  border-radius: 50%;
  margin: 0 0 4px -10px;
}
</style>
