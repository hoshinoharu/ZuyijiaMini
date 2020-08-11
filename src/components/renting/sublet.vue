<template>
  <div class="short_sub">
    <van-search
        :value="val"
        placeholder="请输入搜索关键字"
        use-action-slot
        background="#fafafa"
        @cancel="onCancel"
        @change="onChangeVal"
        @search="onSearch"
        label="关键字"
        shape="round"
        class="search"
    >
    <div
        slot="action"
        @tap="onSearch2"
    >搜索</div>
    </van-search>
    <div class="choose">
      <view hover-class="bg_red">
      <div :value="sort" @tap="sortClick" class="choose_div" @touchstart="sort">
        <span class="choose_time">发布时间</span><i  class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
        <i class="iconfont icon-sanjiaoxing_shang" v-else></i>
      </div>
      </view>
      <!-- <span class="choose_time">发布时间</span><i @tip = "sort = asc" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
      <i class="icon-sanjiaoxing_shang" v-else></i> -->
      <div>
        <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i>
      </div>
      
    </div>
    <div v-for="(num, i) in data" :key="i" class="sublet"> 
      <van-panel :title="num.title" desc="描述信息" :status="num.status" use-footer-slot class="sublet_main" footer-class="footer">
          <div class="content_main">
            <div class="remark"><span>{{num.remark}}</span></div>
            <div>
              <div class="tubiao">
                <img class="home_img" src="" alt="">
                <div class="name">
                  <span>{{num.name}}
                    <i class="iconfont icon-xingbienan" style="float:right; color:#83b2f9" v-if="num.sex=='男'"></i>
                    <i class="iconfont icon-xingbienv" style="float:right; color:#f983a9" v-else></i>
                  </span>
                </div>
                <div class="time">
                  <span>发布时间：{{num.time}}</span>
                    <p>
                    ￥{{num.price}}元/月
                  </p>
                </div> 
              </div>
               
            </div>
          </div>
        <div slot="footer">
          <van-button size="small" :icon="num.icon" :color="color" plain bindtip="collect" @tap="collect(num)">收藏</van-button>
        </div>
      </van-panel>
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<script>
  import {data} from './data'
  export default {
    name: '',
    data() {
      return {
        value: "",
        sort: "desc",
        data,
        color: '#FFCC66',
        navHeight: "",
        icon: 'star-o'
      }
    },
    mounted () {
      // this.navHeight = this.globalData.navHeight
      // console.log(this.navHeight)
    },
    methods: {
      collect(val) {
        if(val.icon == 'star-o') {
          val.icon = 'star'
        } else {
          val.icon = 'star-o'
        }
        console.log(val)
      },
      sortClick(e) {
        if(this.sort == 'desc') {
          this.sort = "asc"
        } else {
          this.sort = 'desc'
        }
      },
      sort(e) {
        console.log("dd")
      },
      onSearch (e) {
        console.log(e.mp.detail)
      //这个方法此时还有效，点击 Enter 仍会执行
        this.val = e.mp.detail
      },
      onChangeVal (e) {
        this.val = e.mp.detail
      },
      onSearch2 () {
        wx.showToast({
          title: this.val, // 提示的内容,
          icon: 'success', // 图标,
          duration: 2000, // 延迟时间,
          mask: true, // 显示透明蒙层，防止触摸穿透,
        })
      }
    }
  }
</script>

<style>
.short_sub {
  width: 100%;
}
.footer {
  height: 80rpx;
}
.search .van-search__content--round {
 border: 1px solid #000;
}
.choose span{
  font-size: 24rpx;
  float: left;
  padding-left: 20rpx;
}
.home_img{
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  /* margin: 100rpx 0; */
  margin-left: 30rpx;
}
 .choose div {
  width: 160rpx;
}
.choose .choose_div::before  {
  color: aqua;
}
.choose_time {
  /* float: left; */
}
.choose {
  width: 100%;
  display: flex;
  margin-left: 20rpx;
}
 .bg_red {
  color: red;
}
.content_main {
  display: flex;
  flex-direction: column;
}
.content_main .remark{
  margin: 20rpx auto;
  width: 550rpx;
  display: -webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  word-wrap:break-word;
  font-size: 30rpx;
  letter-spacing: 3rpx;
  text-indent: 40rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  font-family: '微软雅黑';
  color:#888888;
}
 .content_main .tubiao {
  display: flex;
  flex-wrap: wrap
}
.name {
  width: 220rpx;
  /* flex: 1; */
  padding: 20rpx;
}
.name span {
  width:auto;
  display: inline-block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 28rpx;
  
}
.name span i {
padding-left: 10rpx;
}
.time {
  float: right;
  font-size: 25rpx;
  padding-right: 10rpx;
}
.time p {
  text-align: right;
  font-weight: 600;
  color: red;
}
.sublet {
  padding: 20rpx 60rpx;
  
}
.footer {
  text-align: right;
}
.sublet:last-child {
  margin-bottom: 40rpx;
}
</style>