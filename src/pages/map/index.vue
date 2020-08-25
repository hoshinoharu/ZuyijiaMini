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
         <span class="tag" v-for="(num, i) in areaName" :key="i">{{num.name}}</span>
      </div>
      <div class="index">
          <van-index-bar>
            <view>
              <van-index-anchor index="A" />
              <van-cell title="文本" />
              <van-cell title="文本" />
              <van-cell title="文本" />
            </view>

            <view>
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
            </view>
          </van-index-bar>
      </div>
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
          text: "房源地点",
          url: "/pages/nav/main",
          switch: "/pages/nav/main"
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
</style>