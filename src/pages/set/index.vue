<template>
  <div>
    <Top :back="back"></Top>
    <div class="set_body">
      <ul class="ul_mine">
        <li class="li_mine">
          <van-button round plain class="set_but" @tap="roomRent($enent,'short')">房源短租</van-button>
        </li>
        <li class="li_mine">
          <van-button class="set_but" round plain @tap="roomRent($enent,'tent')">房源转租</van-button>
        </li>
        <li class="li_mine">
          <van-button round plain class="set_but" @tap="roomRent($enent,'mate')">寻找室友</van-button>
        </li>
      </ul>
    </div>
    <div class="footer">
      <Bottom :selected="1"></Bottom>
    </div>
  </div>
  
</template>

<script>
import Bottom from '../../components/bottom/index'
import Top from '../../components/head/index'
  export default {
    components: {
      Bottom,
      Top
    },
    name: '',
    data() {
      return {
        back: {
          flag: false,
          text: '房源发布'
        }
      }
    },
    created () {
      wx.hideTabBar({
        aniamtion: false,
        fail () {
          setTimeout(function () {
            wx.hideTabBar({ aniamtion: false })
          }, 500)
        }
      })
    },
    methods: {
      roomRent(e, type) {
        let url;
        switch(type) {
          case 'tent': 
           url = '/pages/housingRental/main';
           break;
          case 'short':
            url = '/pages/housingShort/main'
            break;
          case 'mate':
            url = '/pages/housingRomate/main'
            break;
          default:
            url = ''
            break
        }
        console.log("dd")
       wx.navigateTo({
          url: url,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
          success:function(){
            console.log("Sss")
          },        //成功后的回调；
          fail:function(){},          //失败后的回调；
          complete:function(){}      //结束后的回调(成功，失败都会执行)
        })
      }
    }
  }
</script>

<style>
  .set_body {
    width: 90%;
    height: 600rpx;
    margin: 0 auto;
    margin-top: calc(50% - 150rpx);
  }
  .ul_mine {
     margin: 20px auto; 
     width:90%; 
     overflow:hidden
  }
 .ul_mine li{
    float:left; 
    padding:10px 8px; 
    width: 100%
  }
  .ul_mine .set_but .van-button {
    width: 400rpx;
    height: 90rpx;
    margin-top: 24rpx;
    left: calc(50% - 100px);
    font-weight: 600;
    background: linear-gradient(rgb(252, 126, 67), rgba(255,0,0,0)); 
  }
</style>