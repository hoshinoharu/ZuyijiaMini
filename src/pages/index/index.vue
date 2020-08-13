<template>
  <div class="home">
      <image class="home_img" :src="url" alt=""></image>
      <div class="home_text">申请获取以下权限</div>
      <div class='home_text1'>获得你的公开信息（昵称，头像）</div>
     <div class="home_button">
       <button open-type="getUserInfo" @getuserinfo="getuserinfo">申请授权</button>
     </div>
  </div>
</template>

<script>
// import card from '@/components/card'

export default {
  data () {
    return {
      userInfo: {},
      url: "/static/images/tupian5.png"
    }
  },
  watch: {
    userInfo(data) {
      let that =this;
      that.url =  data.avatarUrl
    }
  },
  components: {
    // card
  },
  onLoad: function (options) {
      var _this = this;
      _this.attached();
  }, 
  mounted () {
    let that = this
    console.log(wx.getStorageSync('token'))
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        that.userInfo = res.userInfo;
        that.globalData.userInfo = res.userInfo;
        
        wx.switchTab({
          url: "/pages/nav/main?userInfo="+JSON.stringify(that.userInfo)
        })
        //  wx.navigateTo({
        //     url: '/pages/message/main',
        //   })
        //此处为获取微信信息后的业务方法
      },
      fail: function () {
        //获取用户信息失败后。请跳转授权页面
        wx.showModal({
        title: '警告',
        content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
        success: function (res) {
          if (res.confirm) {
          console.log('用户点击确定')
          // wx.navigateTo({
            // url: '../tologin/tologin',
          // })
          }
        }
        })
      }
    })
  },
  methods: {
    attached: function attached() {
      var _this = this;
      var isSupport = !!wx.getMenuButtonBoundingClientRect;
      var rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      wx.getSystemInfo({
        success: function success(res) {
          var ios = !!(res.system.toLowerCase().search('ios') + 1);
          _this.$mp.page.setData({
            ios: ios,
            statusBarHeight: res.statusBarHeight,
            innerWidth: isSupport ? rect.left + 'px' : '',
            innerPaddingRight: isSupport ? (res.windowWidth - rect.left) + 'px' : '',
            leftWidth: isSupport ? 'width:' + (res.windowWidth - rect.left) + 'px' : ''
          });
          let data= {
            ios: _this.$mp.page.data.ios,
            statusBarHeight: _this.$mp.page.data.statusBarHeight,
            innerWidth: _this.$mp.page.data.innerWidth,
            innerPaddingRight: _this.$mp.page.data.innerPaddingRight,
            leftWidth: _this.$mp.page.data.leftWidth
          }
          if(JSON.stringify(_this.$store.state.style) == "{}") {
            _this.$store.commit('SETSTYLE', data)
          }
          // _this.ios = _this.$mp.page.data.ios
          // _this.statusBarHeight = _this.$mp.page.data.statusBarHeight
          //   _this.innerWidth = _this.$mp.page.data.innerWidth
          //   _this.innerPaddingRight = _this.$mp.page.data.innerPaddingRight
          //   _this.leftWidth = _this.$mp.page.data.leftWidth
        }
      });
    },
    getuserinfo(e) {
      var that = this;
      //此处授权得到userInfo
      that.userInfo = {}
      that.userInfo = e.target.userInfo;
      // console.log(e.detail.userInfo);
      //接下来写业务代码

      if(that.userInfo) {
        wx.navigateTo({
          url: "/pages/item/main?userInfo="+JSON.stringify(that.userInfo)
        })
      }
      //最后，记得返回刚才的页面
      // wx.navigateBack({
      //   delta: 1
      // })
    }
  },
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home_img{
  width: 200rpx;
  height: 200rpx;
  border-radius: 100rpx;
  margin: 100rpx 0;
  border: 1px solid #fff;
}
.home_text {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  text-align: left;
}
.home_text1 {
  font-size: 40rpx;
  font-weight: bold;
  color: #d2d2d2;
  margin: 10rpx 0 100rpx 0;
  text-align: left;
}
.home_button{
  width: 220rpx;
  height: 80rpx;
}
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.all{
  width:7.5rem;
  height:1rem;
  background-color:blue;
}
.all:after{
  display:block;
  content:'';
  clear:both;
}
.left{
  float:left;
  width:3rem;
  height:1rem;
  background-color:red;
}

.right{
  float:left;
  width:4.5rem;
  height:1rem;
  background-color:green;
}
</style>
