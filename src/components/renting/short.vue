<template>
  <div class="short" id="short">
    <van-search
        v-model="searchValue"
        placeholder="请输入房源标题"
        use-action-slot
        background="#f0f3f6"
        @cancel="onCancel"
        @change="onChangeVal"
        @search="onSearch"
        label="关键字"
        shape="round"
        class="search"
    >
    <div
        slot="action"
        @tap="onSearchSend"
    >搜索</div>
    </van-search>
    <div class="choose">
      <view hover-class="bg_red">
      <div :value="sort" @tap="sortClick" class="choose_div" @touchstart="sort">
        <span class="choose_time">发布时间</span><i style="font-size: 30rpx; color: #666666" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
        <i style="font-size: 30rpx;color: #666666" class="iconfont icon-sanjiaoxing_shang" v-else></i>
      </div>
      </view>
      <!-- <span class="choose_time">发布时间</span><i @tip = "sort = asc" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
      <i class="icon-sanjiaoxing_shang" v-else></i> -->
      <div class="shaixuan">
        <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
        <van-dropdown-menu>
          <van-dropdown-item title="筛选" ref="item" id="item">
            <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
            <!-- <van-cell :title="'性别: '+sex"> -->
            <van-cell title="租房状态">
              <van-switch v-model="switch1"  @input="onInput"></van-switch>
            </van-cell>
            <!-- <van-cell  title="团购">
              <van-switch v-model="switch2"></van-switch>
            </van-cell> -->
            <van-cell title="租房标识" class="symbolRental">
              <checkbox-group @dchange="checkboxChange" class="boxflex">
                  <label :class="['checkbox', num.checked?'active':'']"
                      v-for="(num, i) in items" 
                      :key="i"
                      @tap="addclass"
                      :data-index="i">
                      <chechbox :value="i" :checked="num.checked">{{num.name}}</chechbox>
                  </label>
              </checkbox-group>


            </van-cell>
            <van-cell>
              <van-button style="float: left" color="red" round type="info" @click="onConfirmReset">重置</van-button>
              <van-button  round type="info" @click="onConfirm">确认</van-button>
            </van-cell>
            <!-- <div class="chooseBut">
              
            </div> -->
            
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      
    </div>
      <div v-for="(num, i) in dataArr" :key="i" class="sublet" @tap="turnDetail($enent,num)"> 
        <van-panel :title="num.title+'/'+num.typeStr" desc="描述信息" :status="num.statusStr" use-footer-slot class="sublet_main" footer-class="footer">
            <div class="content_main">
              <div class="remark"><span>{{num.description}}</span></div>
              <div>
                <div class="tubiao">
                  <img class="home_img" :src="num.creator.headImg" alt="">
                  <div class="name">
                    <span>{{num.creator.username}}
                      <i class="iconfont icon-xingbienan" style="float:right; color:#83b2f9" v-if="num.sex=='male'"></i>
                      <i class="iconfont icon-xingbienv" style="float:right; color:#f983a9" v-else></i>
                    </span>
                  </div>
                  <div class="time">
                    <span>发布时间：{{num.updateTime}}</span>
                      <p>
                      ￥{{num.priceEachMonth}}元/月
                    </p>
                  </div> 
                </div>
                
              </div>
            </div>
          <div slot="footer">
            <van-button size="small" :icon="num.icon" :color="color" plain @tap.stop="collect(num)">收藏</van-button>
          </div>
        </van-panel>
      </div>
    <div class="footer1">

    </div>
  </div>
</template>

<script>
  import {data} from './data'
  export default {
    name: '',
    props: {
      dataArr: {
        type: Array,
        default: () => {}
      }
      
    },
    data() {
      return {
        value: "",
        sex: '男',
        sort: "desc",
        color: '#FFCC66',
        switch1: false,
        switch2: false,
        navHeight: "",
        // icon: 'star-o',
        searchValue: "",
        status: "",
        items: [
            { name: 'USA', value: '美国', checked: false },
            { name: 'CHN', value: '中国', checked: true },
            { name: 'BRA', value: '巴西', checked: false },
            { name: 'JPN', value: '日本', checked: false },
            { name: 'ENG', value: '英国', checked: false },
            { name: 'TUR', value: '法国', checked: false },
            { name: 'TUR', value: '法国', checked: false },
            { name: 'TUR', value: '法国', checked: false },
             
        ]
      }
    },
    mounted () {
      // this.navHeight = this.globalData.navHeight
      // console.log(this.navHeight)
    },
    methods: {
      checkboxChange(e){
        console.log('checkbox发生change事件，携带value值为：', e.mp.detail.value)
    },
    //添加class 样式
    addclass(e){
        let self = this
        //获取数据
        let list = self.items
        //获取index
        let index = e.mp.currentTarget.dataset.index
        //如果为true变为false
        if(list[index].checked){
            list[index].checked=false
        }else{
            list[index].checked = true
        }
        //重新赋值
        self.items = [] .concat(list)
    },    
      onConfirm() {
        this.$root.$mp.page.selectComponent('#item').toggle();
      },
      onConfirmReset() {
        this.items.forEach(num => {
          num.checked = false
        })
        this.switch1 = false
        this.$root.$mp.page.selectComponent('#item').toggle();
      },
      onInput () {
        this.switch1 = !this.switch1
        if(this.switch1) {
          this.status = "finished"
        } else {
          this.status = "persistent"
        }

      },
      onInput1 () {
        this.switch2 = !this.switch2
      },
      onSearchSend(e) {
        if(this.searchValue) {
          this.$store.commit('changeValue', this.searchValue) 
        }
      },
      turnDetail(e,num) {
        let a = JSON.stringify(num)
          wx.navigateTo({
            url: '/pages/detail/main?dataDetail='+encodeURIComponent(a),
          })
      },
      collect(val) {
        if(val.icon == 'star-o') {
          //  val.icon = ""
          
          this.$http.post(`/app/favorites/like/${val.id}`, res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',
                // icon: 'none',
                mask:true,   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
            this.$set(val, 'icon', 'star')
            this.$forceUpdate();
          })
          
         
        } else {
          // val.icon = ""
          this.$http.delete(`/app/favorites/dislike/${val.id}`, res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,  // 标题
                icon: 'success',   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
            this.$set(val, 'icon', 'star-o')
            this.$forceUpdate();
          })
          
        }
        console.log(val)
      },
      sortClick(e) {
        if(this.sort == 'desc') {
          this.sort = "asc"
        } else {
          this.sort = 'desc'
        }
      },
      sort(e) {
        console.log("dd")
      },
      onSearch (e) {
        console.log(e.mp.detail)
      //这个方法此时还有效，点击 Enter 仍会执行
        this.val = e.mp.detail
      },
      onChangeVal (e) {
        this.searchValue = e.mp.detail
      },
      onSearch2 () {
        wx.showToast({
          title: this.val, // 提示的内容,
          icon: 'success', // 图标,
          duration: 2000, // 延迟时间,
          mask: true, // 显示透明蒙层，防止触摸穿透,
        })
      }
    }
  }
</script>

<style>
#short {
  width: 100%;
}
#short .footer1 {
  height: 40rpx;
}
#short .search .van-search__content--round {
 border: 1px solid #000;
}
#short .choose span{
  font-size: 24rpx;
  float: left;
  padding-left: 20rpx;
}
#short .home_img{
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  /* margin: 100rpx 0; */
  margin-left: 30rpx;
}
#short .choose div {
  width: 160rpx;
  height: 40rpx;
  line-height: 40rpx;
}
#short .choose .choose_div::before  {
  color: aqua;
}
.choose_time {
  /* float: left; */
}
#short .choose {
  width: 100%;
  display: flex;
  margin-left: 20rpx;
}
 #short .bg_red {
  color: #1989fa !important;
}
#short .content_main {
  display: flex;
  flex-direction: column;
}
#short .content_main .remark{
  margin: 20rpx auto;
  width: 550rpx;
  display: -webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  word-wrap:break-word;
  font-size: 30rpx;
  letter-spacing: 3rpx;
  text-indent: 40rpx;
  overflow:hidden;
  text-overflow:ellipsis;
  font-family: '微软雅黑';
  color:#888888;
}
 #short .content_main .tubiao {
  display: flex;
  flex-wrap: wrap
}
#short .name {
  width: 262rpx !important;
  /* flex: 1; */
  padding: 20rpx;
}
#short .van-panel {
  border: 2rpx solid#87caee;
  padding: 2rpx;
  border-radius: 5rpx;
}
#short .name span {
  width:auto;
  display: inline-block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 28rpx;
  
}
#short .name span i {
padding-left: 10rpx;
}
#short .time {
  float: right;
  font-size: 25rpx;
}
#short .time p {
  text-align: right;
  font-weight: 600;
  color: red;
}
#short .sublet {
  padding: 20rpx 30rpx !important;
  
}

#short .footer {
  text-align: right;
}
#short .footer .van-button {
   font-size: 28rpx;
   width: 140rpx;
   height: 64rpx;
}
#short .sublet:last-child {
  margin-bottom: 40rpx;
}
#short .search .van-search__action--hover {
  background: #f0f3f6 !important;
}
#short .shaixuan .van-dropdown-menu {
  height: 40rpx !important;
  line-height: 40rpx;
  background: #f0f3f6 !important;
}
#short .shaixuan .van-ellipsis {
  font-size: 24rpx;
}
.shaixuan .van-cell {
}
#short .van-dropdown-item--down {
  top: 185px!important;
}
.shaixuan .van-cell .van-button {
  width: 200rpx;
  height: 80rpx;
   opacity: 0.8;
  font-size: 30rpx;
}
.checkbox{
    /* opacity: 0; */
    position: absolute;
    top: 0;
    left: 0;
    height: 50rpx;
    width: 100rpx;
}
.checkbox{
    position: relative;
    height: 50rpx;
    line-height: 50rpx;
    width: 100rpx;
    background: #ccc;
    color: #fff;
    font-size: 28rpx;
    border-radius: 10rpx;
    margin: 10rpx;
    text-align: center;
    padding: 0 10rpx;
    box-sizing: border-box;
}
.boxflex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
.active{
    background: #1989fa;
}
.symbolRental .van-cell__title,.van-cell__value {
flex: none;
}

</style>