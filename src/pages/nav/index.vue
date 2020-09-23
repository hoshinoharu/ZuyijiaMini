<template>
  <div style="background-color: #fafafa;" class="nav_all">
	<div class="header">
		<!-- 官方自定义导航栏抽取出来的模块 -->
		<div class="navigation">
			<div class="weui-navigation-bar">
				<div :class="{ios: ios?'ios':'android'}" class="weui-navigation-bar__placeholder" :style="{paddingTop:statusBarHeight+'px',visibility: hidden}"></div>
				<div class="weui-navigation-bar__inner" :style="{paddingTop: statusBarHeight+'px',paddingRight: innerPaddingRight,width:innerWidth, background: '#fff'}">
					<div class='weui-navigation-bar__left1' :style="leftWidth"  bindtap="back">
						<div class="">
							<div class="weui-navigation-bar__btn_goback1">
                <div class="header-l" @click="addressClick">
                  <i class="iconfont icon-ditu" :style="{color: '#434343', 'font-size': 35 + 'rpx'}"></i>
                  <span>{{address}}</span>
                  <i class="iconfont icon-sanjiaoxing " :style="{color: '#434343', 'font-size': 40 + 'rpx'}"></i>
                </div>
              </div>
						</div>
					</div>
					<div class='weui-navigation-bar__center'>
						<!-- 自定义导航标题 -->
						<div class="navigation-title">
              <text>{{timeNow}}</text>
							<!-- 从这里开始就是写自己的代码了 -->
						
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  <!-- <div style="clear: both;"></div> -->
  <div style="clear: both; background: #fff;" :style="{marginTop: 2*navHeight + 'rpx'}"></div>
	<div class="main" >
    <div class="test">
      <div class="testNav" style="height:">
        <div
          :class="{'selected':tab === 1,'testTitle':true}"
          @click="changTab(1)"
        >短租</div>
        <div
          :class="{'selected':tab === 2,'testTitle':true}"
          @click="changTab(2)"
        >转租</div>
        <div
          :class="{'selected':tab === 3,'testTitle':true}"
          @click="changTab(3)"
        >找室友</div>
      </div>
      <div style="clear: both;"></div>
      <div class="room">
        <div v-if="tab===1">

          <div class="room_main">
            <short :dataArr="dataArr"></short>
            
          </div>
        </div>
        <div v-else-if="tab===2">
          <div class="room_main">
            <sublet :dataArr="dataArr"></sublet>   
          </div>
          
        </div>
        <div v-else>
          <div class="room_main">
            <roomlate :dataArr="dataArr"></roomlate>
          </div>
        </div>
      </div>
    </div>
	</div>
  <!-- <div class="load_more" v-if="loading">
    <div class="load_loading"></div>
    <div class="load-tips">正在加载……</div>
  </div>
  <div class="load_end" v-if="loaded">没有更多数据了……</div> -->
	<div class="footer">
    
    <!-- <Bottom :selected="0" @updateInfo="updateInfo"></Bottom> -->
  </div>
</div>
</template>

<script>
import Bottom from '../../components/bottom/index'
import time from '@/utils/index'
import short from "../../components/renting/short"
import sublet from "../../components/renting/sublet"
import roomlate from "../../components/renting/roomlate"
  export default {
    name: '',
    components: {
      short,
      sublet,
      roomlate,
      Bottom
    },
    props: {
      loc: {
        type: Object,
        default: {}
      },
      active: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
    //导航数组
      tab: 1,
      value: "",
      //  getTodayDate,
       timeNow: "",
       hidden: 'hidden',
       ios: "",
       address: "",
       navHeight: "",
       hidden1: true,
       loading: false,
       loaded: false,
       statusBarHeight: "",
       innerWidth: "",
       num: 1,
       searchValue: "",
       counCode: "",
       innerPaddingRight: "",
       leftWidth: "",
       dataArr: [],
       cookie: "",
       obj: {},
        navigationArr: [{
          title: '商品',
          isSelected: true
          },
          {
            title: '评价',
            isSelected: false
          },
          {
            title: '详细',
            isSelected: false
          },
          {
            title: '推荐',
            isSelected: false
          }
        ]
      }
    },
    watch: {
      '$store.state.counCode': {
        handler(newValue, oldValue) {
          console.log("new", newValue)
　　　　　 this.counCode = newValue
          let type = this.$store.state.type
          let title = ""
          this.getData(type, title)
　　　　},
　　　　deep: true
      },
      '$store.state.address': {
        handler(newValue, oldValue) {
　　　　　　this.address = newValue
　　　　},
　　　　deep: true
      },
      active (newValue, oldValue){
        console.log(newValue, oldValue,"jnjbjj")
      }
    },
    created () {
      console.log("red")
      this.counCode = this.$store.state.counCode
      this.address = this.$store.state.address
      let type = 'short_rent'
      let title = ""
      this.getData(type, title)
      // setTimeout(() => {
        // this.address = this.globalData.location.counName
        
      // }, 1000)
    },
     onPageScroll:function(e){
      // if(e.mp.scrollTop<0){
      //   wx.pageScrollTo({
      //     scrollTop: 0
      //   })
      // }
    },
    onLoad() {
      let that = this
      this.counCode = this.$store.state.counCode
      let type;
      switch(this.tab){
        case 1:
          type = 'short_rent'
          break;
        case 2:
          type = 'sublet'
          break;
        case 3:
          type = 'find_mate'
          break;
      }
      // this.getData(type)
      // this.$http.get(`/app/house/export/list?pageIndex=1&pageSize=10&type=${type}&counCode=${this.counCode}`,{
      //   type: 'short_rent'
      // }, res=> {
      //   that.dataArr = [].concat(res.data.data)
      //   that.dataArr.forEach(num => {
      //       num.updateTime = num.updateTime.substring(0, 10)
      //       if(num.favorite == false) {
      //         num.icon="star-o"
      //       } else {
      //         num.icon = "star"
      //       }
      //     })
      // })
    },
    onShow() {
      let that = this
      let type = this.$store.state.type
      let title = ""
      // this.getData(type, title)
    },
    methods: {
      getData(type, title) {
        let that = this
        this.$http.get(`/app/house/export/list?pageIndex=1&pageSize=10&type=${type}&counCode=${this.counCode}&title=${title}`, res=> {
            that.dataArr = []
            if(res.data.data.length > 0) {
              res.data.data.forEach((num, i) => {
                that.dataArr[i] = num
              })
            }
            
            // that.dataArr = [].concat(res.data.data)
            if(that.dataArr.length > 0) {
              that.dataArr.forEach(num => {
                let tags = JSON.parse(num.tags)
                  let str = "";
                  for(let i in tags) {
                    str = str + tags[i].value + "  "
                  }
                  num.tagsName = str
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
     updateInfo(value) {
       if(value.indexOf('nav') > -1) {
         this.cookie = wx.getStorageSync('cookie')
         console.log(this.cookie, "ffdfdf")
       }
       
     },
     addressClick() {
       wx.navigateTo({
        url: '/pages/map/main',
        success: function(res) {
      
        }})
     },
      changTab(index) {
        this.tab = index;
        let type;
        switch(this.tab){
          case 1:
            type = 'short_rent'
            break;
          case 2:
            type = 'sublet'
            break;
          case 3:
            type = 'find_mate'
            break;
        }
        this.$store.commit('changeType', type)
        let title = ""
        this.getData(type, title)
      },
      /** 
     * 加载数据 
     */  
    },
    mounted () {
      this.navHeight = this.globalData.navHeight
      let data = this.$store.state.style;
      this.statusBarHeight = data.statusBarHeight
      this.innerWidth = data.innerWidth
      this.innerPaddingRight = data.innerPaddingRight
      this.leftWidth = data.leftWidth
      this.ios = data.ios
      this.timeNow = time.getTodayDate()
    }
    
  }
</script>

<style scoped>
.load_more {
  width: 65%;
  margin: 20px auto;
  margin-bottom: 20rpx;
  font-size: 14px;
  text-align: center;
  display: flex;
   position: relative;
  flex-direction: row;
  justify-content: center;
}
.load_loading {
  margin: 0 5px;
  width: 40rpx;
  /* display: inline-block;
  vertical-align: middle; */
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
  
}
.load_tips {
  display: inline-block;
  vertical-align: middle;
}

.load_end {
  width: 65%;
  margin: 20px auto;
  /* margin-top: 0px; */
  margin-bottom: 20rpx;
  font-size: 14px;
  text-align: center;
  position: relative;
}
  .navigation {
  --height: 44px;
  --right: 190rpx;
}

.weui-navigation-bar {
  overflow: hidden
}

.weui-navigation-bar .android {
  --height: 48px;
  --right: 222rpx
}
.header-l {
  display: flex;
  align-items: center;
  width: 180rpx;
  margin-left: 10rpx;
  margin-bottom: 0px;
}
.weui-navigation-bar__inner {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5001;
  height: var(--height);
  display: flex;
  align-items: center;
  padding-right: var(--right);
  width: calc(100% - var(--right));
  background-color: rgba(255, 255, 255, 0.4)
}

.weui-navigation-bar__inner .weui-navigation-bar__left1 {
  position: relative;
  width: var(--right);
  padding-left: 10rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  -webkit-box-pack: center
}

.weui-navigation-bar__inner .weui-navigation-bar__left1 .weui-navigation-bar__btn {
  display: inline-block;
  vertical-align: middle;
  background-repeat: no-repeat
}

.weui-navigation-bar__inner .weui-navigation-bar__left1 .weui-navigation-bar__btn_goback1 {
  font-size: 12px;
  width: 1em;
  height: 2em;
  /* background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E");
  background-position: 50% 50%;
  background-size: cover */
}

.weui-navigation-bar__inner .weui-navigation-bar__left1 .weui-navigation-bar__btn_goback:active {
  opacity: .5
}

.weui-navigation-bar__inner .weui-navigation-bar__center {
  font-size: 17px;
  text-align: center;
  position: relative;
  flex: 1;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center
}
.weui-navigation-bar__placeholder {
  height: var(--height);
  background: #F8F8F8;
  position: relative;
  z-index: 50
}
.test {
  width: 100%;
}
.test .testNav {
  padding: 0 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  position:fixed;
  width: 100%;
  z-index: 23;
  background: #fff;
  display: flex;
}
.test .testNav .testTitle {
    flex: 1;
    text-align: center;
}
.test .testNav .selected {
    color: #87caee;
    border-bottom: 1px solid #87caee;
}
/* 上面的是WeUI的代码 */

Page{
  background-color: #f1f1f1;
}
.room {
  position: relative;
  top: 80rpx;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.room::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}
.header{
  position: absolute;

}
.data-loading {  
  height: 40rpx;  
  line-height: 40rpx;
  text-align: center;  
  font-size: 28rpx;
  position: relative;
  /* margin-top: 50rpx; */
  background-color: #fafafa;
}
.main {
  position: relative;
  width: 100%;
  height: 100%;
}
.main::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}
.nav_all {
  width: 100%;
}
.room_main {
  background: #f0f3f6;
  /* height: 100%; */
  width: 100%;
}

.navigation-title {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
}

.navigation-title text{
  font-size: 28rpx;
}

.navigation-title .selected-title{
  color: #87caee;
  position: relative;
}
.navigation-title .selected-title::before{
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  margin-left: -25rpx;
  width: 50rpx;
  height: 4rpx;
  background-color:#87caee;
}
.nav_all .slideshow image{
  width: 100%;
  height: 600rpx;
}
.nav_all .bot_footer {
  position: relative;
  width: 100%;
  /* height: 80rpx; */
  margin-bottom: 0rpx;
   background-color: rgba(255, 255, 255, 0.4)
}

</style>