<template>
  <div>
    <Top :back="back"></Top>
    <div>
      <div id="form1">
          <form action="" method="post" onsubmit="return checkForm(this)">
              <br>
              <div class="row ">
                  <div class="input">
                      <label for="title">标题</label>
                      <input id="title" type="text" name="p_cardid"
                       v-model="room.title" placeholder="请输入房源地址"
                       placeholder-style="color:#e2e2e2; font-size: 14px"/>
                      <i class="CardNo"><b></b></i>
                  </div>
              </div>
              <div class="row ">
                  <div class="input">
                      <label>房源描述</label><br>
                      <!-- <textarea  v-model="room.description" auto-height placeholder="自动变高" /><br> -->
                      <input type="textarea" name="" v-model="room.description" /><br>
                  </div>
              </div>
              <div class="row" @tap.stop="noop" @tap="typeShow">
                  <div class="select" >
                      <label>房源标识</label><br>
                      <span v-for="(num ,i) in room.type" :key="i">
                        {{num.value}}
                      </span>
                      <!-- <input id="p_tel" type="text" name="p_tel"/> -->
                      <br>
                  </div>
              </div>
              <div class="row">
                  <div class="input">
                      <label for="price">月租价格</label><br>
                      <input id="price" type="text" name="p_tel" v-model="room.priceEachMonth"/><br>
                      <i><b></b></i>
                  </div>
              </div>
              <div class="row">
                  <div class="input">
                      <label for="month">租期</label><br>
                      <input id="month" type="text" name="" v-model="room.liveDuration" /><br>
                  </div>
              </div>
              <div class="row_img clearfix">
                <div class="input van_img">
                    <label >房源图片</label>
                </div>
                
                <van-uploader 
                id="img"
                :file-list="fileList" 
                v-model="files"
                sizeType="60px"
                preview-size="60px"
                :mutiple="true"
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
       <van-picker show-toolbar :columns="columns" @change="onChange"  @confirm="onConfirm"/>
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
    data() {
      return {
        back: {
          flag: true,
          text: '房源短租'
        },
        room: {
          type: [
            {
              index: 0,
              value: ""
            }
          ]
        },
        fileList: [],
        files: [],
        show: false,
        multiIndex: "",
        columns: ['WIFI', '洗衣机', '冰箱', '煤气', '热水器']
      }
    },
    methods: {
      noop() {},
      cancel() {
        console.log("ss")
        this.show = false
      },
      typeShow () {
        this.show = true
      },
      resetRoom() {
        console.log(this.room)
        this.room = {
          type: []
        }
      },
      onConfirm(e) {
        console.log(e.mp.detail)
        // this.room.type = []
        // this.room.type.push(e.mp.detail) 
        this.room.type = this.room.type.concat(e.mp.detail)
        this.show =false
        console.log(this.room.type)
      },
      onChange(event) {
        console.log(event)
        const { picker, value, index } = event.mp.detail;
        console.log(value,index)
        // Toast(`当前值：${value}, 当前索引：${index}`);
      },
      beforeRead(e) {
        console.log("s")
      },
      deleteImg(e) {
        console.log(e.mp.detail.index)
        this.fileList.splice(e.mp.detail.index, 1)
      },
      urlTobase64(url){
        wx.request({
          url:url,
          responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
          success:res=>{
            //把arraybuffer转成base64
                let base64 = wx.arrayBufferToBase64(res.data); 
                
                //不加上这串字符，在页面无法显示的哦
                base64　= 'data:image/jpeg;base64,' + base64　
                
                //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
                console.log(base64)　
              }
        })
    },
      afterRead(event) {
        const { file } = event.mp.detail;
        this.fileList.push(
           { url: '../../../static/images/tupian5.png', name: '图片1' },
           { url: '../../../static/images/tupian5.png', name: '图片1' },
           { url: '../../../static/images/tupian5.png', name: '图片1' },
           { url: file.path, name: '图片2'},
        )
       this.urlTobase64(file.path)
       return
        // data.append('file', file);
        this.$http.post('/app/file/upload', data)
          .then((fileName) => {
            console.log(fileName)
            // this.headImg[0].url = fileName.data.data;
          })
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
    margin-top: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing:10rpx;
    text-indent: 10px;
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
   /* .row_img .van-uploader__upload {
    width: 60px !important;
    height: 60px !important;
    margin-top: 20px;
  }
  .row_img  .van-uploader__preview-image 
  {
    width: 60px !important;
    height: 60px !important;
    margin-top: 20px;
  } */
</style>