<template>
  <div>
    <home v-if="active == 0" :add="address" :active="active"></home>
    <set  v-else-if="active == 1" :active="active"></set>
    <item  v-else-if="active == 2" :active="active"></item>
    <van-tabbar :active="active" @change="onChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="shop-o">发布</van-tabbar-item>
      <van-tabbar-item icon="friends-o">我的</van-tabbar-item>
      <!-- <van-tabbar-item icon="setting-o">标签</van-tabbar-item> -->
    </van-tabbar>
    <van-overlay :show="showHome" @click="onClickHide">
      <view class="wrapper">
        <div class="home_button">
          <button open-type="getUserInfo" @getuserinfo="getuserinfo1">开始体验</button>
        </div>
      </view>
    </van-overlay>
  </div>
</template>

<script>
import home from "../nav/index"
import set from "../set/index"
import item from "../item/index"
let bmap = require('../../../static/libs/bmap-wx.min.js');
let wxMarkerData = [];    //  定位成功回调对象
  export default {
    name: '',
    components: {
      home,
      set,
      item
    },
    onLoad(option) {
      let that = this
      if(option.counName) {
        that.$store.commit('changeAdress', option.counName)
      } 
      // else {
      //   that.$store.commit('changeAdress', option.address)
      // }
      if(!this.$store.state.counCode){
        this.$http.post('/app/district/export/convert/baidu', JSON.stringify(this.globalData.addressComponent)
          , res => {
            console.log(res)
            this.globalData.roomData = res.data.data
            // this.$store.commit('changeCounCode', this.globalData.roomData.counCode)
          })
        }
      
    },
    data() {
      return {
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
    // onShow() {
    //   let that = this
    //   wx.getUserInfo({
    //     withCredentials: true,
    //     success: function (res) {
    //       that.userInfo = res.userInfo;
    //       that.globalData.userInfo = res.userInfo;
    //       that.location1()
    //     },
    //     fail: function (val) {
    //       console.log(val)
    //       //获取用户信息失败后。请跳转授权页面
    //       wx.showModal({
    //       title: '警告',
    //       content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
    //       success: function (res) {
    //           if (res.confirm) {
    //             // that.getuserinfo()
    //             that.showHome = true
    //           console.log('用户点击确定')
    //           // wx.navigateTo({
    //             // url: '../tologin/tologin',
    //           // })
    //           }
    //         }
    //         })
    //       }
    //     })
    // },
    mounted () {
      // this.getCity()
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
        };

    // 发起regeocoding检索请求
        BMap.regeocoding({
          fail:fail,
          success:success
        })
      },
      
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
            // _this.globalData.windowWidth = res.windowWidth
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
        console.log("that.location1()")
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
  .home_button{
    width: 240rpx;
    height: 80rpx;
    font-size: 40rpx;
  }
  .wrapper {
    position: relative;
    top: 500rpx
  }
</style>