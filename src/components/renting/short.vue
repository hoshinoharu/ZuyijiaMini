<template>
  <div class="short">
    <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键字"
        use-action-slot
        background="#f0f3f6"
        @cancel="onCancel"
        @change="onChangeVal"
        @search="onSearch"
        label="关键字"
        shape="round"
        class="search"
    >
    <div
        slot="action"
        @tap="onSearchSend"
    >搜索</div>
    </van-search>
    <div class="choose">
      <view hover-class="bg_red">
      <div :value="sort" @tap="sortClick" class="choose_div" @touchstart="sort">
        <span class="choose_time">发布时间</span><i style="font-size: 30rpx" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
        <i style="font-size: 30rpx" class="iconfont icon-sanjiaoxing_shang" v-else></i>
      </div>
      </view>
      <!-- <span class="choose_time">发布时间</span><i @tip = "sort = asc" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
      <i class="icon-sanjiaoxing_shang" v-else></i> -->
      <div class="shaixuan">
        <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
        <van-dropdown-menu>
          <van-dropdown-item title="筛选" ref="item">
            <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
            <!-- <van-cell :title="'性别: '+sex"> -->
            <van-cell title="租房状态">
              <van-switch v-model="switch1"  @input="onInput"></van-switch>
            </van-cell>
            <!-- <van-cell  title="团购">
              <van-switch v-model="switch2"></van-switch>
            </van-cell> -->
            <van-button block type="info" @click="onConfirm">确认</van-button>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      
    </div>
      <div v-for="(num, i) in dataArr" :key="i" class="sublet" @tap="turnDetail($enent,num)"> 
        <van-panel :title="num.title+'/'+num.typeStr" desc="描述信息" :status="num.statusStr" use-footer-slot class="sublet_main" footer-class="footer">
            <div class="content_main">
              <div class="remark"><span>{{num.description}}</span></div>
              <div>
                <div class="tubiao">
                  <img class="home_img" :src="num.creator.headImg" alt="">
                  <div class="name">
                    <span>{{num.creator.username}}
                      <i class="iconfont icon-xingbienan" style="float:right; color:#83b2f9" v-if="num.sex=='male'"></i>
                      <i class="iconfont icon-xingbienv" style="float:right; color:#f983a9" v-else></i>
                    </span>
                  </div>
                  <div class="time">
                    <span>发布时间：{{num.updateTime}}</span>
                      <p>
                      ￥{{num.priceEachMonth}}元/月
                    </p>
                  </div> 
                </div>
                
              </div>
            </div>
          <div slot="footer">
            <van-button size="small" :icon="num.icon" :color="color" plain @tap.stop="collect(num)">收藏</van-button>
          </div>
        </van-panel>
      </div>
    <div class="footer1">

    </div>
  </div>
</template>

<script>
  import {data} from './data'
  export default {
    name: '',
    props: {
      dataArr: {
        type: Array,
        default: () => {}
      }
      
    },
    data() {
      return {
        value: "",
        sex: '男',
        sort: "desc",
        color: '#FFCC66',
        switch1: false,
        switch2: false,
        navHeight: "",
        // icon: 'star-o',
        searchValue: ""
      }
    },
    mounted () {
      // this.navHeight = this.globalData.navHeight
      // console.log(this.navHeight)
    },
    methods: {
      onInput () {
        this.switch1 = !this.switch1
        if(this.switch1) {
          this.sex = '女'
        } else {
          this.sex = '男'
        }
      },
      onInput1 () {
        this.switch2 = !this.switch2
      },
      onSearchSend(e) {
        console.log(e.mp)
      },
      turnDetail(e,num) {
          wx.navigateTo({
            url: `/pages/detail/main?dataDetail=${JSON.stringify(num)}`,
          })
      },
      collect(val) {
        if(val.icon == 'star-o') {
          //  val.icon = ""
          
          this.$http.post(`/app/favorites/like/${val.id}`, res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',
                // icon: 'none',
                mask:true,   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
            this.$set(val, 'icon', 'star')
            this.$forceUpdate();
          })
          
         
        } else {
          // val.icon = ""
          this.$http.put(`/app/chat/read/${val.id}`, res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
            this.$set(val, 'icon', 'star-o')
            this.$forceUpdate();
          })
          
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
        this.searchValue = e.mp.detail
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
.short {
  width: 100%;
}
.footer1 {
  height: 20rpx;
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
  height: 40rpx;
  line-height: 40rpx;
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
  color: #1989fa !important;
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
  width: 262rpx !important;
  /* flex: 1; */
  padding: 20rpx;
}
.van-panel {
  border: 2rpx solid#87caee;
  padding: 2rpx;
  border-radius: 5rpx;
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
}
.time p {
  text-align: right;
  font-weight: 600;
  color: red;
}
.sublet {
  padding: 20rpx 30rpx !important;
  
}

.footer {
  text-align: right;
}
.sublet:last-child {
  /* margin-bottom: 40rpx; */
}
.search .van-search__action--hover {
  background: #f0f3f6 !important;
}
.shaixuan .van-dropdown-menu {
  height: 40rpx !important;
  line-height: 40rpx;
  background: #f0f3f6 !important;
}
.shaixuan .van-ellipsis {
  font-size: 24rpx;
}
.shaixuan .van-cell {
}
</style>