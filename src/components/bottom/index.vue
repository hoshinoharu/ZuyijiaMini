<template>
  <div class="tab-bar">
    <div class="tab-bar-border"></div>
      <div v-for="(num, i) in list" :key="i" class="tab-bar-item">
        <div @tap="switchTab($event,num.pagePath,i)">
          <image :src="selected === i ? num.selectedIconPath : num.iconPath"></image><br>
          <!-- <p><i :src="num.selectedIconPath" class="cover-image"></i></p> -->
          <span :style="{color: selected === i ? color:'#bbb'}">{{num.text}}</span>
        </div>
        <!-- <cover-image ></cover-image>
        <div style="color: {{selected === index ? selectedColor : color}}">{{item.text}}</div> -->
      </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      selected: {
        type: Number,
        default: 0
      }
    },
    data() {
    return {
      activeIndex: 0,
      color: '#1296db',
      // selected: 1,
      // list: [
      //   "/pages/nav/main",
      //   "/pages/item/main",
      //   "/pages/counter/main"
      // ],
      list: [{
        text: "首页",
        pagePath: "/pages/nav/main",
        iconPath: "/static/images/earth1.png",
        selectedIconPath: "/static/images/earth2.png"
      }, 
      {
        text: "发布",
        pagePath: "/pages/set/main",
        iconPath: "/static/images/tupian11.png",
        selectedIconPath: "/static/images/tupian10.png"
      },
      // {
      //   text: "消息",
      //   pagePath: "/pages/set/main",
      //   iconPath: "/static/images/tupian11.png",
      //   selectedIconPath: "/static/images/tupian10.png"
      // },
      {
        text: "我的",
        pagePath: "/pages/item/main",
        iconPath: "/static/images/tupian15.png",
        selectedIconPath: "/static/images/tupian12.png"
      }],
    //   list: [{
    //   pagePath: "/pages/nav/main",
    //   // iconPath: "/static/img/home_def.png",
    //   selectedIconPath: "iconfont icon-diqiuxueyuan",
    //   text: "首页"
    // }, 

    // {
    //     pagePath: "/pages/item/main",
    //     iconPath: "/static/img/type_def.png",
    //     selectedIconPath: "iconfont icon-wode2 ",
    //   text: "我的"
    //   }
    //   // ,{
    //   //   pagePath: "/pages/home/index",
    //   //   iconPath: "/static/img/my_def.png",
    //   //   selectedIconPath: "/static/img/my_sel.png",
    //   //   text: "我的"
    //   // }
    //   ]
    }
  },
  methods: {
    switchTab(e, url, index) {
      console.log(url,index)
      // const data = e.currentTarget.dataset
      // const url = data.path
      wx.switchTab({url})
      // console.log(data.index)
    },
    handleProxy(e) {
      const url = this.data.list[e.detail];
      wx.switchTab({
        url
      });
      this.setData({
        activeIndex: e.detail
      })
    }
  }
  }
</script>

<style scoped>
  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 96rpx;
    background: white;
    display: flex;
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;
    overflow: hidden;
  }

.tab-bar-border {
  background-color: rgba(0, 0, 0, 0.33);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-bar-item .cover-image {
  width: 54rpx;
  height: 54rpx;
  /* font-size: 46rpx; */
}
.tab-bar-item image {
  width: 54rpx;
  height: 54rpx;
  margin-bottom: -20rpx;
  /* font-size: 46rpx; */
}
.tab-bar-item span {
  font-size: 25rpx;
}
.tab-bar-item p {
  margin-bottom: -6px;
}
</style>