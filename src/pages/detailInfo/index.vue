<template>
  <div class="chat_all">
    <Top :back="back"></Top>
    <div class="chat">
      <div class="chat_body" :style="{height: heightP + 'rpx', width: '100%'}">
        <div v-for="(num, i) in 10" :key="i">

        
          <div  class="chat_image">
            <div>
              <image class="home_img" 
              src="https://wx.qlogo.cn/mmopen/vi_32/2JJlCSK63JyAoUflTl8xBbZFgKg9OUaYia0ib7bq7qNHgMkRz2hSTtTxDvrgujEFJh6Kz4HqkKXa0ibmkvfzlWBIw/132" alt="">
              </image>
            </div>
            <div class="bubble_diailog size_1">
              <i class="l"></i>
              <b class="l"></b>
              <div class="text">
                <span>dddddddddddddddddddlkkkkkkkkkkkkkkkkkkkkklkddsssssssss</span>
                
              </div>
            </div>
          </div>
          <div  class="chat_image" style="float: right">
            
            <div class="bubble_diailog right_bubble size_1">
              <i class="r"></i>
              <b class="r"></b>
              <div class="text">
                <!-- <span>dddddddddddddddddddddsssssssss</span> -->
                <image class="chat_photo" :src="path"></image>
              </div>
            </div>
            <div>
              <image class="home_imgr" 
              src="https://wx.qlogo.cn/mmopen/vi_32/2JJlCSK63JyAoUflTl8xBbZFgKg9OUaYia0ib7bq7qNHgMkRz2hSTtTxDvrgujEFJh6Kz4HqkKXa0ibmkvfzlWBIw/132" alt="">
              </image>
            </div>
          </div>
          <div style="clear: both; height: 90rpx"></div>
         </div>
      </div>
       <div class="chat_footer">
          <div class="l-custom-input">
              <input size="large" id="l-input" 
              type="text" 
              confirm-type='send'
              @confirm="sendMsgTap"
              cursor-spacing="20"
              />
              <div class="l-button">
                <van-uploader @afterread="afterRead">
                  <van-icon name="photo-o" size="25px" style="margin: 18rpx 20rpx 0px 20rpx"/>
                </van-uploader>
                
                <van-button size="small" round>发送</van-button>
              </div>
          </div>
       </div>
    </div>
    <!-- <van-action-sheet :show="false" title="留言板" class="leave_message" @close="onClose">
      <div class="message">
        <div>
          <input type="">
          <van-button size="small" round>提交</van-button>

        </div>
        
      </div>
    </van-action-sheet> -->
  </div>
</template>

<script>
import Top from '../../components/head/index'
  export default {
    name: '',
    components: {
      Top
    },
    data() {
      return {
        back: {
          text: '聊天室',
          flag: true
        },
        heightP: "",
        path: ""
      }
    },
    onLoad() {
      this.heightP = this.globalData.windowHeight*2;
      console.log(this.heightP)
    },
    mounted () {
     console.log(this.globalData, "dd")
    },
    methods: {
      sendMsgTap(e) {
        console.log(e.mp.detail.value)
      },
      afterRead(e) {
        let { file } = e.mp.detail
        let url = file.path
        this.path = url
        // console.log()
      }
    }
  }
</script>

<style scoped>
  .chat_footer {
    position: fixed; 
    bottom: 0;
    width: 100%; 
    height: 90rpx;/*脚部的高度*/
    background: #fff; 
    clear:both;
    margin: 0px 0px;
  }
  .chat_photo {
    width: 160rpx;
    height: 160rpx;
    border: 1rpx solid #fff;
    border-radius: 10rpx;
    margin: 7rpx 10rpx 0rpx 10rpx;
  }
  .chat_image {
    display: flex;
    align-items: center
  }
  .chat {
    width: 100%;
    height: 100%;
    background: #f9f9f9;
    /* margin-bottom: 90rpx; */
    overflow: hidden;
  }
  .chat_body {
    height: 100%;
    position: relative;
    display: inline-block;
    overflow: hidden;
    overflow-y: scroll;
  }
.chat_body::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
  display: none;
}
  .message {
    width: 100%;
    background: #fafafa;
    height: 400rpx;
  }
   .bubble_diailog .text span{
    position: relative;
    
    padding: 4rpx;
    word-wrap: break-word;
    word-break: break-all;
  }
  .bubble_diailog .text {
    max-width: 400rpx;
    padding: 10rpx;
  }
 .bubble_diailog{
    position: relative;
    background: #ffc;
    border:1px solid #ccc;
    border-radius: 3px;
    margin:20px 0 0 20rpx;
 }
 .right_bubble {
   margin:40rpx 20rpx 0 0;
 }
 .home_img{
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin: 40rpx 0px 0px 20rpx;
  /* margin: 100rpx 0; */
  border: 1px solid #fff;
}
.home_imgr{
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin: 40rpx 20rpx 0px 0rpx;
  /* margin: 100rpx 0; */
  border: 1px solid #fff;
}
 .bubble_diailog i,.bubble_diailog b{position: absolute;width: 0;height: 0;overflow: hidden;border-width:5px;display:block;}
/*上*/
 .bubble_diailog i.t,.bubble_diailog b.t{border-style: dashed dashed solid dashed;}
 .bubble_diailog i.t{top:-10px;left:30px;border-color:transparent transparent #ccc transparent;}
 .bubble_diailog b.t{top:-9px;left:30px;border-color:transparent transparent #ffc transparent;}
/*下*/
 .bubble_diailog i.b,.bubble_diailog b.b{border-style:solid dashed dashed dashed;}
 .bubble_diailog i.b{bottom:-10px;left:30px;border-color:#ccc transparent transparent transparent;}
 .bubble_diailog b.b{bottom:-9px;left:30px;border-color:#ffc transparent transparent transparent;}
/*左*/
 .bubble_diailog i.l,.bubble_diailog b.l{border-style:dashed solid dashed dashed;}
 .bubble_diailog i.l{
   /* top:29px; */
   left:-22rpx;
   border-color:transparent #ccc transparent transparent;
    }
 .bubble_diailog b.l{
   /* top:29px; */
   left:-18rpx; 
   border-color:transparent #ffc transparent transparent;
   }
/*右*/
 .bubble_diailog i.r,.bubble_diailog b.r{border-style:dashed dashed dashed solid;}
 .bubble_diailog i.r{
   right:-22rpx; 
   /* margin: auto 0;  */
   border-color:transparent transparent transparent #ccc;
   }
 .bubble_diailog b.r{
   right:-18rpx; 
   /* margin: auto 0;  */
   border-color:transparent transparent transparent #ffc;
   }


 .size_1{
   /* width: 200px; */
   width: auto;
   height: auto;
   display: flex;
   align-items: center;
   }

/**
 * IE ARGB背景半透明滤镜溢出隐藏bug
 * http://himeters.com/ie-argb-overflowhidden-bug
*/
 .bubble_opacity{border-radius: 3px;margin:-40px 0 0 20px;font-size:14px;
 background-color:rgba(0,0,0,.8);position:relative;
}
 .bubble_opacity,.bubble_opacity .in{width:200px;height:80px;}
 .bubble_opacity .in{filter: progid:dximagetransform.microsoft.gradient(startcolorstr="#CC000000", endcolorstr="#CC000000");}
 .bubble_opacity i{overflow:hidden;display:block;height:0;width:0;border-style:dashed dashed solid dashed;border-color:transparent transparent #000 transparent;position:absolute;top:-10px;left:30px;border-width:5px;opacity: .8;filter:alpha(opacity=80);}
 .bubble_opacity p{padding:20px 0 0 20px;color:#fff;}
 .l-custom-input{
  position: relative;
}
.l-button {
  width: 220rpx;
  position: absolute;
  top: 8px;
  right: 0px;
  display: flex;
  /* flex-direction: column; */
  align-items: center;

}
.l-button .van-icon {
  margin: 0px 20rpx;
}
.l-button .van-button {
  height: 40rpx;
  width: 60rpx;
  margin-left: 2px;
}
#l-input{
    border: none;
    width: calc(100% - 225rpx);
    display: block;
    padding: 12px 0px 2px 10px;
    font-size: 16px;
    background: none;
    color: #000;
    text-indent: 0;
    border-bottom: 1px solid #e0e0e0;
}
#l-input::before {
    outline: none;
    border-bottom: 1px solid #2196f3;
}
</style>