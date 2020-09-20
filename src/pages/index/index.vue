<template>
  <div class="home">
      <image class="home_img" :src="url" alt=""></image>
      <div class="home_text">申请获取以下权限</div>
      <div class='home_text1'>获得你的公开信息（昵称，头像）</div>
     <div class="home_button">
       <button open-type="getUserInfo" @getuserinfo="getuserinfo1">申请授权</button>
     </div>
  </div>
</template>

<script>
// import card from '@/components/card'
let bmap = require('../../../static/libs/bmap-wx.min.js');
let wxMarkerData = [];    //  定位成功回调对象
export default {
  data () {
    return {
      userInfo: {},
      url: "/static/images/tupian5.png",
      active: 0,
      showHome: false,
      ak:"UNrOozLxSIPT9tHTA6hMzKmKugTFIlPu",      //  ak
      markers:[],
      longitude:'',     //  经度
      latitude:'',        //  纬度
      address:'',       //  地址
      cityInfo:{},      //  城市信息,
      location: {}
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
      let that = this
      that.attached();
  },
  onShow() {
      let that = this
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          that.userInfo = res.userInfo;
          that.globalData.userInfo = res.userInfo;
          that.location1()
        },
        fail: function (val) {
          console.log(val)
          //获取用户信息失败后。请跳转授权页面
          wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function (res) {
              if (res.confirm) {
                // that.getuserinfo()
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
  mounted () {
    let that = this
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        that.userInfo = res.userInfo;
        that.globalData.userInfo = res.userInfo;
        
        // wx.switchTab({
        //   url: "/pages/item/main?userInfo="+JSON.stringify(that.userInfo)
        // })
        
          // wx.navigateTo({
          //   url: '/pages/star/main',
          // })
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
      location1() {
        var that = this;
    // 获取定位地理位置
    // 新建bmap对象
        let BMap = new bmap.BMapWX({
          ak:that.ak
        });
        let fail = function(data){
          console.log(data);
        };
        let success = function(data){
          // 返回数据内，已经包含经纬度
          let arr = data.originalData.result
          that.globalData.location = {
            longitude: arr.location.lng,
            latitude: arr.location.lat,
            provName: arr.addressComponent.province,
            cityName: arr.addressComponent.city,
            counName: arr.addressComponent.district,
            townName: arr.addressComponent.street,
          }
          that.globalData.addressComponent = Object.assign({}, arr.addressComponent) 
          // 使用wxMarkerData获取数据
          
          wxMarkerData = data.wxMarkerData;
          // 把所有数据放在初始化data内
          that.location = {
            markers:wxMarkerData,
            latitude: wxMarkerData[0].latitude,
            longitude: wxMarkerData[0].longitude,
            address:wxMarkerData[0].address,
            cityInfo:data.originalData.result.addressComponent
          }
           wx.navigateTo({
            url: '/pages/home/main',
          })
        };

    // 发起regeocoding检索请求
        BMap.regeocoding({
          fail:fail,
          success:success
        })
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
      getuserinfo1(e) {
        var that = this;
        //此处授权得到userInfo
        that.userInfo = {}
        that.userInfo = e.target.userInfo;
        that.globalData.userInfo = that.userInfo
        // console.log(e.detail.userInfo);
        //接下来写业务代码
        that.showHome = false
        that.location1()
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
