<template>
  <div>
    <Top :back="back"></Top>
    <div>
      <div id="form1">
          <form action="" method="post" onsubmit="return checkForm(this)">
              <br>
              <div class="row row_title">
                  <div class="input">
                      <label for="title">标题</label>
                      <input id="title" type="text" name="p_cardid"
                       v-model="room.title" placeholder="请输入房源标题"
                       size="25"
                       maxlength="20"
                       placeholder-style="color:#e2e2e2; font-size: 28rpx"/>
                      <i class="CardNo"><b></b></i>
                  </div>
              </div>
              <div class="row row_title">
                  <div class="input">
                      <label for="title">地理位置</label>
                      <input id="title" type="text" name="p_cardid"
                       v-model="address"
                       size="25"
                       maxlength="20"
                       disabled="true"
                       placeholder-style="color:#e2e2e2; font-size: 28rpx"/>
                      <i class="CardNo"><b></b></i>
                  </div>
              </div>
              <div class="row1">
                  <div class="input">
                      <label>房源描述</label><br>
                      <!-- <textarea  v-model="room.description" auto-height placeholder="自动变高" /><br> -->
                      <!-- <input type="textarea" name="" v-model="room.description" /><br> -->
                      <textarea
                        class="text"
                        placeholder="请详细描述房源信息"
                        placeholder-style="color:#e2e2e2; font-size: 28rpx"
                        v-model="room.description">
                      </textarea>
                  </div>
              </div>
              <div class="row" @tap.stop="noop" @tap="typeShow">
                  <div class="select" >
                      <label>房源标识</label><br>
                      <span v-for="(num ,i) in room.type" :key="i" style="color:#666">
                        {{num.value}}&nbsp;
                      </span>
                      <!-- <input id="p_tel" type="text" name="p_tel"/> -->
                      <br>
                  </div>
              </div>
              <div class="row"  @tap="typeShow1">
                  <div class="select" >
                      <label>押金方式</label><br>
                      <span style="color:#666">
                        {{room.payModeStr}}&nbsp;
                      </span>
                      <br>
                  </div>
              </div>
              <div class="row">
                  <div class="input">
                      <label for="price">月租价格 ￥/月</label><br>
                      <input id="price" type="text" name="p_tel"
                      v-model="room.priceEachMonth"
                      placeholder="请输入房源价格"
                      placeholder-style="color:#e2e2e2; font-size: 28rpx"
                      @input = "onInputMonth"
                      maxlength="11" /><br>
                  </div>
              </div>
              <div class="row">
                  <div class="input">
                      <label for="month" >租房时长</label><br>
                      <input id="month" type="text" name=""
                      v-model="room.liveDuration"
                      placeholder="请输入租房时长"
                      placeholder-style="color:#e2e2e2; font-size: 28rpx"
                      maxlength="12" /><br>
                  </div>
              </div>
              <div class="row2" >
                  <div class="input">
                      <label for="month">房东是否已授权</label><br>
                      <van-switch v-model="isAgree" @change="onCheckedFlag" />
                  </div>
              </div>
              <div class="row2" v-if="modifyId">
                  <div class="input">
                      <label for="month">房源状态 (已成交)</label><br>
                      <van-switch v-model="checked" @change="onChecked" />
                  </div>
              </div>
              
              <div class="row_img clearfix">
                <div class="input van_img">
                    <label >房源图片</label>
                </div>

                <van-uploader
                  id="img"
                  :file-list="fileList"
                  sizeType="60px"
                  preview-size="60px"
                  :multiple="true"
                  :max-count="8"
                  :deletable="true"
                  @delete="deleteImg"
                  @afterread="afterRead" />
                <div class="button">
                   <button type="button" class="bt_connect"  @tap.stop="resetRoom()" style="float: left">重置</button>
                  <button type="button" class="bt_connect" @tap="checkForm(this)" style="float: right">发布</button>

                </div>
              </div>

          </form>
      </div>
    </div>
    <van-action-sheet :show="show" title="房源标识位选择" @close.stop="cancel">
       <van-picker show-toolbar :columns="columns" @cancel="onCancel" @change="onChange"  @confirm="onConfirm"/>
    </van-action-sheet>
    <van-action-sheet :show="showStyle" title="押金方式" @close.stop="cancel1">
       <van-picker show-toolbar :columns="columnArr" @cancel="onCancel1" @change="onChange"  @confirm="onConfirm1"/>
    </van-action-sheet>
    <span v-show="show1"></span>
    <canvas id="myCanvas" type="2d" :style="{width:canvasWidth + 'px',height:
canvasHeight + 'px',position:'fixed',top:'-9999px',left:'-9999px'}"></canvas>
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
          flag: true,
          text: '房源转租'
        },
        room: {
          type: [],
          title: "",
          liveDuration: "",
          priceEachMonth: "",
          description: "",
          isAgree: false,
          payMode: "",
          payModeStr: ""
        },
        checked: false,
        show1: false,
        showStyle: false,
        isAgree: false,
        fileList: [],
        fileUpload: [],
        files: [],
        modifyId: "",
        address: "",
        show: false,
        canvasWidth: "",
        canvasHeight: "",
        multiIndex: "",
        columns: ['地铁站', '超市', '火车站', '购物广场', '学校', '菜市场'],
        columnArr: [
          {text:'押一付一',value: "oneToOne"},
          {text:'押一付三',value: "oneToThree"},
          {text:'押一付六',value: "oneToSix"},
          {text:'押一付十二',value: "oneToTwelve"}
          ]
      }
    },
    onLoad(option) {
      this.resetRoom()
      if(option.dataDetail) {
        let roomDetail = JSON.parse(decodeURIComponent(option.dataDetail))
        if(roomDetail.id) {
          this.modify(roomDetail)
          this.address = roomDetail.cityName+ "-"+ roomDetail.counName
          console.log(roomDetail,"room")
        } else {
          this.resetRoom()
        }
      } else {
        this.address = this.globalData.roomData.cityName+ "-"+this.globalData.roomData.counName
      }
    },
    mounted (){
      this.checked = ""
      
     
      this.isAgree = ""
      this.isAgree = this.room.isAgree
      if(this.room.status == 'persistent') {
        this.checked = false
      } else {
        this.checked = true
      }
    },
    methods: {
      cancel1() {
        this.showStyle = false
      },
      onCancel1() {
        this.showStyle = false
      },
       typeShow1() {
        this.showStyle = true
      },
       onConfirm1(e) {
        this.room.payMode = ""
        this.room.payMode = e.mp.detail.value.value
        this.room.payModeStr = e.mp.detail.value.text
        this.showStyle = false
      },
      onCheckedFlag() {
        this.isAgree = !this.isAgree
        this.room.isAgree = this.isAgree
      },
      onChecked(e) {
        this.checked = !this.checked
        if(this.checked == false) {
          this.room.status = 'persistent'
        } else{
          this.room.status = 'finished'
        }
      },
      modify(num) {
        this.room.title = num.title
        this.room.isAgree = num.isAgree
        // this.isAgree = ""
        this.isAgree = num.isAgree
        this.room.payModeStr = num.payModeStr
        this.room.payMode = num.payMode
        this.room.description = num.description
        this.modifyId = num.id
        this.room.type = JSON.parse(num.tags)
        this.room.priceEachMonth = num.priceEachMonth
        this.room.liveDuration = num.liveDuration
        let arr = JSON.parse(num.imgUrls)
        if(num.status == 'persistent') {
          this.checked = false
          this.room.status = 'persistent'
        }else {
          this.checked = true
          this.room.status = 'finished'
        }
        arr.forEach(num => {
          this.fileList.push({
            url: this.$url + num + '?quality=1',
            name: '图片2'
          })
          this.files.push(num)
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
          console.log(res)
          if(res.data.success) {
            this.files.push(res.data.data)
          }
        })
      },
      onInputMonth(e) {
        this.$set(this.room, 'priceEachMonth', e.target.value.replace(/[^\d]/g,''))
        console.log(this.room.priceEachMonth)
        this.show1 = !this.show1
        },
      checkForm (val) {
        if(this.room.title == "" || this.room.title == undefined) {
              wx.showToast({
                title: '房源标题不能为空',
                icon: 'none',
                mask:true,
                duration: 2000
              })
              return
        } else if(this.room.description == "" || this.room.description == undefined) {
              wx.showToast({
                title: '房源描述不能为空',
                icon: 'none',
                mask:true,
                duration: 2000
              })
              return
        } else if(this.room.type.length == 0 || this.room.type == undefined) {
              wx.showToast({
                title: '房源标识不能为空',
                icon: 'none',
                mask:true,
                duration: 2000
              })
              return
        } else if(this.room.liveDuration == "" || this.room.liveDuration == undefined) {
               wx.showToast({
                title: '房源租期不能为空',
                icon: 'none',
                mask:true,
                duration: 2000
              })
              return
        } else if(this.room.priceEachMonth == "" || this.room.priceEachMonth == undefined) {
              wx.showToast({
                title: '房源价格不能为空',
                icon: 'none',
                mask:true,
                duration: 2000
              })
              return
        }
        if(this.modifyId) {
          this.$http.put('/app/house/update', {
            ...this.room,
            id: this.modifyId,
            tags: JSON.stringify(this.room.type),
            imgUrls: JSON.stringify(this.files),
            type: "sublet"
          }, res=> {
            console.log(res)
            wx.navigateBack({ changed: true });
          })
        } else {
          let arr = Object.assign({}, this.globalData.roomData)
          if(arr.id) {
            delete arr.id
          }
          console.log(arr)
          this.$http.post('/app/house/add', {
            title: this.room.title,
            description: this.room.description,
            priceEachMonth: this.room.priceEachMonth,
            liveDuration: this.room.liveDuration,
            tags: JSON.stringify(this.room.type),
            isAgree: this.isAgree,
            payMode: this.room.payMode,
            payModeStr: this.room.payModeStr,
            imgUrls: JSON.stringify(this.files),
            type: "sublet",
            ...arr
          }, res=> {
            console.log(res)
            if(res.data.success) {
              wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  mask:true,
                  duration: 2000
                })
              wx.navigateBack({ changed: true });
            }else {
              wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  mask:true,
                  duration: 2000
                })
            }
          })
        }
      },
      noop() {},
      cancel() {
        console.log("ss")
        this.show = false
      },
      onCancel() {
        this.show = false
      },
      typeShow () {
        this.show = true
      },
      resetRoom() {
        this.isAgree = false
        this.checked = false
        this.address = ""
        this.modifyId = ""
        this.files = []
        this.fileList = []
        this.room = {
          type: []
        }
      },
      onConfirm(e) {
        console.log(e.mp.detail)
        console.log(this.room.type)
        let flag = false
        this.room.type.forEach(num => {
          if(num.value == e.mp.detail.value) {
            flag = true
          }
        })
        if(!flag) {
          this.room.type = this.room.type.concat(e.mp.detail)
            this.show =false
        }
      },
      onChange(event) {
        const { picker, value, index } = event.mp.detail;
      },
      beforeRead(e) {
        console.log("s")
      },
      deleteImg(e) {
        console.log(e.mp.detail.index)
        this.fileList.splice(e.mp.detail.index, 1)
        this.files.splice(e.mp.detail.index, 1)
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
                    this.files.push(res.data.data)
                  }
                })
                console.log(this.files)
                // /app/file/upload/base64
                //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢　
              }
        })
    },
      afterRead(event) {
        let { file } = event.mp.detail
        this.fileUpload = []
        file.forEach((num, i) => {
          this.fileUpload[i] = num,
          this.fileList.push(
           { url: num.path, name: '图片2'},
          )
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
        for(let i in this.fileUpload) {
          let type = this.fileUpload[i].path.split('.')
          let name = event.mp.detail.index + 'tupianMesssage' + '.' + type[type.length - 1]
          this.canvas(this.fileUpload[i].path, name)
        }
      },
    }
  }
</script>

<style>
  @import url('./index.css');
  .row_img {
    height: 80px;
    margin-top: 20px;
  }
  .van_img {
    margin-bottom: 20px;
  }
  .bt_connect{
    width: 200rpx;
    height: 70rpx;
    color: #6699FF;
    border: 3rpx solid #6699FF;
    border-radius: 80rpx;
    font-size: 35rpx;
    margin-top: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing:10rpx;
    text-indent: 10px;
  }
  .text {
    border: 2rpx solid #c7c6c6;
    border-radius:5px;
    background-color:rgba(255, 254, 254, 0.98);
    width: 100%;
    height: 80px;
    resize: none;
    color: #666;
  }
  .van-uploader__wrapper::after {
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .van-uploader__wrapper {
    zoom: 1;
  }
  .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .clearfix{
      zoom: 1;/*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
    }
    .row_title {
      margin-top: 10rpx;
    }
</style>
