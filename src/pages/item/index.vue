<template>
<div>
  <Top :back="back"></Top>
  <div class="mine">
    <div class="mine_title">
      <div class="title">
        <image class="home_img" :src="url" alt=""></image>
        <p style="width:200rpx; text-align: left;"><span>{{userInfo.nickName}}</span></p>
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
        <li class="li_mine" v-for="(num, i) in mine" :key="i" @tap="onTurn($event, num.url)">
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
                        :error-message="login_err.text"
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
    <van-overlay :show="warningShow" @click="onClickWarning">
      <div class="wrapper">
        <div class="block black1" catch:tap="noop">
          <div>
             <div id="style2">
                <p>注意事项</p>
              </div>
              <div id="style1">
                  <p>
                      君不见，黄河之水天上来，奔流到海不复回。 
                      君不见，高堂明镜悲白发，朝如青丝暮成雪。 
                      人生得意须尽欢，莫使金樽空对月。
                      天生我材必有用，千金散尽还复来。 
                      烹羊宰牛且为乐，会须一饮三百杯。 
                      岑夫子，丹丘生，将进酒，杯莫停。
                  </p>
                  <p>
                      与君歌一曲，请君为我倾耳听。 
                      钟鼓馔玉不足贵，但愿长醉不复醒。 
                      古来圣贤皆寂寞，惟有饮者留其名。 
                      陈王昔时宴平乐，斗酒十千恣欢谑。 
                      主人何为言少钱，径须沽取对君酌。 
                      五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。
                  </p>
              </div>

          </div>
          <div class="warning_button" v-if="warningFlag">
            <van-button style="float: left; margin-left: 20rpx" round type="primary" @tap="agree">同意</van-button>
            <van-button style="float: right; margin-right: 20rpx " round type="primary" @tap="notAgree">不同意</van-button>
          </div>
          <div class="warning_icon" v-else>
            <van-icon name="close" size="40" color="#fff"  @tap="onClickWarning" />
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
  <div class="footer">
    <Bottom :selected="2"></Bottom>
  </div>
</div>
</template>

<script>
import Top from '../../components/head/index'
let mine = [
  {
    name: "我的收藏",
    icon: "iconfont icon-home ",
    url: "/pages/star/main"
  },
  {
    name: "我的消息",
    icon: "iconfont icon-xiaoxi1",
    number: "",
    url: "/pages/message/main"
  },
  {
    name: "我的发布",
    icon: "iconfont icon-fabu",
    url: "/pages/send/main"
  },
  {
    name: "注意事项",
    icon: "iconfont icon-zhuyi ",
    url: 'flag'
  }
]
import Bottom from '../../components/bottom/index'
  export default {
    name: '',
    
    components: {
      Bottom,
      Top
    },
    data() {
      return {
        url: "../../static/images/loser.png",
        back: {
          flag: false,
          text: '租宜家',
          color: '#FFFD7D'
        },
        mine,
        active: 0,
        warningFlag: false,
        btnCodeText: "ddd",
        show: false,
        warningShow: false,
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
          password: "",
          text: ""
        },
        errors: [],
        phoneInfo: "",
        type: "登录",
        loginType: "密码登录"
      }
    },
    created () {
      let token = wx.getStorageSync('token')
      if(token) {
        // this.$http.get('/app/login/validate', res => {
        //   console.log(res)
        //   if(res.data) {
        //     this.loginSuccess = true;
        //     this.warningFlag = false;
        //   }
        // })
        
      }
    },
    mounted () {
      this.userInfo = this.globalData.userInfo
      this.url = this.userInfo.avatarUrl
    },
    methods: {
      onClickWarning() {
        this.warningShow = false
      },
      onTurn(e, type) {
        if(type == 'flag') {
          this.warningShow = true
        } else {
          wx.navigateTo({
            url: type + `?creatorId=${wx.getStorageSync('id')}`,
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function(data) {
                console.log(data)
              },
              someEvent: function(data) {
                console.log(data)
              }
            },
          })
        }
      },
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
          if(this.login.text == "") {
            this.login_err.text = "请输入短信验证码"
            return
          }
        } else {
          console.log("dd")
          if(this.login.username == "") {
            this.login_err.username = "请输入用户名或者手机号"
          }
          if(this.login.password == "") {
            this.login_err.password = "请输入密码"
            return
          }
        }
        this.warningFlag = true
        this.warningShow = true
        // this.agree()
      },
      notAgree() {
        this.warningShow = false
        setTimeout(() => {
          
          this.warningFlag = false
        }, 500)
       
      },
      agree() {
        this.$http.post('/app/login/do',{
          "mobile": this.login.username,
          "password":this.login.password
        }, res => {
          var cookie = res.header["Set-Cookie"];
           wx.setStorageSync('cookie', cookie);
           console.log(res.data,'ss')
           wx.setStorageSync('id', res.data.data.id);
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
            this.warningFlag = false
            this.warningShow = false
          } else {
            this.warningFlag = false
            this.warningShow = false
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
  .warning_button {
    position: absolute;
    bottom: 20rpx;
    width: 100%;
  }
  .warning_icon {
    position: absolute;
    bottom: -95rpx;
    left: calc(50% - 25rpx);
  }
  .warning_button .van-button {
    width: 150rpx;
    height: 70rpx;
    font-size: 28rpx;
  }
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
     /* margin: 20rpx auto; 
     width:90%;  */
     margin: 20rpx 20rpx;
     overflow:hidden
  }
  .li_mine {
    float:left; 
    padding:20rpx 20rpx; 
    width:80px
  }
  .li_mine i{
    margin: 0 auto;
    height: 80rpx;
    /* height: 100rpc; */
    width: 60rpx;
    font-size: 80rpx;
    line-height: 70rpx;
    text-align: center;
    color: rgb(114, 224, 63);
  }
  .li_mine span {
    width: 154rpx;
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
    width: 100%;
    height: 200rpx;
    background:#FFFD7D;
    /* border: 1px solid #bbb;
    box-shadow: 0 2rpx 20rpx #aaaaaa; */
    /* margin: 10px auto; */
    display: flex
  }
  .mine_body {
    width: 700rpx;
    height: 400rpx;
    background:#fff;
    border: 1px solid #f9f9f9;
    box-shadow: 1rpx 1rpx 10rpx #87caee;
    margin: 10px auto;
    margin-top: 50rpx;
    border-radius: 10rpx;
    /* display: flex */
  }
 .mine .title {
   width: 50%;
   margin-left: 40rpx;
   display: flex;
 }
  .mine .title span{
    font-size: 28rpx;
    color: #000;
    position: relative;
    top: 100rpx;
    left: 10rpx;
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
   top: 100rpx;
   left: 80rpx;
 }
 .van_but {
   flex: 1;
 }
  .home_img{
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  /* margin-left: 100px; */
  margin: 25rpx 0;
  /* margin: 100rpx 0; */
  border: 1rpx solid #fff;
  margin-bottom: 0px;
  /* box-shadow: 0 2rpx 25rpx rgb(166,124,64) */
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
.black1 {
  position: relative;
}
#style1 {
  font-family: "微软黑雅";
  font-size: 28rpx;
  color: black;
  text-indent: 55rpx;
  letter-spacing: 2rpx;
  line-height: 40rpx;
  margin: 0 10rpx;
  margin-top: 20rpx;
}
#style2{
  text-align: center;
  font-family: "微软黑雅";
  font-size: 40rpx;
}
</style>