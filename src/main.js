import Vue from 'vue'
import App from './App'
import Store from './stores/global'
import http from './utils/http'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue(App)

let that = this
Vue.prototype.$store = Store;
let menuButtonObject = wx.getMenuButtonBoundingClientRect();
console.log(menuButtonObject)
wx.getSystemInfo({
  success: res => {
    let toBar = ""
    let statusBarHeight = res.statusBarHeight,
      navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
      navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
      if(res.platform=="ios") {
          toBar=44;
      }else if(res.platform=="android"){
          toBar=48;
      }else{
          toBar=44;
    }
    let clientHeight = res.windowHeight;
    let clientWidth = res.windowWidth;
    let ratio = 750 / clientWidth;
    let height = clientHeight * ratio;
    let width = clientWidth*ratio
      that.globalData = {
        navHeight: navHeight,
        navTop: navTop,
        windowHeight: height,
        windowWidth: width,
        statusBarHeight: statusBarHeight,
        toBar: toBar,
        searchValue: "",
        fouce: false
      };
  },
  fail(err) {
    console.log(err);
  }
})
Vue.prototype.$url = "https://www.zuyijia.cn:9443/app"
Vue.prototype.globalData = this.globalData
Vue.prototype.$http = http
// Vue.prototype.$globalArr = getApp().globalData
app.$mount()
