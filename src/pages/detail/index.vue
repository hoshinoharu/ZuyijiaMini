<template>
  <div>
    <Top :back="back"></Top>
    <div>
      <div class="lunbo">
        <div class='pageBox pageTwo'>
          <swiper class='swiperClass' autoplay indicator-color="#a39f99" indicator-active-color="#f49641" indicator-dots  interval="2000" duration="1000" previous-margin="60px" next-margin="60px" circular @change="bindchange" :style="{height: swiperHeight+'px'}">
            <block v-for="(num, index) in imgUrls" :key="index">
              <swiper-item>
                <!-- <image :src="num" class="slideImage" @tap="onPreview($event, num)" 
                :class="swiperIdx == index ? 'active' : 'quiet'" mode='aspectFill'></image> -->
                <van-image
                  width="100%"
                  height="90%"
                  fit="cover"
                  @tap="onPreview($event, num)" 
                 :src="num"
                 :image-class="swiperIdx == index ? 'active' : 'quiet'" 
                  class="slideImage"
                />
              </swiper-item>
            </block>
           </swiper>
        </div>
      </div>
      <div>
        <van-panel :title="roomDetail.title" :desc="roomDetail.tagsName" :status="roomDetail.statusStr" use-footer-slot>
          <div>
            <div class="detail_main">
              
              <div class="remark">
                <span>{{roomDetail.description}}</span>
              </div>
              <div class="detail_main_item">
                <span class="label">发布人</span>
                <div>
                  <!-- <image class="home_img" :src="url" alt=""></image> -->
                    
                    <i class="iconfont icon-xingbienan" style="color:#83b2f9; float:right" v-if="roomDetail.sex=='male'"></i>
                    <i class="iconfont icon-xingbienv" style="color:#f983a9" v-else></i>
                    <span class="title_icon info">{{roomDetail.creator.username}}&nbsp;&nbsp;</span>
          
                </div>
              </div>
              <div class="detail_main_item">
                <span class="label">地点</span>
                <span class="info">{{roomDetail.provName + '-' + roomDetail.cityName+'-'+roomDetail.counName+' '+""}}</span>
              </div>
              <div class="detail_main_item">
                <span class="label">租期</span>
                <span class="info">{{roomDetail.liveDuration}}&nbsp;&nbsp;/月</span>
              </div>
              <div class="detail_main_item">
                <span class="label">每月租金</span>
                <span class="info">{{roomDetail.priceEachMonth}}&nbsp;&nbsp;￥/月</span>
              </div>
              <div class="detail_main_item">
                <span class="label">发布时间</span>
                <span class="info">{{roomDetail.updateTime}}</span>
              </div>
            </div>
          </div>
          <div slot="footer" class="footer">
            <!-- v-if="flag" -->
            <van-button size="small" icon="chat-o" color="#07c160"  v-if="flagMsg!='true'"  plain @tap="messageTurn">留言</van-button>
            <van-button size="small"  :icon="icon" :color="color" plain @tap="collect(roomDetail)">收藏</van-button>
          </div>
        </van-panel>
      </div>
    </div>
    <van-action-sheet :show="false" title="留言板" class="leave_message" @close="onClose">
      <div class="message">
        <div>
          <!-- <input type=""> -->
          <van-button size="small" round>提交</van-button>

        </div>
        
      </div>
    </van-action-sheet>
    <!-- <van-overlay :show="warningShow" @click="onClickWarning"> -->
       <!-- <image :src="bigPath" alt="" class="bmg"></image> -->
       <!-- <van-image
          :width="windowWidth"
          height="90%"
          fit="contain"
          class="bmg"
          :src="bigPath + '?quality=1'" 
        />
    </van-overlay> -->
  </div>
</template>

<script>
import Top from '../../components/head/index'
  export default {
    name: '',
    components: {
      Top
    },
    // props: {
    //   roomDetail:{
    //     type: Object,
    //     default: () => {}
    //   }
    // },
    data() {
      return {
        back: {
          flag: true,
          text: '房源详情', 
        },
        showMessage: false,
        warningShow: false,
        color: '#FFCC66',
        icon: 'star',
        flagMsg: 'false',
        bigPath: "",
        sex: 'male',
        home_pics: [],
        windowWidth: "",
        userId: "",
        roomDetail: {},
        data1: {
          description: "速度大大大大大大大大大大大大大大大大大但是杀杀杀杀杀杀杀杀杀说的是事实",
          liveDuration: "2",
          priceEachMonth: "133",
          updateTime: "2020-08-07 11:38:39",
          icon: 'star'
        },
        imgUrls: [
          'https://hbimg.huabanimg.com/9abd8e7d768e6bb070de86c09671b73c81de118d43df2-xahAjO_fw658',
          'https://hbimg.huabanimg.com/9abd8e7d768e6bb070de86c09671b73c81de118d43df2-xahAjO_fw658',
          'https://hbimg.huabanimg.com/9abd8e7d768e6bb070de86c09671b73c81de118d43df2-xahAjO_fw658'
        ],
        swiperIdx: 0
      }
    },
    onLoad(option) {
      
      this.windowWidth = this.globalData.windowWidth
      this.userId = wx.getStorageSync("id")
      let roomDetail = JSON.parse(decodeURIComponent(option.dataDetail))
      console.log(roomDetail)
      this.roomDetail = roomDetail
      // if(this.userId == roomDetail.creatorId) {
      //   this.flag = true
      // }
      // console.log(this.flag, "flag")
      console.log(this.userId, roomDetail.creatorId)
      this.$store.commit('changeType', roomDetail.type)
      this.imgUrls = JSON.parse(roomDetail.imgUrls)
      this.imgUrls.forEach((num, i)=> {
        if(num.indexOf('http') != 0) {
          this.imgUrls[i] = 'https://www.zuyijia.cn:9443/app' + num
        }
        
      })
      this.home_pics = [].concat(this.imgUrls)
      this.home_pics.forEach((num, i) => {
         this.home_pics[i] = num + '?quality=1'
      })
      console.log(this.imgUrls)
    },
    mounted () {
      
       if(this.userId == this.roomDetail.creatorId) {
        this.flagMsg = 'true'
      }
      this.$forceUpdate();
      console.log(this.flagMsg, "flag")
    },
    methods: {
      previewImage: function (path) {  
        var current=path
        wx.previewImage({
              current: current + '?quality=1', // 当前显示图片的http链接
              urls: this.home_pics // 需要预览的图片http链接列表
        })
      },
      onPreview(e, path) {
        // this.warningShow = true
        this.bigPath = path
        this.previewImage(path)
      },
      onClickWarning() {
        this.bagPath = ""
        // this.warningShow = false
      },
      messageTurn(){
        if(this.globalData.tokenFlag == undefined || this.globalData.tokenFlag == null ||this.globalData.tokenFlag==false) {
            wx.showToast({
                title: '请用户先登录',
                icon: 'none',
                mask:true,
                duration: 2000
              })
          } else {
          wx.navigateTo({
            url: `/pages/detailInfo/main?id=${this.roomDetail.creatorId}` 
          })
        }
        // this.showMessage = true
      },
      onClose() {
        // this.showMessage = false
      },
      bindchange(e) {
        this.swiperIdx = e.mp.detail.current
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
    }
  }
</script>

<style>
.bmg{
    width: 100%;
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 1001;
    margin: auto;
}
.bmg .van-image {
  margin-top: 15%;
  /* top: calc(50% - 200px); */
}
.detail_main{
  display: flex;
  flex-direction: column;
  align-items: center; 
  color:#888888;
}
.detail_main_item {
  width: 90%;
  margin: 15rpx 0;
}
.info {
  float: right;
  font-size: 26rpx;
}
.label {
  float: left;
  font-size: 28rpx;
  font-weight: 600;
}
.lunbo {
  width: 90%;
  margin: 0 auto;
  padding: 10px 10px;
  margin-top: 10rpx;
  margin-bottom: 20rpx;
}
.footer {
  text-align: right;
}
.footer .van-button {
  margin-left: 10px;
  font-size: 28rpx;
   width: 140rpx;
   height: 64rpx;
}
.message {
  width: 100%;
  background: #fafafa;
  height: 400rpx;
}
.leave_message .van-action-sheet {
   height: 35%;
}
.remark{
  margin: 20rpx auto;
  width: 550rpx;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  word-wrap:break-word;
  font-size: 28rpx;
  letter-spacing: 4rpx;
  text-indent: 40rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  font-family: '微软雅黑';
  color:#888888;
}
.home_img{
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  /* margin-left: 100px; */
  margin: 10px 0;
  /* margin: 100rpx 0; */
  /* border: 1px solid #fff; */
  margin-bottom: 0px;
  box-shadow: 0 2rpx 25rpx rgb(166,124,64)
}
.pageTwo .swiperClass {margin: 0;margin-top: 10px;}
.pageTwo .slideImage .van-image image{width: 100%;height: 90%;border-radius: 10px;position: relative;box-shadow: 0 0 10rpx rgba(0, 0, 0, .8)}
.pageTwo .van-image image.active {transform: none;transition: all 0.2s ease-in 0s;}
.pageTwo .van-image image.quiet {transform: scale(0.8333333);transition: all 0.2s ease-in 0s;}
</style>