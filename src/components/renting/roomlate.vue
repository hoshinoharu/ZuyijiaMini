<template>
  <div class="roomlate">
    <van-search
        v-model="searchValue"
        placeholder="请输入房源标题"
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
      <!-- <view hover-class="bg_red">
      <div :value="sort" @tap="sortClick" class="choose_div" @touchstart="sort">
        <span class="choose_time">发布时间</span><i style="font-size: 30rpx; color: #666666" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
        <i style="font-size: 30rpx;color: #666666" class="iconfont icon-sanjiaoxing_shang" v-else></i>
      </div>
      </view> -->
      <!-- <span class="choose_time">发布时间</span><i @tip = "sort = asc" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
      <i class="icon-sanjiaoxing_shang" v-else></i> -->
      <div class="shaixuan">
        <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
        <van-dropdown-menu>
          <van-dropdown-item title="筛选" ref="item" id="item">
            <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
            <!-- <van-cell :title="'性别: '+sex"> -->
            <van-cell title="租房状态">
              <van-switch v-model="switch1"  @input="onInput"></van-switch>
            </van-cell>
            <!-- <van-cell  title="团购">
              <van-switch v-model="switch2"></van-switch>
            </van-cell> -->
            <van-cell title="租房标识" class="symbolRental">
              <checkbox-group @dchange="checkboxChange" class="boxflex">
                  <label :class="['checkbox', num.checked?'active':'']"
                      v-for="(num, i) in items" 
                      :key="i"
                      @tap="addclass"
                      :data-index="i">
                      <chechbox :value="i" :checked="num.checked">{{num.name}}</chechbox>
                  </label>
              </checkbox-group>


            </van-cell>
            <van-cell>
              <van-button style="float: left" color="red" round type="info" @click="onConfirmReset">重置</van-button>
              <van-button  round type="info" @click="onConfirm">确认</van-button>
            </van-cell>
            <!-- <div class="chooseBut">
              
            </div> -->
            
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      
    </div>
    <view :style="{width: (windowWidth - 10)*2 +'rpx', overflow: 'hidden'}">
      <scroll-view class="my_list" id="page"
        @touchstart='touchStart'
        @touchend='touchEnd'
        @touchmove='touchMove'
        :style='{height: (windowHeight - 210)*2+"rpx",width: windowWidth*2 + "rpx"}' scroll-y="true" :scroll-top="scrollTop"
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
        <div v-for="(num, i) in dataArr1" :key="i" class="sublet" @tap="turnDetail($enent,num)"> 
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
        <div class="load_more" v-if="loading">
            <div class="load_loading"></div>
            <div class="load-tips">正在加载……</div>
          </div>
          <div class="load_end" v-if="loaded">{{load_text}}</div>
      </scroll-view>
    </view>
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
        loading: false,
        loaded: false,
        color: '#FFCC66',
        switch1: false,
        switch2: false,
        freshStatus: 'more', // 当前刷新的状态
        showRefresh: false,   // 是否显示下拉刷新组件
        windowHeight: 0,
        isScrolling: false,
        load_text: "加载更多数据",
        windowWidth: "",
        number: 1,
        navHeight: "",
        // icon: 'star-o',
        searchValue: "",
        status: "",
        items: [
            { name: 'USA', value: '美国', checked: false },
            { name: 'CHN', value: '中国', checked: true },
            { name: 'BRA', value: '巴西', checked: false },
            { name: 'JPN', value: '日本', checked: false },
            { name: 'ENG', value: '英国', checked: false },
            { name: 'TUR', value: '法国', checked: false },
            { name: 'TUR', value: '法国', checked: false },
            { name: 'TUR', value: '法国', checked: false },
             
        ]
      }
    },
    computed: {
      dataArr1() {
        return this.dataArr
      }
    },
    mounted () {
      this.windowHeight = this.globalData.windowHeight
      this.windowWidth = this.globalData.windowWidth
      // this.navHeight = this.globalData.navHeight
      // console.log(this.navHeight)
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
        } else {
          this.showRefresh = false
        }
      },
    // 触摸结束
      touchEnd(e) {
        if (this.freshStatus == 'end') {
          // 延迟 500 毫秒，显示 “刷新中”，防止请求速度过快不显示
          // setTimeout(()=>{
              this.getData(); // 获取最新列表数据
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
        let type = 'find_mate'
        if(this.isScrolling===true) {
          return;
        }
        this.isScrolling=true;
        that.loading = true;
        that.loaded = false;
        that.number = that.number + 1
        this.$http.get(`/app/house/export/list?pageIndex=${that.number}&pageSize=10&type=${type}`, res=> {
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
              that.dataArr1 = that.dataArr1.concat(res.data.data)
              that.dataArr1.forEach(num => {
                  num.updateTime = num.updateTime.substring(0, 10)
                  if(num.favorite == false) {
                    num.icon="star-o"
                  } else {
                    num.icon = "star"
                  }
              })
              
            })
            
          }  
        })
      },
      getData() {
        let that = this
        if(that.showRefresh == true) {
          this.freshStatus = 'fresh'
        }
        that.number = 1
        let type = 'find_mate'
        this.$http.get(`/app/house/export/list?pageIndex=1&pageSize=10&type=${type}`, res=> {
          if(res.data.success) {
            setTimeout(() => {
              this.showRefresh = false
            }, 1000)
            that.dataArr1 = [].concat(res.data.data)
            that.dataArr1.forEach(num => {
              num.updateTime = num.updateTime.substring(0, 10)
              if(num.favorite == false) {
                num.icon="star-o"
              } else {
                num.icon = "star"
              }
            })
          }
        })
          
      },
      checkboxChange(e){
        console.log('checkbox发生change事件，携带value值为：', e.mp.detail.value)
    },

    //添加class 样式
    addclass(e){
        let self = this
        //获取数据
        let list = self.items
        //获取index
        let index = e.mp.currentTarget.dataset.index
        //如果为true变为false
        if(list[index].checked){
            list[index].checked=false
        }else{
            list[index].checked = true
        }
        //重新赋值
        self.items = [] .concat(list)
    },    
      onConfirm() {
        this.$root.$mp.page.selectComponent('#item').toggle();
      },
      onConfirmReset() {
        this.items.forEach(num => {
          num.checked = false
        })
        this.switch1 = false
        this.$root.$mp.page.selectComponent('#item').toggle();
      },
      onInput () {
        this.switch1 = !this.switch1
        if(this.switch1) {
          this.status = "finished"
        } else {
          this.status = "persistent"
        }

      },
      onInput1 () {
        this.switch2 = !this.switch2
      },
      onSearchSend(e) {
        let that = this
        if(this.searchValue) {
          that.number = 1
          let title = this.searchValue
          let type = 'find_mate'
          this.$http.get(`/app/house/export/list?pageIndex=1&pageSize=10&type=${type}&title=${title}`, res=> {
            if(res.data.success) {
              that.dataArr1 = [].concat(res.data.data)
              that.dataArr1.forEach(num => {
                num.updateTime = num.updateTime.substring(0, 10)
                if(num.favorite == false) {
                  num.icon="star-o"
                } else {
                  num.icon = "star"
                }
              })
            }
          })
          // this.$store.commit('changeValue', this.searchValue) 
        }
      },
      turnDetail(e,num) {
        let a = JSON.stringify(num)
          wx.navigateTo({
            url: '/pages/detail/main?dataDetail='+encodeURIComponent(a),
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
          this.$http.delete(`/app/favorites/dislike/${val.id}`, res => {
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
.roomlate {
  width: 100%;
}
.roomlate .load_more {
  width: 65%;
  margin: 0rpx auto;
  margin-bottom: 70rpx;
  font-size: 14px;
  text-align: center;
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
}
.roomlate .load_loading {
  margin: 0 10rpx;
  width: 40rpx;
  /* display: inline-block;
  vertical-align: middle; */
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
  
}
.roomlate .load_tips {
  display: inline-block;
  vertical-align: middle;
}
.roomlate .load_end {
  width: 65%;
  margin: 0rpx auto;
  margin-bottom: 70rpx;
  font-size: 14px;
  text-align: center;
  position: relative;
}

.roomlate .footer1 {
  height: 40rpx;
}
.roomlate .search .van-search__content--round {
 border: 1px solid #000;
}
.roomlate .choose span{
  font-size: 24rpx;
  float: left;
  padding-left: 20rpx;
}
.roomlate .home_img{
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  /* margin: 100rpx 0; */
  margin-left: 30rpx;
}
.roomlate .choose div {
  width: 160rpx;
  height: 40rpx;
  line-height: 40rpx;
}
.roomlate .choose .choose_div::before  {
  color: aqua;
}
.choose_time {
  /* float: left; */
}
.roomlate .choose {
  width: 100%;
  display: flex;
  margin-left: 20rpx;
  margin-bottom: 20rpx !important;
}
 .roomlate .bg_red {
  color: #1989fa !important;
}
.roomlate .content_main {
  display: flex;
  flex-direction: column;
}
.roomlate .content_main .remark{
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
 .roomlate .content_main .tubiao {
  display: flex;
  flex-wrap: wrap
}
.roomlate .name {
  width: 262rpx !important;
  /* flex: 1; */
  padding: 20rpx;
}
.roomlate .van-panel {
  border: 2rpx solid#87caee;
  padding: 2rpx;
  border-radius: 5rpx;
}
.roomlate .name span {
  width:auto;
  display: inline-block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 28rpx;
  
}
.roomlate .name span i {
padding-left: 10rpx;
}
.roomlate .time {
  float: right;
  font-size: 25rpx;
}
.roomlate .time p {
  text-align: right;
  font-weight: 600;
  color: red;
}
.roomlate .sublet {
  padding: 20rpx 30rpx !important;
  
}
.roomlate .sublet:first-child {
  padding-top: 0rpx !important;
}
.roomlate .footer {
  text-align: right;
}
.roomlate .footer .van-button {
   font-size: 28rpx;
   width: 140rpx;
   height: 64rpx;
}
.roomlate .sublet:last-child {
  margin-bottom: 40rpx;
}
.roomlate .search .van-search__action--hover {
  background: #f0f3f6 !important;
}
.roomlate .shaixuan .van-dropdown-menu {
  height: 40rpx !important;
  line-height: 40rpx;
  background: #f0f3f6 !important;
}
.roomlate .shaixuan .van-ellipsis {
  font-size: 24rpx;
}
.shaixuan .van-cell {
}
.roomlate .van-dropdown-item--down {
  top: 185px!important;
}
.shaixuan .van-cell .van-button {
  width: 200rpx;
  height: 80rpx;
   opacity: 0.8;
  font-size: 30rpx;
}
.checkbox{
    /* opacity: 0; */
    position: absolute;
    top: 0;
    left: 0;
    height: 50rpx;
    width: 100rpx;
}
.checkbox{
    position: relative;
    height: 50rpx;
    line-height: 50rpx;
    width: 100rpx;
    background: #ccc;
    color: #fff;
    font-size: 28rpx;
    border-radius: 10rpx;
    margin: 10rpx;
    text-align: center;
    padding: 0 10rpx;
    box-sizing: border-box;
}
.boxflex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
.active{
    background: #1989fa;
}
.symbolRental .van-cell__title,.van-cell__value {
flex: none;
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