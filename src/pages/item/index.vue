<template>
<div>
  <div class="mine">
    <div class="mine_title">
      <div class="title">
        <image class="home_img" :src="url" alt=""></image>
        <p><span>{{userInfo.nickName}}</span></p>
      </div>
      
      <van-button color="linear-gradient(to right, #4bb0ff, #FFFFCC)" round 
      class="van_but" custom-class="t" @tap="onClickShow" v-if="!loginSuccess">
        一键登录
        </van-button>
        <van-button color="linear-gradient(to right, #4bb0ff, #FFFFCC)" round 
      class="van_but" custom-class="t"  v-else>
        登录成功
        </van-button>
    </div>
    <div class="mine_body">
      <ul class="ul_mine">
        <li class="li_mine" v-for="(num, i) in mine" :key="i">
           <i :class="num.icon" v-if="i!=1"></i>
           <i v-else ><van-icon name="chat" :info="num.number"/></i>
           <span>{{num.name}}</span>
        </li>
      </ul>
    </div>
    <van-overlay :show="show" @tap="onClickHide">
      <view class="wrapper">
        
        <div class="block" @tap.stop="noop">
          <div style="height:700rpx">
            <van-tabs :active="active" animated @change="activeChange">
              <van-tab title="登录">
                <van-cell-group>
                <!-- <van-field
                  v-model="username"
                  clearable
                  label="用户名"
                  required
                  right-icon="question-o"
                  placeholder="请输入用户名"
                  left-icon="contact"
                  error-message="用户名不能为空"
                /> -->
                      <van-field
                        v-model="login.username"
                        clearable
                        required
                        left-icon="contact"
                        label="用户名"
                        maxlength="11"
                        right-icon="question-o"
                        placeholder="请输入用户名/手机号"
                        :error-message="login_err.username"
                        @change="inputInphone"
                      />
                      <van-field
                        v-if="loginType=='密码登录'"
                        v-model="login.text"
                        center
                        left-icon="phone-circle-o"
                        clearable
                        style="padding-bottom: 8rpx"
                        label="验证码"
                        maxlength="6"
                        placeholder="请输入短信验证码"
                        :border="false"
                        @change="inputIntext"
                        use-button-slot
                      >
                        <van-button slot="button" size="small" round class="login_test" type="primary">验证码</van-button>
                      </van-field>
                      <van-field
                        v-else
                        v-model="password"
                        clearable
                        type="password"
                        required
                        label="密码"
                        maxlength="6"
                        right-icon="question-o"
                        placeholder="请输入密码"
                        left-icon="closed-eye"
                        @change="inputInpassword"
                        :error-message="login_err.password"
                      />
                </van-cell-group>
                <van-button round plain @tap="loginStyle" class="login_but">{{loginType}}</van-button>
                <div class="register_btn">
                  <van-button type="primary" round size="normal" @tap.stop="onSubmit">登录</van-button>
                  <!-- <van-button type="primary" plain size="normal" @click="onReset">重置</van-button> -->
                </div>
              </van-tab>
              <van-tab title="注册">
                 <van-cell-group>
                  <van-field
                    v-model="register.username"
                    clearable
                    label="用户名"
                    maxlength="11"
                    required
                    right-icon="question-o"
                    placeholder="请输入用户名"
                    left-icon="contact"
                    @change="registerUsername"
                  />
                  <van-field
                    v-model="register.phone"
                    clearable
                    required
                    maxlength="11"
                    label="手机号"
                    right-icon="question-o"
                    placeholder="请输入手机号"
                    left-icon="phone-circle-o"
                    :error-message="register_err.password"
                    @change="registerPhone"
                  />
                  <van-field
                    v-model="register.password"
                    clearable
                    required
                    type="password"
                    label="密码"
                    right-icon="question-o"
                    placeholder="请输入密码"
                    left-icon="closed-eye"
                    maxlength="6"
                    @change="registerPassword"
                    :error-message="register_err.password"
                  />
                </van-cell-group>
                <div class="register_btn">
                  <van-button type="primary"  round size="normal" @click="onRegister">注册</van-button>
                  <!-- <van-button type="primary" plain size="normal" @tap="onReset($event, 'reg')">重置</van-button> -->
                </div>
                
              </van-tab>
            </van-tabs>
          </div>
          
          
          
        </div>
      </view>
    </van-overlay>
  </div>
  <div class="footer">
    <Bottom :selected="2"></Bottom>
  </div>
</div>
</template>

<script>
let mine = [
  {
    name: "我的收藏",
    icon: "iconfont icon-home "
  },
  {
    name: "我的消息",
    icon: "iconfont icon-xiaoxi1",
    number: ""
  },
  {
    name: "我的发布",
    icon: "iconfont icon-fabu"
  },
  {
    name: "注意事项",
    icon: "iconfont icon-zhuyi "
  }
]
import Bottom from '../../components/bottom/index'
  export default {
    name: '',
    
    components: {
      Bottom
    },
    data() {
      return {
        url: "",
        mine,
         active: 0,
        btnCodeText: "ddd",
        show: false,
        userInfo: {},
        loginSuccess: false,
        errMsg: [],
        register: {
          username: "",
          phone: "",
          password: ""
        },
        login: {
          username: "",
          phone: "",
          password: "",
          text: ""
        },
        register_err: {
          username: "",
          phone: "",
          password: ""
        },
        login_err: {
          username: "",
          phone: "",
          password: ""
        },
        errors: [],
        phoneInfo: "",
        type: "登录",
        loginType: "密码登录"
      }
    },
    mounted () {
      this.userInfo = this.globalData.userInfo
      this.url = this.userInfo.avatarUrl
    },
    methods: {
      login() {
        this.type = '登录'
      },
      loginStyle() {
        this.loginType == '密码登录'? this.loginType ='短信登录': this.loginType='密码登录'
        this.login_err = {
          username: "",
          password: ""
        }
      },
      register() {
        this.type = '注册'
      },
      inputInphone(e) {
        this.login.username = e.mp.detail
        if(this.login.username) {
          this.login_err.username = ""
        }
      },
      inputIntext(e) {
        this.login.text = e.mp.detail
      },
      registerPassword(e) {
        this.register.password = e.mp.detail
        if(this.register.password) {
          this.register_err.password = ""
        }
      },
      registerPhone(e) {
        this.register.phone = e.mp.detail
        if(this.register.phone) {
          this.register_err.phone = ""
        }
      },
      registerUsername(e) {
        this.register.username = e.mp.detail
        if(this.register.username) {
          this.register_err.username = ""
        }
      },
      inputInpassword(e) {
        this.login.password = e.mp.detail
        if(this.login.password) {
          this.login_err.password = ""
        }
      },
      onClickHide() {
        this.show = false
      },
      activeChange(e) {
        this.active = e.mp.detail.index
      },
      onClickShow() {
        this.show = true
        this.active = 0
        console.log(this.active) 
        
      },
      noop(e) {
      // console.log(e)
      },
      onReset(e, val) {
      },
      onRegister() {
        if(this.register.username == "") {
          this.register_err.username = "请输入用户名或者手机号"
        }
        if(this.register.password == "") {
          this.register_err.password = "请输入密码"
        }
        if(this.register.phone == "") {
          this.register_err.phone = "请输入密码"
        }
        if(this.register.username&&this.register.password&&this.register.phone) {
            this.$http.post('/app/login/register',{
            "name": this.register.usernam,
            "mobile": this.register.phone,
            "password": this.register.password,
            "userInfo": JSON.stringify(this.userInfo)
          }, res => {
            // console.log(res)
            if(res.data.success) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask:true,
                duration: 2000
              }) 
              this.show = false
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask:true,
                duration: 2000
              }) 
            }
          })
        }
      
      },
      onSubmit() {
        if(this.loginType == '密码登录') {
          if(this.login.username == "") {
            this.login_err.username = "请输入用户名或者手机号"
          }
        } else {
          console.log("dd")
          if(this.login.username == "") {
            this.login_err.username = "请输入用户名或者手机号"
          }
          if(this.login.password == "") {
            this.login_err.password = "请输入密码"
          }
        } 
        this.$http.post('/app/login/do',{
          "mobile": this.login.username,
          "password":this.login.password
        }, res => {
          var cookie = res.header["Set-Cookie"];
           wx.setStorageSync('cookie', cookie);
          if(res.data.success) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask:true,
              duration: 2000
            })
            this.loginSuccess = true
            wx.setStorageSync('token', res.data.data.token);
            this.show = false
          } else {
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask:true,
                duration: 2000
              })
          }
        })
      },
     onClickRight() {
        this.$toast('请填写注册信息');
        // this.$router.push({ path:'/register'});
      },
      validEmail: function (password) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(password);
      }
      }
      
  }
</script>

<style>
/* @import url("./main.css"); */
  .mine {
    background:#fff;
  }
  .register_btn .van-button{
    /* width: 148rpx;
    height: 64rpx; */
    /* width: 220rpx;
     */
    width: 300rpx;
    height: 70rpx;
    padding-right: 20rpx;
    /* border-radius: 16rpx; */
    top: 20rpx;
  }
  .van-field__error-message {
    font-size: 28rpx;
  }
  .van-cell-group{
    margin-top: 20px;

  }
  .van-field__input, .van-field__label{
    font-size: 28rpx;
  }
  .register_btn{
    margin-top: 20rpx;  
    margin-left: calc(50% - 150rpx);
  }
  .login_but .van-button{
    width: 300rpx;
    height: 70rpx;
    margin-top: 24rpx;
    left: calc(50% - 75px);
  }
  .ul_mine {
     margin: 20px auto; 
     width:90%; 
     overflow:hidden
  }
  .li_mine {
    float:left; 
    padding:10px 8px; 
    width:80px
  }
  .li_mine i{
    margin: 0 auto;
    height: 100rpx;
    /* height: 100rpc; */
    width: 80rpx;
    font-size: 80rpx;
    line-height: 80rpx;
    text-align: center;
    color: rgb(114, 224, 63);
  }
  .li_mine span {
    width: 140rpx;
    margin: 0 auto;
    display: inline-block;
    line-height: 32rpx;
    font-size: 32rpx;
    vertical-align: middle;
    text-align: right;
    color: #bbb;
  }
  .login_test{
    font-size: 12px;
    height: 24px;
  }
  .mine_title {
    width: 90%;
    height: 200rpx;
    background:#fff;
    border: 1px solid #bbb;
    box-shadow: 0 2rpx 20rpx #aaaaaa;
    margin: 10px auto;
    display: flex
  }
  .mine_body {
    width: 90%;
    height: 400rpx;
    background:#fff;
    border: 1px solid #bbb;
    box-shadow: 0 2rpx 20rpx #aaaaaa;
    margin: 10px auto;
    margin-top: 20px;
    /* display: flex */
  }
 .mine .title {
   width: 40%;
   margin-left: 20rpx;
 }
  .mine .title span{
    font-size: 23rpx;
    font-weight: 600;
    color: #bbb;
  }
  .mine .title p{
    width: 120rpx;
    text-align: center;
    
  }
 .van_but .van-button{
   width: 220rpx;
   height: 65rpx;
   color: #000 !important;
   font-weight: 600;
   top: 65rpx;
   left: 60rpx;
 }
 .van_but {
   flex: 1;
 }
  .home_img{
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  /* margin-left: 100px; */
  margin: 10px 0;
  /* margin: 100rpx 0; */
  /* border: 1px solid #fff; */
  margin-bottom: 0px;
  box-shadow: 0 2rpx 25rpx rgb(166,124,64)
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.van-tab__pane--active  {
  height: 600rpx !important;
}

.block {
  width: 85%;
  height: 700rpx;
  background-color: #fff;
}
</style>