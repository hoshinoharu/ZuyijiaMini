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
           <i v-else-if="num.number > 0" ><van-icon name="chat" :info="num.number"/></i>
           <i v-else ><van-icon name="chat" /></i>
           <span>{{num.name}}</span>
        </li>
      </ul>
    </div>
    <van-overlay :show="show" @tap="onClickHide">
      <view class="wrapper">
        
        <div class="block2" @tap.stop="noop1">
          <div style="padding-bottom: 80rpx" class="loginStyle">
            <!-- <van-tabs :active="active" animated @change="activeChange"> -->
              <!-- <van-tab title="登录"> -->
                <!-- <div class="welcome">
                  <image :src="urlImg"></image>
                </div> -->
                
                <van-cell-group style="margin:20rpx 20rpx">
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
                        label="手机号"
                        maxlength="11"
                        right-icon="question-o"
                        placeholder="请输入用户手机号"
                        @change="inputInphone"
                      />
                         <!-- :error-message="login_err.username" -->

                      <van-field
                        v-if="loginType=='密码登录'"
                        v-model="login.text"
                        center
                        left-icon="phone-circle-o"
                        clearable
                        style="padding-bottom: 8rpx"
                        label="验证码"
                        maxlength="6"
                        placeholder="请输入验证码"
                        :border="false"
                        class="issure"
                        @change="inputIntext"
                        use-button-slot
                      >
                      <!-- :error-message="login_err.text" -->
                        <van-button slot="button" @tap="onCode"
                         size="small" 
                         round
                         class="login_test"
                         :disabled="codeFlag"
                         type="primary"
                         v-model="buttonTitle"
                         >{{buttonTitle}}</van-button>
                      </van-field>
                      <!-- <van-field
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
                      /> -->
                </van-cell-group>
                <!-- <van-button round plain @tap="loginStyle" class="login_but">{{loginType}}</van-button> -->
                <div class="register_btn">
                  <van-button type="primary" round size="normal" @tap.stop="onSubmit">登录</van-button>
                  <!-- <van-button type="primary" plain size="normal" @click="onReset">重置</van-button> -->
                </div>
              <!-- </van-tab> -->
              <!-- <van-tab title="注册">
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
                  <van-button type="primary" plain size="normal" @tap="onReset($event, 'reg')">重置</van-button>
                </div>
                
              </van-tab>
            </van-tabs> -->
          </div>
          
          
          
        </div>
      </view>
    </van-overlay>
    <van-overlay :show="warningShow" @click="onClickWarning">
      <div class="wrapper">
        <div class="block black1" @tap.stop="noop">
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
  <div v-show="showFlag1"></div>
  <!-- <div class="footer">
    <Bottom :selected="2"></Bottom>
  </div> -->
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
        showFlag1:false,
        urlImg: "../../static/images/welcome.png",
        warningShow: false,
        userInfo: {},
        loginSuccess: false,
        codeFlag: false,
        buttonDisable: false,
        buttonTitle: "点击发送",
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
        count: 60,
        phoneInfo: "",
        type: "登录",
        loginType: "密码登录",
        page: ""
      }
    },
    created () {
      let token = wx.getStorageSync('token')
      if(token) {
        this.$http.get('/app/login/validate', res => {
          console.log(res)
          if(res.data.success) {
            this.globalData.tokenFlag = true;
            this.loginSuccess = true;
            this.warningFlag = false;
          }
        })
        
      }
    },
    mounted () {
      this.userInfo = this.globalData.userInfo
      this.url = this.userInfo.avatarUrl
      this.$http.get(`/app/chat/unread/count`, res => {
            if(res.data.success) {
              console.log(res.data)
              this.mine.forEach(num => {
                if(num.name == '我的消息') {
                  num.number = Number(res.data.data)
                }
              })
            }
          })
    },
    methods: {
      getCodeSuccess(e){
        let that = this
        var intervalId = setInterval(function () {
          that.count = that.count - 1;
          that.buttonTitle = ""
          that.buttonTitle = that.count + 's后重发',
          that.buttonDisable = true
          that.codeFlag = true
          if (that.count == 0) {
              clearInterval(intervalId);
              intervalId = null
              that.codeFlag = false
              that.buttonTitle = '点击发送', 
              that.buttonDisable = false
           }
         }, 1000)
      },
      onClickWarning() {
        this.warningShow = false
      },
      onTurn(e, type) {
        if(type == 'flag') {
          this.warningShow = true
        } else {
          if(this.globalData.tokenFlag == undefined || this.globalData.tokenFlag == null ||this.globalData.tokenFlag==false) {
            wx.showToast({
                title: '请用户先登录',
                icon: 'none',
                mask:true,
                duration: 2000
              })
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
          }}
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
        console.log(e.mp.detail)
        this.login.username = e.mp.detail
        // if(this.login.username) {
        //   this.login_err.username = ""
        // }
      },
      inputIntext(e) {
        this.login.text = e.mp.detail
        if(this.login.text) {
          this.login_err.text = ""
        }
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
      noop1(e) {
      // console.log(e)
      },
      onReset(e, val) {
      },
      onCode(e) {
        if(this.buttonDisable) {
          return
        }
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.login.username))){ 
          wx.showToast({
            title:"手机号输入有误",
            icon: 'none',
            mask:true,
            duration: 2000
          }) 
          return
        } 
        
        if(this.login.username) {
          this.$http.post('/app/login/verify/code/sms',{
	        "mobile": this.login.username
          }, res => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask:true,
                duration: 2000
              }) 
            this.codeFlag = true
            this.getCodeSuccess(e)
            if(res.data.success) {
              var cookie = res.header["Set-Cookie"];
              if(cookie != null) {
                wx.setStorageSync('cookie', cookie);
              }
            }
            
          })
        }
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
        this.userInfo.headImg = this.userInfo.avatarUrl
        this.userInfo.username = this.userInfo.nickName
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
            return
            // this.login_err.username = "请输入用户名或者手机号"
          }
          if(this.login.text == "") {
            wx.showToast({
              title: '请输入短信验证码',
              icon: 'none',
              mask:true,
              duration: 2000
            })
            // this.login_err.text = "请输入短信验证码"
            return
          }
        } 
        // else {
        //   console.log("dd")
        //   if(this.login.username == "") {
        //     this.login_err.username = "请输入用户名或者手机号"
        //   }
        //   if(this.login.password == "") {
        //     this.login_err.password = "请输入密码"
        //     return
        //   }
        // }
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
        // this.userInfo.headImg = this.userInfo.avatarUrl
        // this.userInfo.username = this.userInfo.nickName
        this.$http.post('/app/login/do/code',{
          // "mobile": this.login.username,
          // "password":this.login.password
          "mobile": this.login.username,
          "code": this.login.text,
          "username": this.userInfo.nickName,
          "headImg": this.userInfo.avatarUrl
        }, res => {
          
          if(res.data.success) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask:true,
                duration: 2000
              })
              wx.setStorageSync('id', res.data.data.id);
              wx.setStorageSync('token', res.data.data.token);
              this.codeFlag = false
              this.globalData.tokenFlag = true;
              this.loginSuccess = true
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
    display: block;
    margin: 0 auto;
    width: 90%;
    height: 80rpx;
    padding-right: 0rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    letter-spacing: 40rpx;
    /* border-radius: 16rpx; */
  }
  .van-field__error-message {
    font-size: 28rpx;
  }
  .van-cell-group{
    margin-top: 20px;
  }
  .van-field__input, .van-field__label{
    font-size: 30rpx;
  }
  /* .register_btn{
    margin-top: 20rpx;
    margin-left: calc(50% - 150rpx);
  } */
  /* .login_but .van-button{
    width: 300rpx;
    height: 70rpx;
    margin-top: 24rpx;
    left: calc(50% - 75px);
  } */
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
    height: 150rpx;
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
.block2 {
  width: 85%;
  height: 700rpx;
  /* background-color: #fff; */
  position: relative;
  /* padding: 40rpx 30rpx; */
}
.block2 .van-cell-group{
  margin: 0 auto;
    margin-top: 20px;
    width: 90%;
  }

.block2 .van-hairline--bottom:after, 
.block2 .van-hairline--left:after, 
.block2 .van-hairline--right:after, 
.block2 .van-hairline--surround:after, 
.block2 .van-hairline--top-bottom:after, 
.block2 .van-hairline--top:after, 
.block2 .van-hairline:after {  
  border: none !important;
}
.block2 .van-cell:after {
  border-bottom: none;
}

.block2 .van-cell{
  border-radius: 40rpx;
  margin: 40rpx 0px;
 border: 2rpx solid #bbb;
}
.block2 .issure .van-cell {
 padding-top: 14rpx;
 padding-bottom: 14rpx;
}
.block2 .van-cell{
  font-size: 30rpx;
  }
  .block2 .van-field__label {
    width: 68px !important;
    margin-right: 10rpx !important;
  }
  .block2 .van-cell__title {
    max-width: 4.0em !important;
min-width: 4.0em !important;
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
.loginStyle {
    /* width: 100%;
    height: 100%; */
    background: url('data:image/png;base64,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') no-repeat;
   
   background-color: #fff;
   background-size: cover;
    position: absolute;
    /* z-index: -10; */
}
.welcome image{
    width: 100%;
    height: 80rpx;
}
.welcome {
  margin-top: 60rpx;
}
.login-inp {
    margin: 0 30px 15px 30px;
    border: 1px solid #fff;
    border-radius: 25px;
}
</style>