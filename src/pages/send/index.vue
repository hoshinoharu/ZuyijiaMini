<template>
  <div class="send">
    <div >
      <Top :back="back"></Top>
    </div>
    
    <!-- <van-search
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
    </van-search> -->
    <!-- <div class="choose">
      <view hover-class="bg_red">
      <div :value="sort" @tap="sortClick" class="choose_div" @touchstart="sort">
        <span class="choose_time">发布时间</span><i style="font-size: 30rpx" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
        <i style="font-size: 30rpx" class="iconfont icon-sanjiaoxing_shang" v-else></i>
      </div>
      </view>
      <div class="shaixuan">
        <van-dropdown-menu>
          <van-dropdown-item title="筛选" ref="item">
            <van-cell :title="'性别: '+sex">
              <van-switch v-model="switch1"  @input="onInput"></van-switch>
            </van-cell>
            <van-button block type="info" @click="onConfirm">确认</van-button>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      
    </div> -->
    <div class="star">
      <div>

      </div>
      <view :style="{width: (windowWidth - 10)*2 +'rpx', overflow: 'hidden'}">
      <scroll-view class="my_list" id="page"
        @touchstart='touchStart'
        @touchend='touchEnd'
        @touchmove='touchMove'
        :style='{height: (windowHeight - 80)*2+"rpx",width: windowWidth*2 + "rpx"}' scroll-y="true" :scroll-top="scrollTop"
        @scroll="scroll"
        @scrolltoupper="refresh"
        @scrolltolower="loadMore"
        lower-threshold="10">
        <view v-if="showRefresh" 
           style='width:100%;position:relative;padding:60rpx 0;padding-bottom: 30rpx'>
          <view class="text-gray" style='position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);'>
            <view v-if="freshStatus == 'fresh'" class="flex">
              <view class="lzy-loading"></view>
              <view>刷新中...</view>
            </view>
            <view class="text" v-else-if="freshStatus == 'more'">
              <!-- 使用到了 colorUI 下拉箭头图标 -->
              <text class="cuIcon-refresharrow">继续下拉刷新</text> 
            </view>
            <view class="text" v-else>
              释放刷新
            </view>
          </view>
        </view>
        <div v-for="(num, i) in dataArr" :key="i" class="sublet" @tap="turnDetail($enent,num)" >
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
              <van-button size="small" :color="color" @tap.stop="onDelete(num)">删除</van-button>
              <van-button size="small" :color="color1" @tap.stop="onModify(num)">修改</van-button>
            </div>
          </van-panel>
       </div>
        <div class="load_more" v-if="loading">
          <div class="load_loading"></div>
          <div class="load-tips">正在加载……</div>
        </div>
        <div class="load_end" v-if="loaded">{{load_text}}</div>
       </scroll-view>
      </view>
    <!-- <div class="footer1">

    </div> -->
  </div>
  </div>
</template>

<script>
import Top from '../../components/head/index'
let lastY = 0
  // import {data} from './data'
  export default {
    name: '',
    // props: {
    //   dataArr: {
    //     type: Array,
    //     default: () => {}
    //   }
      
    // },
    components: {
      Top
    },
    data() {
      return {
        value: "",
        sex: '男',
        loading: false,
        loaded: false,
        sort: "desc",
        freshStatus: 'more', // 当前刷新的状态
        showRefresh: false,   // 是否显示下拉刷新组件
        color: '#CE0000',
        color1: "#1989fa",
        switch1: false,
        load_text: "加载更多数据",
        switch2: false,
        isScrolling: false,
        windowWidth: "",
        id: "",
        number: 1,
        navHeight: "",
        back: {
          flag: true,
          text: "我的发布"
        },
        dataArr: [],
        // icon: 'star-o',
        searchValue: "",
        windowHeight: 0,
        timer: null,
        scrollTop: 20
      }
    },
    mounted () {
    },
    onLoad(option) {
      let that = this
      this.windowHeight = this.globalData.windowHeight
      this.windowWidth = this.globalData.windowWidth
      that.id = option.creatorId
      console.log(this.globalData)
      if(option.creatorId) {
        that.getData(option.creatorId)
      }
      
      
    },
    onPullDownRefresh: function() { 
      // this.loadData()
      let num = this.num++
      console.log(this.num)
      var that = this;
      // 显示导航条加载动画  
      wx.showNavigationBarLoading();  
      
      // let p = new Promise(function(reslove,reject){
      //   
        this.$http.get(`/app/house/list?pageIndex=${num}&pageSize=10&creatorId=${that.id}`, res=> {
          if(res.data.success) {
            that.dataArr = that.dataArr.concat(res.data.data)
            wx.stopPullDownRefresh(); 
            wx.hideNavigationBarLoading();
            that.dataArr.forEach(num => {
              num.updateTime = num.updateTime.substring(0, 10)
              // if(num.house.favorite == false) {
              //   num.house.icon="star-o"
              // } else {
              //   num.house.icon = "star"
              // }
            })
          }
          
      })
    },
    methods: {
     touchStart(e) {
      this.startY = e.mp.changedTouches[0].pageY;
      this.freshStatus = 'more'
    },
    // 触摸移动
    touchMove(e) {
      let endY = e.mp.changedTouches[0].pageY;
      let startY = this.startY;
      let dis = endY - startY;
      // 判断是否下拉
      console.log(dis)
      if (dis <= 0) {
        return;
      }
      let offsetTop = e.mp.currentTarget.offsetTop;
      if (dis > 20) {
         this.showRefresh = true
        // a.then(() => {
          if (dis > 50) {
            this.freshStatus = 'end'
          } else {
            this.freshStatus = 'more'
          }
        // })
        // this.setData({
        //   showRefresh: true
        // }, () => {
        //   if (dis > 50) {
        //     this.setData({
        //       freshStatus: 'end'
        //     })
        //   } else {
        //     this.setData({
        //       freshStatus: 'more'
        //     })
        //   }
        // })
      } else {
        this.showRefresh = false
      }
    },
    // 触摸结束
    touchEnd(e) {
      if (this.freshStatus == 'end') {
        // 延迟 500 毫秒，显示 “刷新中”，防止请求速度过快不显示
        // setTimeout(()=>{
            this.getData(this.id); // 获取最新列表数据
        // }, 500);
      } else {
        this.showRefresh = false
      }
    },
      scroll() {

      },
      refresh: function () {
          console.log("下拉")
      },
      loadMore() {
        let that = this;
        console.log(that.isScrolling)
        if(this.isScrolling===true) {
          return;
        }
        this.isScrolling=true;

        
        that.loading = true;
        that.loaded = false;
        let num = this.number++
        this.$http.get(`/app/house/list?pageIndex=${num}&pageSize=10&creatorId=${that.id}`, res=> {
          if(res.data.success) {
            let a = new Promise((resolve, reject) => {
              setTimeout(() => {
                that.loading = false;
                resolve() 
              }, 500)
            })
            
            a.then(() => {
              if(res.data.data == [] || res.data.data.length == 0) {
                that.load_text = "没有更多的数据......"
              } else {
                 that.load_text = "加载更多的数据"
              }
              that.loaded = true;
              setTimeout(() => {
                that.isScrolling=false;
              },3000)
              
              that.dataArr = that.dataArr.concat(res.data.data)
              that.dataArr.forEach(num => {
                num.updateTime = num.updateTime.substring(0, 10)
                // if(num.house.favorite == false) {
                //   num.house.icon="star-o"
                // } else {
                //   num.house.icon = "star"
                // }
              })
              
            })
            
          }  
        })
      },
      onModify(num) {
        console.log(num)
        let url = ""
        switch(num.type) {
          case 'sublet':
            url = '/pages/housingRental/main'
            break;
          case 'short_rent':
            url = '/pages/housingShort/main'
            break;
          case 'find_mate':
            url = '/pages/housingRomate/main'
            break;
        }
        return
        let a = JSON.stringify(num)
        wx.navigateTo({
          url: `${url}?dataDetail=`+encodeURIComponent(a),
        })
      },
      onDelete(num) {
        this.$http.delete(`/app/house/delete/${num.id}`, (res) => {
          console.log(res)
          if(res.data.success) {
             wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',
                // icon: 'none',
                mask:true,   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
            this.getData(this.id)
          }
        })
      },
      getData(creatorId) {
        let that = this
        if(that.showRefresh == true) {
          this.freshStatus = 'fresh'
        }
        this.$http.get(`/app/house/list?pageIndex=1&pageSize=10&creatorId=${creatorId}`, res => {
        
        if(res.data.success) {
          setTimeout(() => {
            // this.freshStatus = 'end'
            this.showRefresh = false
          }, 1000)
            this.dataArr = [].concat(res.data.data)
            that.dataArr.forEach(num => {
              num.updateTime = num.updateTime.substring(0, 10)
              // if(num.house.favorite == false) {
              //   num.house.icon="star-o"
              // } else {
              //   num.house.icon = "star"
              // }
            })
          }
        })
      },
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
      
            wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
            this.$set(val, 'icon', 'star-o')
            this.getData()
            this.$forceUpdate();
          })
          
        }
        
      },
      sortClick(e) {
        if(this.sort == 'desc') {
          this.sort = "asc"
        } else {
          this.sort = 'desc'
        }
      },
      sort(e) {
      },
      onSearch (e) {
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
.send .load_more {
  width: 65%;
  margin: 15rpx auto;
  margin-bottom: 20rpx;
  font-size: 14px;
  text-align: center;
  display: flex;
  position: relative;
  /* bottom: 20rpx; */
  flex-direction: row;
  justify-content: center;
}
.send .load_loading {
  margin: 0 10rpx;
  width: 40rpx;
  /* display: inline-block;
  vertical-align: middle; */
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
  
}
.send .load_tips {
  display: inline-block;
  vertical-align: middle;
}
.send .load_end {
  width: 65%;
  margin: 15rpx auto;
  margin-bottom: 20rpx;
  font-size: 14px;
  text-align: center;
  position: relative;
  /* bottom: 20rpx; */
}
.send {
  width: 100%;
  overflow: hidden;
  
}
.send .star {
  background: #f0f3f6;
  width: 100%;
  /* height: calc(100% - 160rpx) ; */
  overflow: hidden;
}
.send .footer1 {
  /* height: 20rpx; */
}
.send .search .van-search__content--round {
 border: 1px solid #000;
}
.send .choose span{
  font-size: 24rpx;
  float: left;
  padding-left: 20rpx;
}
.send .home_img{
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  /* margin: 100rpx 0; */
  margin-left: 30rpx;
}
 .send .choose div {
  width: 160rpx;
  height: 40rpx;
  line-height: 40rpx;
}
.send .choose .choose_div::before  {
  color: aqua;
}
.choose_time {
  /* float: left; */
}
.send .choose {
  width: 100%;
  display: flex;
  margin-left: 20rpx;
}
 .send .bg_red {
  color: #1989fa !important;
}
.send .content_main {
  display: flex;
  flex-direction: column;
}
 .send .content_main .remark{
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
 .send .content_main .tubiao {
  display: flex;
  flex-wrap: wrap
}
.send .name {
  width: 262rpx !important;
  /* flex: 1; */
  padding: 20rpx;
}
.send .van-panel {
  border: 2rpx solid#87caee;
  padding: 2rpx;
  border-radius: 5rpx;
}
.send .van-panel:first-child{
  margin-top: 20rpx;
}
.send .name span {
  width:auto;
  display: inline-block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 28rpx;
  
}
.send .name span i {
padding-left: 10rpx;
}
.send .time {
  float: right;
  font-size: 25rpx;
}
.send .time p {
  text-align: right;
  font-weight: 600;
  color: red;
}
.send .sublet {
  padding: 20rpx 30rpx !important;
}
.send .sublet:last-child {
  padding: 20rpx 30rpx !important;
  padding-bottom: 10rpx!important;
}

.send .footer {
  text-align: right;
}
.send .footer .van-button {
   font-size: 28rpx;
   width: 140rpx;
   margin-left: 20rpx;
   height: 64rpx;
}
.send .search .van-search__action--hover {
  background: #f0f3f6 !important;
}
.send .shaixuan .van-dropdown-menu {
  height: 40rpx !important;
  line-height: 40rpx;
  background: #f0f3f6 !important;
}
.send .shaixuan .van-ellipsis {
  font-size: 24rpx;
}
.lzy-loading{
  margin-right: 20rpx;
  float: left;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1px solid #f0f0f0;
  border-left: 1px solid #6190E8;
  animation: load 1s linear infinite;
  -webkit-animation: load 1s linear infinite;
}
.flex {
  display: flex;
  align-items: column;
}
@-webkit-keyframes load
{
  from{-webkit-transform:rotate(0deg);}
  to{-webkit-transform:rotate(360deg);}
}
@keyframes load
{
  from{transform:rotate(0deg);}
  to{transform:rotate(360deg);}
  }
</style>