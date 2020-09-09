<template>
  <div>
    <home v-if="active == 0"></home>
    <set  v-else-if="active == 1"></set>
    <item  v-else></item>
    <van-tabbar :active="active" @change="onChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="shop-o">发布</van-tabbar-item>
      <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
      <!-- <van-tabbar-item icon="setting-o">标签</van-tabbar-item> -->
    </van-tabbar>
  </div>
</template>

<script>
import home from "../nav/index"
import set from "../set/index"
import item from "../item/index"
  export default {
    name: '',
    components: {
      home,
      set,
      item
    },
    onLoad() {
      let that = this
      that.attached();
    },
    data() {
      return {
        active: 0
      }
    },
    onShow() {
      let that = this
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          that.userInfo = res.userInfo;
          that.globalData.userInfo = res.userInfo;
          
        },
        fail: function () {
          //获取用户信息失败后。请跳转授权页面
          wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function (res) {
              if (res.confirm) {
                that.getuserinfo()
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
      onChange(event) {
        console.log(event.mp.detail)
        this.active = event.mp.detail
      },
      attached() {
        var _this = this;
        var isSupport = !!wx.getMenuButtonBoundingClientRect;
        var rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
         wx.getSystemInfo({
          success: function success(res) {
            _this.globalData.windowWidth = res.windowWidth
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
          }
        })
      },
      getuserinfo(e) {
      let that = this
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          that.userInfo = res.userInfo;
          that.globalData.userInfo = res.userInfo;
          
          // wx.switchTab({
          //   url: "/pages/item/main?userInfo="+JSON.stringify(that.userInfo)
          // })
          //  wx.navigateTo({
          //     url: '/pages/detailInfo/main',
          //   })
            // wx.navigateTo({
            //   url: '/pages/star/main',
            // })
          //此处为获取微信信息后的业务方法
        },
        fail: function () {
            wx.showModal({
              title: '提示',
              content: '网络链接错误',
              success(res) {
                if (res.confirm) {
      
                }
              }
            })
            //获取用户信息失败后。请跳转授权页面
            // wx.showModal({
            // title: '警告',
            // content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
            // success: function (res) {
            //     if (res.confirm) {
            //     }
            //   }
            //   })
          }
        })
      },
    }
  }
</script>

<style lang="" scoped>
  
</style>