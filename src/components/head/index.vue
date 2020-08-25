<template>
  <div class="ch_top">
      <div :style="{height: statusBarHeight+'px', background: back.color?back.color: '#fff'}"></div>
      <div class="tobar" :style="{height: toBarHeight+'px', background: back.color?back.color: '#fff'}">
        <div class="title" :style="{height: toBarHeight+'px',lineHeight: toBarHeight+'px'}">
          <text>{{back.text}}</text>
        </div>
        <div class="back" @tap="onClickBack" v-if="back.flag">
         <van-icon class="left_custom_class" :style="{lineHeight: toBarHeight+'px'}"  name="arrow-left" />
         <!-- <span class="left_custom" :style="{lineHeight: toBarHeight+'px'}"></span> -->
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: '',
    props: {
      back: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        toBarHeight: "",
        statusBarHeight: ""
      }
    },
    created () {
      this.toBarHeight = this.globalData.toBar;
      // console.log(this.globalData)
      this.statusBarHeight = this.globalData.statusBarHeight
    },
    methods: {
      onClickBack () {
        if(this.back.switch) {
          wx.switchTab({
            url: "/pages/nav/main",
            success: (res) => {
            let page = getCurrentPages().pop();
            if(page == undefined || page == null){
                  return
            }
            page.onLoad();
      }
          })
        } else {
          if(this.back.url) {
            wx.navigateTo({
              url: this.back.url
            })
          } else {
            wx.navigateBack({ changed: true });
          }
        }
        
        // wx.navigateBack({ changed: true });
      }
    }
  }
</script>

<style scoped>
  .ch_top {
    /* background-color: #ffdd00; */
  }
  .ch_top .tobar{
    position:relative;
  }
  .ch_top .tobar .back {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding-left: 15rpx;
    padding-right: 15rpx;
  }
 .left_custom_class {
      font-weight: 700;
      height: 100%;
      font-size: 36rpx;
    }
    .left_custom {
      /* font-weight: 700; */
      height: 100%;
      font-size: 30rpx;
      height: 100%;
    }
  .ch_top .tobar .title {
    text-align: center;
    font-weight: 700;
    font-size: 36rpx;
  }
</style>