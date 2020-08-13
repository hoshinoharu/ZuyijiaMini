<template>
  <div>
    <Top :back="back"></Top>
    <div>
      <div class="lunbo">
        <div class='pageBox pageTwo'>
          <swiper class='swiperClass' autoplay indicator-color="#a39f99" indicator-active-color="#f49641" indicator-dots  interval="2000" duration="1000" previous-margin="60px" next-margin="60px" circular @change="bindchange" :style="{height: swiperHeight+'px'}">
            <block v-for="(num, index) in imgUrls" :key="index">
              <swiper-item>
                <image :src="num" class="slideImage" :class="swiperIdx == index ? 'active' : 'quiet'" mode='aspectFill'></image>
              </swiper-item>
            </block>
           </swiper>
        </div>
      </div>
      <div>
        <van-panel title="标题" desc="标识位" status="状态" use-footer-slot>
          <div>
            <div class="detail_main">
              <div class="remark">
                <span>{{data1.description}}</span>
              </div>
              <div class="detail_main_item">
                <span class="label">发布人</span>
                <div>
                  <!-- <image class="home_img" :src="url" alt=""></image> -->
                    
                    <i class="iconfont icon-xingbienan" style="color:#83b2f9; float:right" v-if="sex=='male'"></i>
                    <i class="iconfont icon-xingbienv" style="color:#f983a9" v-else></i>
                    <span class="title_icon info">{{'dddd'}}&nbsp;&nbsp;</span>
          
                </div>
              </div>
              
              <div class="detail_main_item">
                <span class="label">租期</span>
                <span class="info">{{data1.liveDuration}}&nbsp;&nbsp;/月</span>
              </div>
              <div class="detail_main_item">
                <span class="label">每月租金</span>
                <span class="info">{{100}}&nbsp;&nbsp;￥/月</span>
              </div>
              <div class="detail_main_item">
                <span class="label">发布时间</span>
                <span class="info">{{data1.updateTime}}</span>
              </div>
            </div>
          </div>
          <div slot="footer" class="footer">
            <van-button size="small" icon="chat-o" color="#07c160" plain @tap="message">留言</van-button>
            <van-button size="small"  :icon="icon" :color="color" plain @tap="collect(data1.icon)">收藏</van-button>
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
  </div>
</template>

<script>
import Top from '../../components/head/index'
  export default {
    name: '',
    components: {
      Top
    },
    props: {
      roomDetail:{
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        back: {
          flag: true,
          text: '房源详情', 
        },
        showMessage: false,
        color: '#FFCC66',
        icon: 'star',
        sex: 'male',
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
      console.log(option.dataDetail);
    },
    methods: {
      message(){
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
          val.icon = 'star'
        } else {
          val.icon = 'star-o'
        }
        console.log(val)
      },
    }
  }
</script>

<style>
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
.pageTwo .slideImage {width: 100%;height: 90%;border-radius: 10px;position: relative;box-shadow: 0 0 10rpx rgba(0, 0, 0, .8)}
.pageTwo image.active {transform: none;transition: all 0.2s ease-in 0s;}
.pageTwo image.quiet {transform: scale(0.8333333);transition: all 0.2s ease-in 0s;}
</style>