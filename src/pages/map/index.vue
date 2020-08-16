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
        <van-grid square>
          <van-grid-item icon="wap-home-o" :text="num.name" v-for="(num, i) in areaName" :key="i" />
        </van-grid>
     </div>
     <div>

     </div>
  </div>
</template>

<script>
let areaName = [
  {
    name: "北京"
  },
  {
    name: "上海"
  },
  {
    name: "广州"
  },
  {
    name: "深圳"
  },
  {
    name: "成都"
  },
  {
    name: "杭州"
  },
  {
    name: "南京"
  },
  {
    name: "苏州"
  },

]
import Top from '../../components/head/index'
  export default {
    name: '',
    components: {
      Top
    },
    data() {
      return {
        areaName,
        back: {
          flag: true,
          text: "房源地点"
        },
        location: "上海",
        replay: false
      }
    },
    methods: {
      onChange() {},
      onSearch() {},
      onClick() {},
      onReplay() {
        this.replay = true
        setTimeout(() => {
          this.replay = false
        }, 1000)
      },
    }
  }
</script>

<style scoped>
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
  left: 250rpx;
}
/deep/ .van-grid {
  top: 10px;
}
</style>