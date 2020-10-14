<template>
  <div class="chat_all">
    <Top :back="back" ></Top>
    <div class="chat">

    <div class="chat_all">
      <div class="chat_body"   :style="{height: heightP + 'rpx', width: '100%'}">
        <div style="height: 40rpx; width: 100%; font-size: 26rpx; lineHeight: 40rpx;background: #FF5151; color: #fff;text-align:center">
注意：以扫二维码/链接/去微信转账等形式让你转钱的都是骗子
        </div>
        <view :style="{width: (windowWidth - 30) +'rpx', overflow: 'hidden'}">
        <scroll-view class="my_list"
          id="page"
          :style='{height: (windowHeight - 120 - bottomM)+"rpx",width: windowWidth + "rpx"}'
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
                  <span v-if="num.type=='text'">{{num.content}}</span>
                  <image v-else-if="num.type=='image'" class="chat_photo" :src="'https://www.zuyijia.cn:9443/app'+num.content" @tap.stop="onPreview($event, num.content)"></image>
                  <div v-else-if="num.type=='position'" class="chat_position">
                     <span>{{num.contentObj.address}}</span>
                     <image  class="chat_map" src="../../static/images/ma.png" @tap="bindLocation($event,num.contentObj)"></image>
                  </div>

                </div>
              </div>
            </div>
            <div  class="chat_image" style="float: right" v-else>

              <div class="bubble_diailog right_bubble size_1">
                <i class="r"></i>
                <b class="r"></b>
                <div class="text">
                  <span v-if="num.type=='text'">{{num.content}}</span>
                  <image v-else-if="num.type=='image'" class="chat_photo" :src="'https://www.zuyijia.cn:9443/app'+num.content" @tap.stop="onPreview($event, num.content)"></image>
                  <div v-else-if="num.type=='position'" class="chat_position">
                     <span>{{num.contentObj.address}}</span>
                     <image  class="chat_map" src="../../static/images/ma.png" @tap="bindLocation($event,num.contentObj)"></image>
                  </div>
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
       <div class="chat_footer" :style="{bottom: bottomM + 'rpx'}">
          <div class="l-custom-input">
            <div class="map">
               <van-icon name="location-o" size="20px"  style="padding: 0 6px" @tap="onMap" />
               <van-icon name="chat-o" size="20px"  @tap="onShow" style="padding: 0 0 0 1px" />
            </div>
              <input size="large" id="l-input"
                type="text"
                v-model="msg"
                @input="inputMsg"
                confirm-type='发送'
                @confirm="sendMsgTap"
                cursor-spacing="20"
                />
              <div class="l-button">
                <van-uploader @afterread="afterRead"  multiple="true">
                  <van-icon name="photo-o" size="25px" multiple style="margin: 18rpx 20rpx 0px 20rpx"/>
                </van-uploader>

                <van-button size="small" round @tap="sendMessage($event)">发送</van-button>
              </div>
          </div>
       </div>
      </div>
      <van-action-sheet :show="showMessage" :overlay="false" title="快捷回复" class="leave_message" @close="onClose">
        <div class="message">
          <div class="message1">
            <van-picker show-toolbar :columns="columns" @change="onChange"  @cancel="onCancel"
             @confirm="onConfirm" />
            <!-- <input type=""> -->
            <!-- <van-button size="small" round>提交</van-button> -->

          </div>

        </div>
      </van-action-sheet>
    </div>
    <!-- <van-action-sheet :show="false" title="留言板" class="leave_message" @close="onClose">
      <div class="message">
        <div>
          <input type="">
          <van-button size="small" round>提交</van-button>

        </div>

      </div>
    </van-action-sheet> -->
    <!-- <van-overlay :show="warningShow" @click="onClickWarning">
       <image :src="bigPath" alt="" class="bmg"></image>
       <van-image
          :width="windowWidth"
          height="90%"
          fit="contain"
          class="bmg"
          :src="bigPath + '?quality=1'"
        />
    </van-overlay> -->
    <canvas id="myCanvas" type="2d"
    :style="{width:canvasWidth + 'px',height:
    canvasHeight + 'px',position:'fixed',top:'-9999px',left:'-9999px'}">
    </canvas>
    <!-- <block v-if="resultData[k].address != 'undefined'">
      <text class="address" @tap="bindLocation" :data-address="resultData[k].address"
      :data-name="resultData[k].name"
      :data-longitude="resultData[k].longitude"
      :data-latitude="resultData[k].latitude">{{resultData[k].addressAll}}</text>
    </block> -->
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
        columns: ['有中介服务费吗？', '请问房子在几层？', '请问水电民用还是商用？', '请问房子还在吗？'],
        total: "item9",
        heightP: "",
        id: "",
        fileUpload: [],
        showMessage: false,
        home_pics: [],
        warningShow: false,
        freshStatus: 'more', // 当前刷新的状态
        showRefresh: false,   // 是否显示下拉刷新组件
        msg:"",
        num: 1,
        canvasWidth: "",
        canvasHeight: "",
        path: "",
        bigPath: "",
        windowWidth: "",
        user: {},
        scrollTop: 5,//控制上滑距离
        windowHeight: 0,//页面高度
        files: [],
        myInterval: "",
        bottomM: 0,
        addressData: "",
        addressAll: "",
        type: ""
      }
    },
    onLoad(option) {
      this.heightP = (this.globalData.windowHeight - 80)
      this.windowHeight = this.globalData.windowHeight
      this.windowWidth = this.globalData.windowWidth
      this.id = option.id
      let _this = this
      let a = new Promise((resolve, reject) => {
        this.$http.get(`/app/chat/session?pageIndex=1&pageSize=10&receiverId=${option.id}`, res => {
          let arr = [].concat(res.data.data)
          this.content = this.ascTime(arr)
          this.content.forEach(num => {
            if(num.type == 'image') {
              this.home_pics.push('https://www.zuyijia.cn:9443/app'+num.content + '?quality=1')
            }
          })
          resolve()
        })
      })
      a.then(() => {
        console.log(this.content,"content")
        _this.$mp.page.setData({
          total: 'item'+(this.content.length)
        })
        _this.total = _this.$mp.page.data.total
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

    onReady: function() {
      this.total = 'item1'
      this.toBottom()
    },

    methods: {
      bindLocation(e, num) {// 点击地址，查看位置
      // console.log(num)
      // return
        wx.openLocation({
          latitude: num.arr.latitude,
          longitude: num.arr.longitude,
          name: num.arr.name,
          address: num.arr.address
        })
      },
      onMap() {
        let that = this
         wx.chooseLocation({   // ①.利用微信选择位置API，获得经纬度信息
          success: function (lb) {
            that.addressData = lb
            console.log(that.addressData,"that.addressData")
            wx.request({ // ②百度地图API，将微信获得的经纬度传给百度，获得城市等信息
              url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=UNrOozLxSIPT9tHTA6hMzKmKugTFIlPu&location=' + lb.latitude + ',' + lb.longitude + '&output=json&coordtype=wgs84ll',
              data: {},
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log(res.data.result);
                console.log(res.data.result.addressComponent.city + res.data.result.addressComponent.district);
                // that.setData({
                that.addressAll = res.data.result.addressComponent.city + res.data.result.addressComponent.district + "·" + lb.name //③.我们将微信得到的位置名称“故宫博物馆”与百度地图API得到的“北京市东城区”合并显示在页面上。
                that.setAddress(that.addressAll, that.addressData)
                // that.msg =
                // })
              },
              fail: function () {
                // fail
              },
              complete: function () {
                // complete
              }
            })
          },
          cancel: function (lb) {
          },
          fail: function (lb) {
            console.log(lb)
          }
        })
      },
      onChange(){

      },
      onConfirm(event) {
        console.log(event.mp)
        this.msg = event.mp.detail.value
          this.sendMessage(null, this.msg)
      },
      onCancel() {
        this.bottomM = 0
        this.showMessage = false
      },
       onShow() {
          console.log("Sds")
          this.showMessage = true
          this.bottomM = 490
        },
      onBlur(){
        this.bottomM = 0
        this.showMessage = false
      },
      onClose() {
        this.showMessage = false
        this.bottomM = 0
      },
      previewImage: function (path) {
          let urls = this.content.filter(msg=>{return msg.type == 'image'})
              .map(msg=>{return 'https://www.zuyijia.cn:9443/app'+msg.content + '?quality=1'});
        wx.previewImage({
              current: path, // 当前显示图片的http链接
              urls: urls, // 默认显示一张图片
              // urls: this.home_pics // 需要预览的图片http链接列表
        })
      },
      canvas(path, name) {
        wx.getSystemInfo({
          success: res => {
              let windowWidth = res.windowWidth;
              // 获取图片信息
              wx.getImageInfo({
                  src: path,
                  success: res => {
                      // 比例
                      var scale = 1;
                      // 宽
                      let imgWidth = res.width * scale;
                      // 高
                      let imgHeight = res.height * scale;
                      //设置canvas标签宽高
                      this.canvasWidth = imgWidth
                      this.canvasHeight = imgHeight
                      //获取canvas-----------------------------------------
                      const query = wx.createSelectorQuery();
                      query.select('#myCanvas').fields({
                          node: true,
                          size: true
                      }).exec(async res => {
                          const canvas = res[0].node;
                          canvas.width = imgWidth;
                          canvas.height = imgHeight;
                          //2d画布
                          const ctx = canvas.getContext('2d');
                          //创建图片
                          const mainImg = canvas.createImage();
                          console.log(path,"pathCanvas")
                          mainImg.src = path
                          const mainImgs = await new Promise((resolve, reject) => {
                              mainImg.onload = () => resolve(mainImg);
                              mainImg.onerror = (e) => reject(e);
                          });

                          // 绘制图像到画布
                          ctx.drawImage(mainImgs, 0, 0, imgWidth, imgHeight);
                          let imgx = canvas.toDataURL('image/jpeg', 1);
                          let base64 = imgx.replace('data:image/jpeg;base64,', "");
                          this.sendImg(imgx, name)
                          callBack(base64);
                      })
                  },
                  fail: err => {
                      console.log(err);
                      modal('获取图片信息失败，请稍后重试！');
                  }
              })
          }
      })

      },
      sendImg(file, name) {
        this.$http.post('/app/file/upload/base64', {
                  fileName: name,
                  base64Content: file
                }, res => {
                  if(res.data.success) {
                    let userId = wx.getStorageSync('id')
                    // this.files.push(res.data.data)
                    this.$http.post('/app/chat/send',{
                      content: res.data.data,
                      receiverId: this.id,
                      type: 'image'
                    }, res => {
                      if(res.data.success) {
                        this.shuaxin()
                      }
                    })
                  }
                }
        )
      },
      onPreview(e, path) {

        this.warningShow = true
        // this.bigPath = path
        if(path.indexOf('http') != 0) {
          this.bigPath = 'https://www.zuyijia.cn:9443/app' + path + '?quality=1'
          // this.home_pics.push(this.bigPath)
        } else {
          this.bigPath = path + '?quality=1'
        }
        this.previewImage(this.bigPath)
      },
      onClickWarning() {
        this.bagPath = ""
        this.warningShow = false
      },
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
            this.num = this.num + 1
            console.log("num",this.num)
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
              //  this.toBottom()
            }
          })
        }, 6000);
      },
      getData(num1) {
        if(this.showRefresh == true) {
          this.freshStatus = 'fresh'
        }
        let that = this
        this.$http.get(`/app/chat/session?pageIndex=${num1}&pageSize=10&receiverId=${that.id}`, res => {

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
              this.home_pics = []
               this.content.forEach(num => {
                  if(num.type == 'image') {
                    this.home_pics.push('https://www.zuyijia.cn:9443/app'+num.content + '?quality=1')
                  }
                })
              this.toBottom(res.data.data.length,"len")
            }
          })
        })
      },
      toBottom(type, len) {
        this.total = ""
        if(type||len == 'len') {
          console.log("type",type, this.content.length)
          let len = (this.num-1)*10
          if(type > 1) {
            len = len +1
          } else {
            len = len + type
          }
           this.total = 'item' + (this.content.length - len)

        } else {
          this.total = 'item' + (this.content.length)
        }

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
      setAddress(address, arr) {
        // this.msg = address
        this.type = "position"
        this.sendMap(address)
      },
      sendMap(address) {
        let a = {}
        a.address = address
        a.arr = this.addressData
        this.$http.post('/app/chat/send',{
          content: JSON.stringify(a),
          receiverId: this.id,
          contentIsObj: true,
          type: 'position'
        }, res => {
          if(res.data.success) {
            this.shuaxin()
            this.msg = ""
            this.type = ""
          }
        })
      },
      sendMessage(e, value) {
        console.log(e)
        if(this.type == 'position') {
          this.sendMap()
        } else {
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
              this.type = ""
            }
          })
        }
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
        this.fileUpload = []
        file.forEach((num, i) => {
          this.fileUpload[i] = num
        })

        if (this.fileUpload.length > 3) {
          wx.showToast({
                title: "图片一次性最多上传三张!",
                icon: 'none',
                mask:true,
                duration: 2000
              })
          // this.$toast.fail("图片一次性最多上传三张!");
          this.fileUpload.splice(3);
          return;
        }
        let url = file.path
        this.path = url

        for(let i in this.fileUpload) {
          let type = this.fileUpload[i].path.split('.')
          let name = e.mp.detail.index + 'tupianMesssage' + '.' + type[type.length - 1]
          this.canvas(this.fileUpload[i].path, name)
        }

        // console.log()
      },
    }
  }
</script>

<style scoped>
.bmg{
    width: 100%;
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 1001;
    margin: auto;
}
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
  .chat_position {
    max-width: 400rpx;
    word-wrap: break-word;
    word-break: break-all;

    border: 1rpx solid #fff;
    border-radius: 10rpx;
    margin: 7rpx 10rpx 0rpx 10rpx;
  }
  .chat_map {
    max-width: 380rpx;
    height: 200rpx;
    border-radius: 5px;
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
    width: calc(100% - 320rpx);
    display: block;
    padding: 12px 0px 2px 10px;
    font-size: 16px;
    background: none;
    color: #000;
    margin-left: 120rpx;
    text-indent: 0;
    border-bottom: 1px solid #e0e0e0;
     word-wrap: break-word;
    word-break: normal;
}
#l-input::before {
    outline: none;
    border-bottom: 1px solid #2196f3;
}
.map {
  position: absolute;
  bottom: 0px;
  width: 100rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.map .van-icon {
  padding: 0 8rpx !important;
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
  .container {
    box-sizing:border-box;
    padding:20px;
}
.previewimg{
    float:left;
    width:45%;
    height:200px;
    margin:2%;
}
.previewimg image{
    width:100%;
    height:100%;
}
.message {
  width: 100%;
  background: #fafafa;
  height: 400rpx;
}
.leave_message .van-action-sheet {
   height: 35%;
}

.van-overlay .van-overlay {

 height: 0px !important;
}
.message1 {
  height: 350rpx;
  overflow: hidden;

}
</style>
