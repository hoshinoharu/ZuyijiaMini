<template>
  <div>
    <Top :back="back"></Top>
    <div>
        <van-search
          :value="value"
          label="地址"
          placeholder="请输入搜索关键词"
          use-action-slot
          @change="onChange"
          shape="round"
          @search="onSearch"
        >
          <view slot="action" @tap="onClick">
            <van-button size="small"  round class="search_but">搜索</van-button>
          </view>
        </van-search>
     </div>
     <div class="location">
       <van-icon name="location-o"></van-icon>
       <span>当前定位城市</span><span>&nbsp;{{location}}</span>
       
       <span style="color:#FFE526" @tap="onReplay" class="replay">
         <van-loading  size="18" color="#FFE526" v-if="replay" /> 
         <van-icon name="replay" size="18" class="turn" v-else />
         重新定位
        </span>
        <div style="height: 20rpx"></div>
     </div>
     <div style="background: #f0f3f6">
        <!-- <van-grid square :custom-class="custom">
          <van-grid-item icon="wap-home-o" :text="num.name" v-for="(num, i) in areaName" :key="i" />
        </van-grid> -->
     <!-- </div> -->
      <div class="l_tag">
         <span class="tag"
          :class="[num.checked?'active':'']"
          @tap = "onCity(num)"
          v-for="(num, i) in areaName" :key="i">{{num.name}}</span>
      </div>
      <div class="index">
          <van-index-bar>
            <view v-for="(num, i) in keys" :key="i">
              <van-index-anchor :index="num" />
              <van-cell 
              @tap="onTurnCity($event, name)"
              v-for="(name, n) in cityName[num]" :key="n" :title="name.cityName+'/'+name.counName" />
              <!-- <van-cell title="文本" />
              <van-cell title="文本" /> -->
            </view>

            <!-- <view>
              <van-index-anchor index="B" />
              <van-cell title="文本" />
              <van-cell title="文本" />
              <van-cell title="文本" />
            </view>
            <view>
              <van-index-anchor index="C" />
              <van-cell title="文本" />
              <van-cell title="文本" />
              <van-cell title="文本" />
            </view>
            <view>
              <van-index-anchor index="D" />
              <van-cell title="文本" />
              <van-cell title="文本" />
              <van-cell title="文本" />
            </view> -->
          </van-index-bar>
      </div>
     </div>
  </div>
</template>

<script>
let areaName = [
   {
    name: "北京",
    cityCode:"110100",
    checked: false
  },
  {
    name: "上海",
    cityCode:"310100",
    checked: false
  },
  {
    name: "广州",
    cityCode:"440100",
    checked: false
  },
  {
    name: "深圳",
    cityCode:"440300",
    checked: false
  },
  {
    name: "成都",
    cityCode:"510100",
    checked: false
  },
  {
    name: "杭州",
    cityCode:"330100",
    checked: false
  },
  {
    name: "南京",
    cityCode:"320100",
    checked: false
  },
  {
    name: "苏州",
    cityCode:"320500",
    checked: false
  },
]
import Top from '../../components/head/index'
import item from "../item/index"
let bmap = require('../../../static/libs/bmap-wx.min.js');
let wxMarkerData = [];    //  定位成功回调对象
  export default {
    name: '',
    components: {
      Top
    },
    data() {
      return {
        areaName,
        ak:"UNrOozLxSIPT9tHTA6hMzKmKugTFIlPu", 
        keys: [],
        cityName: [],
        back: {
          flag: true,
          text: "房源地点",
          type: 'redictive',
          url: "/pages/home/main",
        },
        location: "上海",
        city: "",
        replay: false,
        value: ""
      }
    },
    mounted () {
      this.location = this.globalData.location.cityName
      this.areaName.forEach(num => {
        num.checked = false
      })
      this.getCity()
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
          that.$store.commit('changeAdress', that.globalData.location.counName)
          that.globalData.addressComponent = Object.assign({}, arr.addressComponent) 
          // 使用wxMarkerData获取数据
          that.city = arr.addressComponent.city
          wxMarkerData = data.wxMarkerData;
          // 把所有数据放在初始化data内
          // that.location = {
          //   markers:wxMarkerData,
          //   latitude: wxMarkerData[0].latitude,
          //   longitude: wxMarkerData[0].longitude,
          //   address:wxMarkerData[0].address,
          //   cityInfo:data.originalData.result.addressComponent
          // }
        };

    // 发起regeocoding检索请求
        BMap.regeocoding({
          fail:fail,
          success:success
        })
      },
      onTurnCity(e, num) {
        this.globalData.roomData = {}
        this.globalData.roomData = {...num}
        console.log(num.counCode)
        // return
        this.$store.commit('changeCounCode', num.counCode)
        this.globalData.location.cityName = ""
        this.globalData.location.cityName = num.cityName
        this.$store.commit('changeAdress', this.globalData.location.counName)
        wx.redirectTo({
          url: `/pages/home/main?counName=${num.counName}`,
        })
      },
      onCity(num) {
        this.areaName.forEach(m => {
          if(num.name == m.name) {
            num.checked = !num.checked
          } else {
            m.checked = false
          }
        })
        this.areaName.forEach(m => {
          if(m.checked == true) {
            this.location = m.name
            this.getCity(m.name)
          }
        })
      },
      getCity(name) {
        let num = name||this.globalData.location.cityName
        this.$http.get(`/app/district/export/country/grouped?search=${num}`, res => {
          console.log(res)
          this.cityName = res.data.data
          this.keys = Object.keys(this.cityName)
        })
        
      },
      onChange(e) {
        this.value = e.mp.detail
        
        console.log(this.value)
      },
      onSearch() {
        this.getCity(this.value)
      },
      onClick(e) {
        // this.value = e.mp.detail
        // console.log(this.value)
        // return
        this.getCity(this.value)
      },
      onReplay() {
       
        this.replay = true
        let a = new Promise((resolve, reject) => {
          this.location1()
          resolve()
        })
        a.then(() => {
          setTimeout(() => {
            this.replay = false
            if(this.city != "") {
              this.location = this.city
              this.areaName.forEach(num =>{
                num.checked = false
              })
            } else {
              wx.showToast({
                  title: '重新定位失败',
                  icon: 'none',
                  mask:true,
                  duration: 2000
                })
            }
          }, 1000)
        })
        
      },
    }
  }
</script>

<style scoped>
.custom {
  height: 200rpx;
}
.search_but .van-button {
  width: 60rpx;
  height: 60rpx;
}
.location span{
  font-size: 28rpx;
}
.location {
  margin-left: 20rpx;
}
/deep/.location ._van-icon .van-icon {
 top: 10rpx;
 font-size: 40rpx;
  }
/deep/.location .van-loading__spinner {
     top: 8rpx;
  }
 /deep/ .turn .van-icon {
top: 8rpx !important;
  }
.replay {
  position: relative;
  left: 265rpx;
}
/deep/ .van-grid {
  top: 10px;
}
/deep/.index .van-index-bar__sidebar{
 top: 875rpx;
}
/deep/.index .van-index-bar {
  top: 10px;
}
.index {
  height: 780rpx;
  overflow: hidden;
  overflow-y: scroll;
}
.index::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}
.tag{
  font-size: 28rpx;
  color: #000;
  background: #f0f3f6;
  padding: 10rpx 42rpx;
  margin: 20rpx;
  /* border: #000 1px solid; */
  border-radius: 10rpx;
}
.l_tag {
  height: 200rpx;
  width: 100%;
  background: #fff;
  display: flex;
  flex-flow:wrap;
}
.active{
    background: #1989fa;
}
</style>