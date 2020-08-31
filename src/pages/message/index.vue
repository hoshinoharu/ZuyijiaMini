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
          <van-swipe-cell
            v-for="(num, index) in dataInfo"
            :key="index"
            id="swipe-cell"
            :right-width="120"
            async-close
          >
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
                <div class="mess_info" slot="title">
                  <image class="home_img" :src="num.creator.headImg" alt="">
                    <i class="tip" v-show="num.status == 'unread'"></i>
                  </image>
                    <div class="mess_name">
                      <span>{{num.creator.username}}</span><br>
                      <span>{{num.content}}</span>
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
            <div slot="right">
              <span style="background:#9F9F9F" @tap.stop="onRead($event, num)">标为已读</span>
              <span @tap.stop="onDelete($event, num.id)">删除</span>
            </div>
          </van-swipe-cell>
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
            bind:click="onShread"
          />
          <van-goods-action-button text="删除" bind:click="onShdelete" />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import Top from '../../components/head/index'
import fun from '../../utils/index'
// import dataInfo from './dataInfo'
  export default {
    name: '',
    components: {
      Top,
    },
    data() {
      return {
        value: "",
        checked: false,
        modifyShow: true,
        result: [],
        he: 40,
        content: [],
        dataInfo: [],
        // dataInfo,
        back: {
          text: '消息列表',
          flag: 'true'
        }
      }
    },
    onLoad() {
      this.$http.get('/app/chat/list/all/user', res => {
        if(res.data.success) {
          this.dataInfo = res.data.data
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
          this.dataInfo = res.data.data
          this.dataInfo.forEach(num => {
            num.createTimeStr = fun.getTimeInfo(num.createTimeStr)
            this.content.push(String(num.id))
          })
        }
        console.log(res.data.success)
      })
    },
    methods: {
      onShread(e, num) {
        this.$http.post('/app/chat/read/all', {
          id: id
        }, res => {
          console.log(res)
        })
      },
      onShdelete(e, num) {
        this.$http.post('', {
          id: id
        }, res => {
          console.log(res)
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
                this.dataInfo = res.data.data
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
        this.$http.post('/app/house/delete',{
          id: id
        }, res => {
          console.log(res)
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
        const { position, instance } = event.detail;
        switch (position) {
          case 'left':
          case 'cell':
            instance.close();
            break;
          case 'right':
            Dialog.confirm({
              message: '确定删除吗？',
            }).then(() => {
              instance.close();
            });
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
.mess_name {
  /* float: right; */
  position: relative;
  left: 100rpx;
  bottom: 80%;
  width:420rpx;/*要显示文字的宽度*/
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  /* right: 200rpx; */
  /* overflow:hidden;
  text-overflow:ellipsis */
}
.van-swipe-cell__right {
  display: inline-block;
  width: 240rpx;
  height: 140rpx;
  font-size: 22rpx;
  line-height: 140rpx;
  /* color: #fff;
  text-align: center; */
  /* background-color: #f44; */
}
.van-swipe-cell__right span {
  display: inline-block;
  width:120rpx;
  background-color: #f44;
  height: 140rpx;
  font-size: 24rpx;
  line-height: 140rpx;
  color: #fff;
  text-align: center
}
.home_img{
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  /* margin: 100rpx 0; */
  border: 1px solid #fff;
}
.mess_info{
  width: auto;
  height: 100rpx;
  position: relative;
}
.message .van-search__action--hover {
  background: #fff !important;
}
.search_but .van-button {
  width: 60rpx;
  height: 60rpx;
}
.value-class {
  flex: none !important;
}
.modify {
  margin: 10rpx 10rpx;
  padding-top: 10rpx;
}
.modify .van-checkbox__label {
  margin-left: 10rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #bbb;
}
.modify_title {
  margin-left: 30rpx;
  font-size: 28rpx;
}
.modify_hover {
  font-size: 30rpx;
  color: aqua;
}
.button_footer .van-goods-action{
  margin-bottom: 20px;
}
.message_body {
  position: relative;
  height: auto;
  overflow: hidden;
  overflow-y: scroll;
}
.rightArea {
  display: flex;
  align-items: center;
  flex-direction:column
}
.time_right {
  width: 153rpx;
  text-align: center;
  }
  .tip {
    display:block;
    background:#f00;
    border-radius:50%;
    width:12rpx;
    height:12rpx;
    top:0px;
    left: 80rpx;
    position:absolute;
  }
</style>