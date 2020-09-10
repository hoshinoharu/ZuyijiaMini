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
                       v-model="room.title" placeholder="请输入房源地址"
                       size="25"
                       maxlength="20"
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
                      <label for="month">租期 /月</label><br>
                      <input id="month" type="text" name="" 
                      v-model="room.liveDuration" 
                      placeholder="请输入房源租期"
                      placeholder-style="color:#e2e2e2; font-size: 28rpx"
                      maxlength="6" /><br>
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
                :mutiple="true"
                max-count="8"
                :deletable="true"
                @delete="deleteImg"
                @afterread="afterRead" />
                <div class="button">
                  <button type="button" class="bt_connect" @tap="checkForm(this)" style="float: left">发布</button>
                  <button type="button" class="bt_connect"  @tap.stop="resetRoom()" style="float: right">重置</button>
                </div>
              </div>
              
          </form>
      </div>
    </div>
    <van-action-sheet :show="show" title="房源标识位选择" @close.stop="cancel">
       <van-picker show-toolbar :columns="columns" @cancel="onCancel" @change="onChange"  @confirm="onConfirm"/>
    </van-action-sheet>
    <span v-show="show1"></span>
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
          description: ""
        },
        show1: false,
        fileList: [],
        files: [],
        show: false,
        multiIndex: "",
        columns: ['WIFI', '洗衣机', '冰箱', '煤气', '热水器']
      }
    },
    onLoad() {
      this.resetRoom()
    },
    methods: {
      onInputMonth(e) {
        this.$set(this.room, 'priceEachMonth', e.target.value.replace(/[^\d]/g,''))
        console.log(this.room.priceEachMonth)
        this.show1 = !this.show1
        },
      checkForm (val) {
        console.log(this.room)
        try {
          Object.keys(this.room).every(num => {
            if(this.room[num] == '' || this.room[num] == []) {
              wx.showToast({
                  title: '请完善房源信息',
                  icon: 'none',
                  mask:true,
                  duration: 2000
                })
              throw('循环终止')
            }
          })
        } catch(e) {
          console.log('e: ', e)
          return
        }
        
        
        this.$http.post('/app/house/add', {
          title: this.room.title,
          description: this.room.description,
          priceEachMonth: this.room.priceEachMonth,
          liveDuration: this.room.liveDuration,
          tags: JSON.stringify(this.room.type),
          imgUrls: JSON.stringify(this.files),
          type: "sublet"
        }, res=> {
          console.log(res)
          wx.navigateBack({ changed: true });
        })
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
        console.log(this.room)
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
        const { file } = event.mp.detail;
        let type = file.path.split('.')
        let name = event.mp.detail.index + 'tupian' + '.' + type[type.length - 1]
        console.log(name)
        this.fileList.push(
           { url: file.path, name: '图片2'},
        )
       this.urlTobase64(file.path, name)
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