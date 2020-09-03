<template>
   <div class="page">
     <scroll-view  :style="{'height': scrollHeight+'px'}" :scroll-y="true" @scrolltolower="scrolltolower" @scroll="scroll" :scroll-into-view="toView">
 
   
      <div class="container">
        <div class="page__bd page__bd_spacing">
          <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular" @change="swiperChange" @animationfinish="animationfinish">
            <div v-for="item in imgUrls" :key="index">
              <swiper-item>
                <image :src="item" class="slide-image" />
              </swiper-item>
            </div>
          </swiper>
        </div>
      </div>
      <div class="content">
        <div class="art">
            <div class="info">
            <div class="left price">参考价： &yen;110.00</div>
            <div class="right depart">互联网业务拓展部</div>
          </div>
          <div class="title">
            唱吧麦克风ELF-黑色，赠 唱吧胶囊麦克风ELF防风罩-黑色
          </div>
          <div class="txt">
            <div class="left">
              HPON1DG04PA#AB2
            </div>
            <div class="right">
              0   000
            </div>
          </div>
        </div>
      </div>
     
     <div class="allContent">
       <div :class="scrollTop>=550?'bar barFixed':'bar'">
          <div :class="currentTab==0?'item actice':'item'" @click="scrollTo1(0)">
           参数规格
          </div>
          <div :class="currentTab==1?'item actice':'item'" @click="scrollTo1(1)">
            包装售后 
          </div>
          <div :class="currentTab==2?'item actice':'item'" @click="scrollTo1(2)">
            图文详情
          </div>
       </div>
       <div class="tabContent">
          <div class="tabs1" id="tabs1">
              <div class="col col1">
                            <div class="line"></div>
                            <div class="t">
                             参数规格
                            </div>
                        </div>
                        <div class="tab1">
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                            
                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>

                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>

                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>

                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>
                            
                            </div>
                        
             </div>
             <div class="tabs2" id="tabs2">
              <div class="col col1">
                            <div class="line"></div>
                            <div class="t">
                             包装售后
                            </div>
                        </div>
                        <div class="tab1">
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>
                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>
                            </div>
            
             </div>
             <div class="tabs3" id="tabs3">
              <div class="col col1">
                            <div class="line"></div>
                            <div class="t">
                              图文详情
                            </div>
                        </div>
                        <div class="tab1">
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>

                             <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>

                             <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>

                             <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                             <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                            <div class="item">
                              <div class="left label">
                                商品编码：
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2商品编商品编商品
                              </div>
                            </div>
                             <div class="item">
                              <div class="left label">
                                产品线
                              </div>
                              <div class="left txt">
                                HPON1DG04PA#AB2
                              </div>
                            </div>
                            
                            </div>
                        <div class="tabImg">
                          <div>
                            <image mode="widthFix" src="https://img.alicdn.com/imgextra/i3/3377338380/TB23qbQnnlYBeNjSszcXXbwhFXa_!!3377338380.jpg" ></image>
                          </div>
                          <div><image mode="widthFix" src="https://img.alicdn.com/imgextra/i1/3377338380/TB2eOJve2uSBuNkHFqDXXXfhVXa_!!3377338380.jpg"></image></div>
                        </div>
             </div>
          </div>
       </div>
        </scroll-view>
     </div>

   

</template>

<script>
export default {
  data() {
      return {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 900,
        circular: true,
        imgUrls: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        tabs: ["图文详情", "参数规格", "包装售后"],
        activeIndex: 0,
        fontSize: 30,
        scrollHeight:500,
        tabs1Height:0,
        tabs2Height:0,
        tabs3Height:0,
        currentTab:0,
        scrollTop:0,
        toView:""
      }
  },
	mounted(){
		var that=this;
	          wx.getSystemInfo({
	            success: function(res) {
	               that.scrollHeight=res.windowHeight;
	            }
	            });
	  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return 'weui-navbar__slider_0'
      }
      if (this.activeIndex == 1) {
        return 'weui-navbar__slider_1'
      }
      if (this.activeIndex == 2) {
        return 'weui-navbar__slider_2'
      }
    },
  },
  onLoad(){

      var _this=this;
      var query = wx.createSelectorQuery();
      //选择id
      query.select('.tabs1').boundingClientRect();
      query.exec(function (res) {
        //res就是 所有标签为mjltest的元素的信息 的数组
       console.log(res[0].height);
        //取高度
        _this.tabs1Height=res[0].height;
      });
      var query1 = wx.createSelectorQuery();
      query1.select('.tabs2').boundingClientRect();
      query1.exec(function (res) {
        //res就是 所有标签为mjltest的元素的信息 的数组
       // console.log(res[0].height);
        //取高度
        _this.tabs2Height=res[0].height;
      });
      var query3 = wx.createSelectorQuery();
      query3.select('.tabs3').boundingClientRect();
      query3.exec(function (res) {
        //res就是 所有标签为mjltest的元素的信息 的数组
        console.log(res[0].height);
        //取高度
        _this.tabs3Height=res[0].height;
      });
  },
  methods: {
    tabClick(e) {
      console.log(e);
      this.activeIndex = e.currentTarget.id;
    },
    scrolltolower(){
          console.log(7)
        },
        scroll(e) {
        var scrollH=e.mp.detail.scrollTop;
        var tabs2H=480+this.tabs1Height;
        var tabs3H=480+this.tabs2Height+this.tabs1Height;
        if(scrollH<tabs2H){
          this.currentTab=0;
        }else if(tabs2H<scrollH<tabs3H){
          this.currentTab=1;
        }
        if(scrollH>tabs3H){
          this.currentTab=2;
        }
          console.log(scrollH);
          console.log(tabs3H);
          this.scrollTop=scrollH;
           this.toView="";
        },
       scrollTo1(val){
        
           var tabs2H=480+this.tabs1Height;
        var tabs3H=480+this.tabs2Height+this.tabs1Height;
        console.log(val);
          if(val==0){
             this.toView="tabs1";
          }else if(val==1){
            this.toView="tabs2";
            
          }else{
             this.toView="tabs3";
          }
       }
  }
}
</script>

<style scoped lang="less">
@import "../../css/weui.css";
@import "goodsInfo.less";
</style>