<template>
  <div class="chat_all">
    <Top :back="back" ></Top>
    <div class="chat">

    <div class="chat_all">
      <div class="chat_body"   :style="{height: heightP + 'rpx', width: '100%'}">
        <view :style="{width: (windowWidth - 10)*2 +'rpx', overflow: 'hidden'}">
        <scroll-view class="my_list" 
          id="page" 
          :style='{height: (windowHeight - 120)*2+"rpx",width: windowWidth*2 + "rpx"}' 
          scroll-y="true" 
          :scroll-top="0" 
          @scroll="scroll"
          @touchstart='touchStart'
          @touchend='touchEnd'
          @touchmove='touchMove'
          :scroll-into-view="total"
        >

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
          <div v-for="(num, i) in content" :key="i"  :id="'item'+(i+1)">
            <div  class="chat_image" v-if="num.creatorId==id">
              <div>
                <image class="home_img" 
                :src="num.creator.headImg">
                </image>
              </div>
              <div class="bubble_diailog size_1">
                <i class="l"></i>
                <b class="l"></b>
                <div class="text">
                  <span>{{num.content}}</span>
                  
                </div>
              </div>
            </div>
            <div  class="chat_image" style="float: right" v-else>
              
              <div class="bubble_diailog right_bubble size_1">
                <i class="r"></i>
                <b class="r"></b>
                <div class="text">
                  <span v-if="num.type=='text'">{{num.content}}</span>
                  <image v-else class="chat_photo" :src="path"></image>
                </div>
              </div>
              <div>
                <image class="home_imgr" 
                :src="num.creator.headImg">
                </image>
              </div>
            </div>
            <div style="clear: both; height: 50rpx"></div>
          </div>
        </scroll-view>
        </view>
      </div>
       <div class="chat_footer">
          <div class="l-custom-input">
              <input size="large" id="l-input" 
              type="text"
              v-model="msg"
              @input="inputMsg"
              confirm-type='发送'
              @confirm="sendMsgTap"
              cursor-spacing="20"
              />
              <div class="l-button">
                <van-uploader @afterread="afterRead">
                  <van-icon name="photo-o" size="25px" style="margin: 18rpx 20rpx 0px 20rpx"/>
                </van-uploader>
                
                <van-button size="small" round @tap="sendMessage($event)">发送</van-button>
              </div>
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
let that1 = this;
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
        content: [],
        total: "item9",
        heightP: "",
        id: "",
        freshStatus: 'more', // 当前刷新的状态
        showRefresh: false,   // 是否显示下拉刷新组件
        msg:"",
        num: 1,
        path: "",
        windowWidth: "",
        user: {},
        scrollTop: 5,//控制上滑距离
        windowHeight: 0,//页面高度
        files: [],
        myInterval: ""
      }
    },
    onLoad(option) {
      this.heightP = (this.globalData.windowHeight - 80)*2;
      this.windowHeight = this.globalData.windowHeight
      this.windowWidth = this.globalData.windowWidth
      this.id = option.id
      let _this = this
      let a = new Promise((resolve, reject) => {
        this.$http.get(`/app/chat/session?pageIndex=1&pageSize=10&receiverId=${option.id}`, res => {
          let arr = [].concat(res.data.data)
          this.content = this.ascTime(arr)
          resolve()
        })
      }) 
      a.then(() => {
        console.log(this.content,"content")
        _this.$mp.page.setData({
          total: 'item'+(this.content.length)
        })
        _this.total = _this.$mp.page.data.total
        console.log(_this.$mp.page.data.total)
        console.log(_this.total)
        // this.toBottom()
      })
    },
    mounted () {
     
     this.user = this.globalData.userInfo
     this.initList()
     
    },
    destroyed(){
      
    },
    onUnload() {
      this.num = 1
      clearInterval(this.myInterval)
    },
    onShow() {
      this.total = 'item1'
      this.toBottom()
    },
    onReady: function() {
      this.total = 'item1'
      this.toBottom()
    },
 

    methods: {
      ascTime(arr) {
        arr.sort(function(a, b) {
          return b.createTime < a.createTime ? 1 : -1
        })
        return arr
      },
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
            this.num++
              this.getData(this.num); // 获取最新列表数据
          // }, 500);
        } else {
          this.showRefresh = false
        }
      },
      scroll (e) {
        this.scrollTop = -1
        // this.scrollTop = e.mp.detail.scrollTop
      },
      initList () {
        let that = this
        this.myInterval = setInterval(() => {
          this.$http.get(`/app/chat/session?pageIndex=1&pageSize=10&receiverId=${that.id}`, res => {
            if(res.data.success) {
              let arr = res.data.data
              let flag = false
              arr.forEach((num, i) => {
                let len = this.content.length - 1 
                let a = this.content[len].id
                if(a == num.id) {
                  flag = true
                  let b = arr.slice(0, i)
                  this.content.push(...b)
                }
              })
              if(!flag) {
                this.content.push(...arr)
              }
               this.toBottom()
            }
          })
        }, 6000);
      },
      getData(num) {
        if(this.showRefresh == true) {
          this.freshStatus = 'fresh'
        }
        let that = this
        this.$http.get(`/app/chat/session?pageIndex=${num}&pageSize=10&receiverId=${that.id}`, res => {
          
          let a = new Promise ((resolve, reject) => {
            setTimeout(() => {
              that.showRefresh = false
              resolve()
            },1000)
          })
          a.then(() => {
            if(res.data.success) {
              let arr = res.data.data
              let flag = false
              arr.forEach((num, i) => {
                let a = this.content[0].id
                if(a == num.id) {
                  flag = true
                  let b = arr.slice(i)
                  this.content.unshift(...b)
                }
                
              })
              if(!flag) {
                 let len = this.content.length-1
                 this.content.unshift(...arr)
              }
            }
          })
        })
      },
      toBottom() {
        this.total = 'item' + (this.content.length)
        console.log(this.total)
        // let that1 = this
        // wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
        //   console.log(rect.bottom)
        //    that1.scrollTop = rect.bottom + 200
        // }).exec();
      },
      shuaxin() {
        this.$http.get(`/app/chat/session?pageIndex=1&pageSize=10&receiverId=${this.id}`, res => {
            if(res.data.success) {
              let arr = res.data.data
              let flag = false
              arr.forEach((num, i) => {
                let len = this.content.length - 1
                // if(this.content[len].id != undefined) {
                    let a = this.content[len].id
                    if(a == num.id) {
                      console.log("445")
                      flag = true
                      let b = arr.slice(0, i)
                      this.content.push(...this.ascTime(b))
                    }
                // }
               
              })
              if(!flag) {
                this.content.push(...arr)
              }
              console.log(this.content)
               this.toBottom()
            }
          })
      },
      sendMessage(e,value) {
        let that1 = this
        // return
      //   wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
      //     console.log("react", rect)
      // // 使页面滚动到底部
      //      that1.scrollTop = rect.bottom
      //         // wx.pageScrollTo({
      //         //   scrollTop: rect.bottom+5000
      //         // })
      //   }).exec();
        // return
        let val = value || this.msg
        let that = this
        let userId = wx.getStorageSync('id')
        this.$http.post('/app/chat/send',{
          content: val,
          receiverId: this.id,
          type: 'text'
        }, res => {
          if(res.data.success) {
            this.shuaxin()
            this.msg = ""
          }
        })
      },
      inputMsg(e) {
        this.msg = e.mp.detail.value
      },
      sendMsgTap(e) {
        this.sendMessage(e.mp.detail.value)
        console.log(e.mp.detail.value)
      },
      afterRead(e) {
        let { file } = e.mp.detail
        let url = file.path
        this.path = url
        let type = file.path.split('.')
        let name = e.mp.detail.index + 'tupianMesssage' + '.' + type[type.length - 1]
        console.log(name)
       this.urlTobase64(file.path, name)
        // console.log()
      },
      urlTobase64(url, name){
        wx.request({
          url:url,
          responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
          success:res=>{
            //把arraybuffer转成base64
                let base64 = wx.arrayBufferToBase64(res.data); 
                
                //不加上这串字符，在页面无法显示的哦
                base64　= 'data:image/jpeg;base64,' + base64　
                this.$http.post('/app/file/upload/base64', {
                  fileName: name,
                  base64Content: base64
                }, res => {
                  console.log(res)
                  if(res.data.success) {
                    let userId = wx.getStorageSync('id')
                    this.files.push(res.data.data)
                    this.$http.post('/app/chat/send',{
                      content: this.files[0],
                      receiverId: userId,
                      type: 'image'
                    }, res => {
                      if(res.data.success) {
                        this.content.push({
                          creatorId: this.id,
                          creator: {
                            headImg: this.user.avatarUrl
                          },
                          content: this.files[0],
                          type: 'image'
                        })
                      }
                    })
                    // this.content.push({
                    //   creatorId: this.id,
                    //   creator: {
                    //     headImg: this.user.avatarUrl
                    //   },
                    //   content: this.files[0],
                    //   type: 'image'
                    // })
                  }
                })
                console.log(this.files)
                // /app/file/upload/base64
                //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢　
              }
        })
      },
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
    /* bottom: 80rpx; */
    background: #f9f9f9;
    position: relative;
    display: inline-block;
  }
  .chat_all {
    height: auto;
    position: relative;
    display: inline-block;
    width: 100%;
    background: #f9f9f9;
  }
  .chat_body {
    height: 100%;
    width: 100%;
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