<template>
  <view :style='{height:dynamicHeight+"rpx", backgroundColor:backgroundColor}' class="refresh-container">
  <view class='refresh-layout' :style='{lineHeight:refreshHeight+"rpx",height:refreshHeight+"rpx"}'>
    <view class="refresh-loading" v-if="0!=pullState"></view>
    <text class="refresh-tips">{{pullState==1?'下拉刷新...':pullState==0?'正在刷新...':'松开刷新...'}}</text>
  </view>
</view>
</template>

<script>
let lastY = 0
const PULL_DEFAULT = -1 //默认
const PULL_LT_HEIGHT = 1 //下拉小于高度
const PULL_GT_HEIGHT = 2 //下拉大于高度
const PULL_REFRESHING = 0 //刷新中
let platform = 'ios', scale = 375/ wx.getSystemInfoSync().windowWidth*2
  export default {
    name: '',
    props: {
      backgroundColor: {
        type: String,
        default: "#000"
      },
      refreshHeight: {
        type: Number,
        default: 150
      },
      textColor: {
        type: String,
        default: "white"
      }
    },
    data() {
      return {
        pullState: PULL_DEFAULT, // 刷新状态 -1:默认  1:开始下拉  2: 达到下拉最大距离  0: 正在刷新 
        dynamicHeight: 0, //刷新布局动态高度
        refreshHeight: 150, //触发刷新的最小高度
        scrollTop: 0
      }
    },
    created () {
       platform = wx.getSystemInfoSync().platform
       scale =  wx.getSystemInfoSync().windowWidth / 375 *2
    },
    methods: {
      autoRefresh() {
        this._pullStateChange(PULL_REFRESHING, this.refreshHeight)
        //刷新事件 回调出去
        this.triggerEvent("onRefresh")
      },
    //停止刷新
    stopPullRefresh() {
      // this._pullStateChange(PULL_DEFAULT, 0)
      let a = new Promise((resolve, reject) => {
        this. pullState = PULL_DEFAULT
        this.dynamicHeight = 0
        resolve()
      })
      a.then(() => {
        wx.pageScrollTo({scrollTop: 0,duration: 0})
      })
      // this.setData({
      //   pullState: PULL_DEFAULT,
      //   dynamicHeight: 0
      // }, () => {
        
      // })

    },
    //是否正在刷新
    isRefreshing() {
      return PULL_REFRESHING == this.pullState
    },
    //是否下拉状态
    isPullState() {
      return PULL_DEFAULT != this.pullState
    },
    //页面触摸开始事件，必须在触摸开始方法中调用此方法
    handletouchstart: function(event) {
      lastY = event.touches[0].clientY
    },
    //页面触摸移动事件，必须在触摸开始方法中调用此方法
    handletouchmove: function(event) {
      let pageY = event.touches[0].pageY
      let clientY = event.touches[0].clientY
      let offsetY = clientY - lastY
      if (this.scrollTop > 0 || offsetY < 0) return
      // if (0 == this.pullState) return
      let dynamicHeight = this.dynamicHeight + offsetY
      if (dynamicHeight > this.refreshHeight) {
        this._pullStateChange( (0 == this.pullState)?0:PULL_GT_HEIGHT, dynamicHeight)
      } else {
        dynamicHeight = dynamicHeight < 0 ? 0 : dynamicHeight //如果动态高度小于0处理
        this._pullStateChange((0 == this.pullState) ? 0 :PULL_LT_HEIGHT, dynamicHeight)
      }
      lastY = event.touches[0].clientY
    },
    //页面触摸结束事件，必须在触摸开始方法中调用此方法
    handletouchend: function(event) {
      let refreshHeight = this.refreshHeight
      if (0 == this.pullState){ 
        this._pullStateChange(PULL_REFRESHING, refreshHeight)
        return
      }
      let dynamicHeight = this.dynamicHeight
      if (this.scrollTop > 0 && PULL_DEFAULT != this.pullState) {
        // let top = this.scrollTop / wx.getSystemInfoSync().windowWidth * 20
        //2 * this.scrollTop 两倍表示px转rpx，  所以这里必须进行单位转换
        if (dynamicHeight - scale * this.scrollTop > refreshHeight) {
          this._pullStateChange(PULL_REFRESHING, refreshHeight)
          //刷新事件 回调出去
          this.triggerEvent("onRefresh")
        } else {
          this._pullStateChange(PULL_DEFAULT, 0)
          wx.pageScrollTo({scrollTop: 0,duration: 0})
        }
        return
      }
      if (dynamicHeight >= this.refreshHeight) {
        this._pullStateChange(PULL_REFRESHING, refreshHeight)
        //刷新事件 回调出去
        this.triggerEvent("onRefresh")
      } else {
        this._pullStateChange(PULL_DEFAULT, 0)
      }
    },
    //页面触摸取消事件，必须在触摸开始方法中调用此方法
    handletouchcancel: function(event) {
      this._pullStateChange(PULL_DEFAULT, 0)
    },
    //页面滚动
    onPageScroll: function(event) {
      if (event.scrollTop > 0 && PULL_DEFAULT != this.pullState) {
        //2 * this.scrollTop 两倍表示px转rpx，  所以这里必须进行单位转换
        if (this.dynamicHeight - scale * event.scrollTop < this.refreshHeight) {
          
            this.pullState = PULL_LT_HEIGHT
          
        } else {
          this.pullState = PULL_GT_HEIGHT
        
        }
      }
      this.scrollTop = event.scrollTop
    },
    //是否是安卓平台
    _isAndriod() {
      return 'ios' == platform
    },
    //下拉状态监听
    _pullStateChange(state, dynamicHeight) {
      this.pullState = state
      this.dynamicHeight = dynamicHeight
      // this.setData({pullState: state,dynamicHeight: dynamicHeight})
      this.triggerEvent("onPullState")
    }
    }
  }
</script>

<style scoped>
  .refresh-container {
  box-sizing: border-box;
  font-size: 28rpx;
  color: #999;
  background-color: #eee;
  display: flex;
  width: 100%;
}
.refresh-layout {
  vertical-align: center;
  width: 100%;
  text-align: center;
  align-self: flex-end;
}

.refresh-loading {
  margin: 0 5px;
  width: 30rpx;
  height: 30rpx;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: weuiLoading 1s steps(12, end) infinite;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
}

.refresh-tips {
  line-height: 30rpx;
  font-size: 26rpx;
  vertical-align: middle;
  margin: auto;
}

</style>