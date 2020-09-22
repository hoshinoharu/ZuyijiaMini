<template>
  <div>
    <Top :back="back"></Top>

    <div class="message">

      <div>
        <!-- <van-search
          :value="value"
          label="联系人"
          placeholder="请输入搜索关键词"
          use-action-slot
          @change="onChange"
          shape="round"
          @search="onSearch"
        >
          <view slot="action" @tap="onClick">
            <van-button size="small"  round class="search_but">搜索</van-button>
          </view>
        </van-search> -->
      </div>
      <div class="modify">
        <span class="modify_title" v-if="modifyShow" @tap="allModify" >
          编辑    
        </span>
        <span class="modify_title" v-else @tap="allFinish">完成</span>
        <div style="float: right; margin-right: 20rpx" v-show="!modifyShow">
          <van-checkbox :value="checked" @change="modify" >全选</van-checkbox>
        </div>
        
      </div>
      <div class="message_body">
        
        <van-checkbox-group :value="result" @change="onChange">
          <scroll-view class="my_list" id="page"
            @touchstart='touchStart'
            @touchend='touchEnd'
            @touchmove='touchMove'
            :style='{height: (windowHeight - 120)+"rpx"}' scroll-y="true" :scroll-top="scrollTop"
            @scroll="scroll" @scrolltoupper="refresh">
          <view v-if="showRefresh" style='width:100%;position:relative;padding:30rpx 0; fontSize: 30rpx'>
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
          <van-swipe-cell
            v-for="(num, index) in dataInfo"
            :key="index"
            id="swipe-cell"
            :right-width="120"
            async-close
            @close="onClose"
          >
          <!-- async-close -->
            <!-- <div slot="left">选择</div> -->
            <van-cell-group>
              <!-- :title="'复选框'+index" -->
              <van-cell
                @click="turnDataInfo($event, num)"
                value-class="value-class"
                clickable
                :data-index="index"
                
              >
                <!-- @click="toggle" -->
                <div class="mess_info" slot="title" v-if="id != num.creatorId">
                  <image class="home_img" :src="num.creator.headImg" alt="">
                    <i class="tip" v-if="num.status == 'unread'"></i>
                  </image>
                    <div class="mess_name">
                      <span>{{num.creator.username}}</span><br>
                      <span v-if="num.type=='text'">{{num.content}}</span>
                      <span v-else>图片</span>
                    </div>
                </div>
                <div class="mess_info" slot="title" v-else>
                  <image class="home_img" :src="num.receiver.headImg" alt="">
                    <i class="tip" v-if="num.status == 'unread'"></i>
                  </image>
                    <div class="mess_name">
                      <span>{{num.receiver.username}}</span><br>
                      <span v-if="num.type=='text'">{{num.content}}</span>
                      <span v-else>图片</span>
                    </div>
                </div>
                <div slot="right-icon" class="rightArea">
                  <div>
                    <van-checkbox
                      v-if="!modifyShow"
                      @tap.stop="noop"
                      :class="'checkboxes-'+index"
                      :name="num.id"
                    />
                  </div>
                  <div class="time_right">
                    <span>{{num.createTimeStr}}</span>
                  </div>
                </div>
                
              </van-cell>
              <!-- class="checkboxes-{{ index }}" -->
              <!-- <van-cell title="单元格" value="内容" /> -->
            </van-cell-group>
            <!-- <view slot="right">删除</view> -->
            <span slot="right">
              <view   @tap="onDelete($event, num.id)">删除</view>
              <view   style="background:#9F9F9F" @tap="onRead($event, num)">标为已读</view>
            </span>
          </van-swipe-cell>
          </scroll-view>
        </van-checkbox-group>
      </div>
      <div class="message_empty" :style="{height: he+'rpx'}">

      </div>
      <div class="button_footer" v-if="!modifyShow">
        <van-goods-action>
          <!-- <van-goods-action-icon icon="chat-o" text="客服" bind:click="onClickIcon" />
          <van-goods-action-icon icon="cart-o" text="购物车" bind:click="onClickIcon" /> -->
          <van-goods-action-button
            text="清除未读"
            type="warning"
            @click="onShread"
          />
          <van-goods-action-button text="删除" bind:click="onShdelete" />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import Top from '../../components/head/index'
// import refresh from '../../components/refresh/index'
import fun from '../../utils/index'
// import dataInfo from './dataInfo'
  export default {
    name: '',
    components: {
      Top,
      // refreshView: refresh
    },
    data() {
      return {
        value: "",
        checked: false,
        modifyShow: true,
         freshStatus: 'more', // 当前刷新的状态
        showRefresh: false,   // 是否显示下拉刷新组件
        result: [],
        he: 20,
        content: [],
        dataInfo: [],
        // dataInfo,
        back: {
          text: '消息列表',
          flag: 'true'
        },
        windowHeight: 0,
        scrollTop: 20,
        id: ""
      }
    },
    mounted () {
    },
    onLoad() {
      this.windowHeight = this.globalData.windowHeight
      this.$http.get('/app/chat/list/all/user', res => {
        if(res.data.success) {
          // this.dataInfo = res.data.data
          this.dataInfo = []
          let id = wx.getStorageSync("id")
          this.id = wx.getStorageSync("id")
          res.data.data.forEach(num => {
            if(num.receiverId != num.creatorId) {
              this.dataInfo.push(num)
            }
          })
          this.dataInfo.forEach(num => {
            num.createTimeStr = fun.getTimeInfo(num.createTimeStr)
            this.content.push(String(num.id))
          })
        }
        console.log(res.data.success)
      })
    },
    onShow() {
      this.$http.get('/app/chat/list/all/user', res => {
        if(res.data.success) {
          let id = wx.getStorageSync("id")
          this.dataInfo = []
          res.data.data.forEach(num => {
            if(num.receiverId != num.creatorId) {
              this.dataInfo.push(num)
            }
          })
          this.dataInfo.forEach(num => {
            num.createTimeStr = fun.getTimeInfo(num.createTimeStr)
            this.content.push(String(num.id))
          })
          this.modifyShow  = true
          this.result = []
        }
        console.log(res.data.success)
      })
    },
    onPullDownRefresh: function() { 
      // this.loadData()
     wx.showNavigationBarLoading(); 
     this.$http.get('/app/chat/list/all/user', res=> {
          console.log(res)
          setTimeout(() => {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          }, 1000)
          
          if(res.data.success) {
            this.dataInfo = []
          this.dataInfo = res.data.data
          this.dataInfo.forEach(num => {
            num.createTimeStr = fun.getTimeInfo(num.createTimeStr)
            this.content.push(String(num.id))
          })
        }
      })
    },
    methods: {
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
        // })
        // this.setData({
        //   showRefresh: true
        // }, () => {
        //   if (dis > 50) {
        //     this.setData({
        //       freshStatus: 'end'
        //     })
        //   } else {
        //     this.setData({
        //       freshStatus: 'more'
        //     })
        //   }
        // })
      } else {
        this.showRefresh = false
      }
    },
    // 触摸结束
    touchEnd(e) {
      if (this.freshStatus == 'end') {
        // 延迟 500 毫秒，显示 “刷新中”，防止请求速度过快不显示
        // setTimeout(()=>{
            this.getData(); // 获取最新列表数据
        // }, 500);
      } else {
        this.showRefresh = false
      }
    },
    getData() {
      if(this.showRefresh == true) {
          this.freshStatus = 'fresh'
        }
      this.$http.get('/app/chat/list/all/user', res => {
        if(res.data.success) {
          setTimeout(() => {
            this.showRefresh = false
          }, 1000)
          this.dataInfo = []
          let id = wx.getStorageSync("id")
          res.data.data.forEach(num => {
            if(num.receiverId != num.creatorId) {
              this.dataInfo.push(num)
            }
          })
          this.dataInfo.forEach(num => {
            num.createTimeStr = fun.getTimeInfo(num.createTimeStr)
            this.content.push(String(num.id))
          })
        }
        console.log(res.data.success)
      })
    },
      onShread(e, num) {
        
        console.log(this.result)
        // return
        this.$http.put('/app/chat/read/all', JSON.stringify(this.result), res => {
          console.log(res)
          wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',
                // icon: 'none',
                mask:true,   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
          this.getData()
        })
      },
      onShdelete(e, num) {
        this.$http.delete('/app/house/delete/all', JSON.stringify(this.result), 
        res => {
          wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',
                // icon: 'none',
                mask:true,   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
          this.getData()
        })
      },
      turnDataInfo(e, num) {
        let userId = wx.getStorageSync('id')
        let sendId = ""
        console.log(userId,'id',num.creatorId,'num.creatorId',num.receiverId,'num.receiverId')
        if(userId == num.creatorId) {
          sendId = num.receiverId
        } else{
          sendId = num.creatorId
        }
         wx.navigateTo({
          url: '/pages/detailInfo/main?id='+sendId,
          success: function(res) {
        
          }})
      },
      onRead(e, num) {
        let userId = wx.getStorageSync('id')
        let sendId = ""
        console.log(userId,'id',num.creatorId,'num.creatorId',num.receiverId,'num.receiverId')
        if(userId == num.creatorId) {
          sendId = num.receiverId
        } else if(userId == num.receiverId){
          sendId = num.creatorId
        }
        console.log(sendId)
        this.$http.put(`/app/chat/read/user/${sendId}`, res => {
          console.log(res)
          if(res.data.success) {
            this.$http.get('/app/chat/list/all/user', res => {
              if(res.data.success) {
                this.dataInfo = [] 
                let id = wx.getStorageSync("id")
                res.data.data.forEach(num => {
                  if(num.receiverId != num.creatorId) {
                    this.dataInfo.push(num)
                  }
                 })
                this.dataInfo.forEach(num => {
                  num.createTimeStr = fun.getTimeInfo(num.createTimeStr)
                  this.content.push(String(num.id))
                })
              }
              console.log(res.data.success)
            })
          }
        })
      },
      onDelete(e, id) {
        this.$http.delete('/app/house/delete',{
          id: id
        }, res => {
          wx.showToast({
            title: res.data.msg,  // 标题
            icon: 'success',
            // icon: 'none',
            mask:true,   // 图标类型，默认success
            duration: 1500   // 提示窗停留时间，默认1500ms
          })
        })
      },
      allModify() {
        this.he = 80
        this.modifyShow = false;
        this.checked = false;
      },
      allFinish() {
        this.modifyShow = true
      },
      noop(e) {
      },
      modify(e) {
        this.checked = !this.checked
        if(this.checked) {
          this.dataInfo.forEach(num => {
            
            this.result = this.result.concat(String(num.id))
            // num.modelId
          })
        } else {
          this.result = []
        }
        
        console.log(this.result)
      },
      onClick() {},
      onChange(e) {
        this.result = []
        this.result = e.mp.detail

        if(this.result.sort().toString() == this.content.sort().toString()) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      toggle(event) {
        const { index } = event.currentTarget.dataset;
        return
        checkbox.toggle();
        
        // this.result.push()
      },
      onClose(event) {
        const { position, instance } = event.mp.detail;
        console.log(position, instance, "Dd")
        switch (position) {
          case 'left':
          case 'cell':
            instance.close();
            break;
          case 'right':
            // Dialog.confirm({
            //   message: '确定删除吗？',
            // }).then(() => {
              instance.close();
            // });
            break;
        }
      },
    }
  }
</script>

<style>
.message {
  background: #fafafa;
}
.message_empty {
  position: relative;
  
  clear: both;
}
.message .mess_name {
  /* float: right; */
  position: relative;
  left: 100rpx;
  bottom: 100%;
  width:420rpx;/*要显示文字的宽度*/
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  /* right: 200rpx; */
  /* overflow:hidden;
  text-overflow:ellipsis */
}
.message .van-cell-group {
  margin-top: 0px;
}
.message .van-swipe-cell__right {
  display: inline-block;
  width: 240rpx;
  height: 140rpx;
  font-size: 22rpx;
  line-height: 140rpx;
  /* color: #fff;
  text-align: center; */
  /* background-color: #f44; */
}
.message .van-swipe-cell__right view {
  display: inline-block;
  width:120rpx;
  background-color: #f44;
  height: 140rpx;
  font-size: 24rpx;
  line-height: 140rpx;
  color: #fff;
  float: right;
  text-align: center;
}
.message .home_img{
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  /* margin: 100rpx 0; */
  border: 1px solid #bbb;
}
.message .mess_info{
  width: auto;
  height: 100rpx;
  position: relative;
}
.message .van-search__action--hover {
  background: #fff !important;
}
.message .search_but .van-button {
  width: 60rpx;
  height: 60rpx;
}
.message .value-class {
  flex: none !important;
}
.message .modify {
  margin: 10rpx 10rpx;
  padding-top: 10rpx;
}
.message .modify .van-checkbox__label {
  margin-left: 10rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #bbb;
}
.message .modify_title {
  margin-left: 30rpx;
  font-size: 28rpx;
}
.message .modify_hover {
  font-size: 30rpx;
  color: aqua;
}
.message .button_footer .van-goods-action{
  margin-bottom: 20rpx;
}
.message .message_body {
  position: relative;
  height: auto;
  overflow: hidden;
  overflow-y: scroll;
}
.message .rightArea {
  display: flex;
  align-items: center;
  flex-direction:column
}
.message .time_right {
  width: 153rpx;
  text-align: center;
  }
 .message .tip {
    display:block;
    background:#f00;
    border-radius:50%;
    width:12rpx;
    height:12rpx;
    top:0px;
    left: 80rpx;
    position:absolute;
  }
 .message .lzy-loading{
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
.message .flex {
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