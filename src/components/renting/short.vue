<template>
  <div id="short">
    <van-search
        v-model="searchValue"
        placeholder="请输入房源地址"
        use-action-slot
        background="#f0f3f6"
        @cancel="onCancel"
        @change="onChangeVal"
        @search="onSearch"
        label="关键字"
        shape="round"
        class="search"
        @focus.stop="onFouces"
        @blur.stop="onBlur"
        @clear="onClear"
    >
    <div
        slot="action"
        @tap="onSearchSend"
    >
    <view hover-class="bg_red">搜索</view></div>

    </van-search>
    <van-transition :show="showAn" custom-class="block" duration="{ enter: 300, leave: 1000 }">
    <div class="select">
      <ul>
        <li v-for="(num, i) in selectArr" :key="i" ><span @tap="onLi($event,num)">{{num}}</span></li>
      </ul>
    </div>
    </van-transition>
    <div class="choose">
      <!-- 时间排序 -->
      <!-- <view hover-class="bg_red">
      <div :value="sort" @tap="sortClick" class="choose_div" @touchstart="sort">
        <span class="choose_time">发布时间</span><i style="font-size: 30rpx; color: #666666" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
        <i style="font-size: 30rpx;color: #666666" class="iconfont icon-sanjiaoxing_shang" v-else></i>
      </div>
      </view> -->
      <!-- <span class="choose_time">发布时间</span><i @tip = "sort = asc" class="iconfont icon-sanjiaoxing" v-if="sort == 'desc'"></i>
      <i class="icon-sanjiaoxing_shang" v-else></i> -->
      <div class="shaixuan">
        <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
        <van-dropdown-menu :overlay="false">
          <van-dropdown-item title="价格" ref="item" id="item1"
           @close="onConfirm2" @open="onConfirm1" class="itemD"
           :style="{display: categoryShow ? 'none ' : 'block' } " >
          </van-dropdown-item>
          <van-dropdown-item title="筛选" ref="item" id="item">
            <!-- <span>筛选</span><i class="iconfont icon-icon_shaixuan"></i> -->
            <!-- <van-cell :title="'性别: '+sex"> -->
            <van-cell title="已出租">
              <van-switch v-model="switch1"  @input="onInput"></van-switch>
            </van-cell>
            <!-- <van-cell  title="团购">
              <van-switch v-model="switch2"></van-switch>
            </van-cell> -->
            <van-cell title="租房标识" class="symbolRental">
              <checkbox-group @change="checkboxChange" class="boxflex">
                  <label :class="['checkbox', num.checked?'active':'']"
                      v-for="(num, i) in items"
                      :key="i"
                      @tap="addclass"
                      :data-index="i">
                      <chechbox :value="num.value" :checked="num.checked">{{num.name}}</chechbox>
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
    <view :style="{width:(windowWidth - 30) +'rpx', overflow: 'hidden'}">
      <scroll-view class="my_list" id="page"
        @touchstart='touchStart'
        @touchend='touchEnd'
        @touchmove='touchMove'
        :style='{height: (windowHeight - 690)+"rpx",width: (windowWidth) + "rpx"}'
        scroll-y="true" :scroll-top="scrollTop"
        @scroll="scroll"
        @scrolltoupper="refresh"
        @scrolltolower="loadMore"
        lower-threshold="10">
        <view v-if="showRefresh"
           style='width:100%;position:relative;padding:60rpx 0;padding-bottom: 10rpx'>
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
        <div v-for="(num, i) in dataArr1" :key="i" :style="{width:(windowWidth -80)+'rpx'}" class="sublet" @tap="turnDetail($enent,num)">
          <van-panel :title=" num.title+'/'+num.typeStr"
           :desc="num.tagsName"
           :status="num.statusStr"
            use-footer-slot
            class="sublet_main" footer-class="footer">
              <div class="content_main">
                <span class="spl">地点：{{num.provName + '-' + num.cityName+'-'+num.counName+' '+""}}</span><br/>

                <div class="remark">
                  <span>{{num.description}}</span>
                </div>
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
        <div class="load_more" v-if="loading">
            <div class="load_loading"></div>
            <div class="load-tips">正在加载……</div>
          </div>
          <div class="load_end" v-if="loaded">{{load_text}}</div>
      </scroll-view>
    </view>
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
        showAn: false,
        sort: "desc",
        loading: false,
        categoryShow: false,
        priceAsc: false,
        loaded: false,
        color: '#FFCC66',
        switch1: false,
        switch2: false,
        tags: [],
        dataArr1: [],
        selectArr: [],
        flagType: false,
        freshStatus: 'more', // 当前刷新的状态
        showRefresh: false,   // 是否显示下拉刷新组件
        windowHeight: 0,
        isScrolling: false,
        load_text: "加载更多数据",
        windowWidth: "",
        number: 1,
        navHeight: "",
        counCode: "",
        // icon: 'star-o',

        searchValue: "",
        status: "persistent",
        items: [
            { name: '地铁站', value: '地铁站', checked: false },
            { name: '火车站', value: '火车站', checked: false },
            { name: '学校', value: '学校', checked: false },
            { name: '医院', value: '医院', checked: false },
            { name: '购物广场', value: '购物广场', checked: false },
            { name: '超市', value: '超市', checked: false },
            { name: '体育馆', value: '体育馆', checked: false },
            { name: '菜市场', value: '菜市场', checked: false },

        ]
      }
    },
    watch: {
      dataArr: {
　　　　handler(newValue, oldValue) {
           let that = this
           let a = new Promise((resolve, reject) => {
              that.dataArr1 = []
              resolve()
            })
            console.log("oldValue",oldValue)
          a.then(() => {
            if(newValue.length == 0) {
              that.dataArr1 = []
            }
            console.log(newValue,"nwewewewe")
            if(oldValue.length!=0 && oldValue!=null) {
              console.log(newValue,"nw32323ewewewe")
    　　　　　　for (let i = 0; i < newValue.length; i++) {
                // if (oldValue[i].id != newValue[i].id) {
                    that.dataArr1[i] = newValue[i]
    // 　　　　　　　  }
                }　
    　　　　　 } else {
                for (let i = 0; i < newValue.length; i++) {
                  that.dataArr1[i] = newValue[i]
                }
              }
              this.counCode = this.$store.state.counCode
          })

  　　　　},
  　　　　deep: true
  　　}
    },
    computed: {
      dataArr1() {
        return this.dataArr
      }
    },
    destroyed () {
      this.$store.commit('changeSelect', this.selectArr)
    },
    mounted () {
      let arr = this.$store.state.select
      for(let i in arr) {
        this.selectArr[i] = arr[i]
      }
      this.searchValue = ""
      // setTimeout(() => {
      this.counCode = this.$store.state.counCode
      // }, 1500)
      this.windowHeight = this.globalData.windowHeight
      this.windowWidth = this.globalData.windowWidth
        this.$store.commit('changeFouce', false)
    },
    methods: {
      onShort() {
        this.showAn = false
      },
      onLi(e,val) {
        this.searchValue = ""
        this.searchValue = val
          this.onSearchSend()
      },
      onClear(e) {
        console.log(e)
        this.searchValue = ""
      },
      onFouces() {
        console.log("dssdsd")
        if(this.selectArr.length > 0) {
          this.$store.commit('changeFouce', true)
        }

        if(this.selectArr.length >= 1) {
          this.showAn = true
        }

        if(this.selectArr.length > 10) {
          this.selectArr.splice(10)
        }
      },
      onBlur() {
        console.log("blue")
        this.$store.commit('changeFouce', false)
        this.showAn = false
      },
      filterFn(val) {
        let str = "";
        let arr = JSON.parse(val)
        if (!val) {
          return ''
        } else {
         for(let i in arr) {
          str = str + arr[i].value
         }
         console.log("是")
         return str
        }
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
            let a = new Promise((resolve, reject) => {
               setTimeout(() => {
                  this.freshStatus = 'fresh'
                  resolve()
               }, 500)

            })
            a.then(() => {
              if(this.flagType == true) {
                this.searchValue = ""
                this.onSearchSend1(this.tags, this.status)
              }else {
                this.searchValue = ""
                this.getData();
              }
            })

              // 获取最新列表数据
          // }, 500);
        } else {
          this.showRefresh = false
        }
      },
      scroll() {

      },
      refresh: function () {
          console.log("下拉")
      },
      loadMore() {
        let that = this;
        let type = 'short_rent'
        if(this.isScrolling===true) {
          return;
        }
        this.isScrolling=true;
        that.loading = true;
        that.loaded = false;
        that.number = that.number + 1
        let url = ""
        if(this.flagType == true) {
          url = `/app/house/export/list?pageIndex=${that.number}&counCode=${this.counCode}&pageSize=10&type=${type}&tags=${ JSON.stringify(this.tags) }&status=${this.status}`
        } else {
          url = `/app/house/export/list?pageIndex=${that.number}&counCode=${this.counCode}&pageSize=10&type=${type}`
        }
        this.$http.get(url, res=> {
          if(res.data.success) {
            let a = new Promise((resolve, reject) => {
              setTimeout(() => {
                that.loading = false;
                resolve()
              }, 500)
            })

            a.then(() => {
              if(res.data.data == [] || res.data.data.length == 0) {
                that.load_text = "没有更多的数据......"
              } else {
                 that.load_text = "加载更多的数据"
              }
              that.loaded = true;
              setTimeout(() => {
                that.isScrolling=false;
              },3000)
              that.dataArr1 = that.dataArr1.concat(res.data.data)
              that.dataArr1.forEach(num => {
                  let tags = JSON.parse(num.tags)
                  let str = "";
                  for(let i in tags) {
                    str = str + tags[i].value + " "
                  }
                  num.tagsName = str
                  num.updateTime = num.updateTime.substring(0, 10)
                  if(num.favorite == false) {
                    num.icon="star-o"
                  } else {
                    num.icon = "star"
                  }
              })

            })

          }
        })
      },
      getData(priceAsc) {
        let that = this
        that.number = 1
        let type = 'short_rent'
        this.$http.get(`/app/house/export/list?pageIndex=1&pageSize=10&type=${type}&counCode=${this.counCode}&priceAsc=${this.priceAsc}`, res=> {
          if(res.data.success) {
            setTimeout(() => {
              this.showRefresh = false
            }, 500)
              console.log("房源列表", res.data.data)
            that.dataArr1 = [].concat(res.data.data)
            that.dataArr1.forEach(num => {
              let tags = JSON.parse(num.tags)
              let str = "";
              for(let i in tags) {
                str = str + tags[i].value + " "
              }
              num.tagsName = str
              num.updateTime = num.updateTime.substring(0, 10)
              if(num.favorite == false) {
                num.icon="star-o"
              } else {
                num.icon = "star"
              }
            })
          }
        })

      },
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
    onConfirm1(e) {
      this.priceAsc = true
      this.categoryShow = true
      this.getData(this.priceAsc)
      // this.$root.$mp.page.selectComponent('#item1').toggle();

    },
    onConfirm2(e) {
      this.categoryShow = false
      this.priceAsc = false
      this.getData(this.priceAsc)
    },
      onConfirm() {
        this.$root.$mp.page.selectComponent('#item').toggle();
        this.flagType = true
        let tags = []
        this.items.forEach((num, i) => {
          if(num.checked == true) {
            tags.push({
              value: num.value,
              index: i
            })
          }
        })
        this.tags = [].concat(tags)
        this.onSearchSend1(this.tags, this.status)

      },
      onConfirmReset() {
        this.items.forEach(num => {
          num.checked = false
        })
        this.flagType = false
        this.switch1 = false
        this.getData();
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
      onSearchSend1(tags, status){
          let that = this
          if(this.flagType == true) {
            if(that.showRefresh == true) {
              this.freshStatus = 'fresh'
            }
            that.number = 1
          }

          let type = 'short_rent'
          let title = this.searchValue
          let tag = JSON.stringify(tags)
          this.$http.get(`/app/house/export/list?pageIndex=1&counCode=${this.counCode}&pageSize=10&type=${type}&title=${title}&tags=${tag}&status=${status}`, res=> {
            if(res.data.success) {
              that.dataArr1 = []
              that.dataArr1 = [].concat(res.data.data)
              if(that.dataArr1.length > 0) {
                that.dataArr1.forEach(num => {
                  let tags = JSON.parse(num.tags)
                  let str = "";
                  for(let i in tags) {
                    str = str + tags[i].value + " "
                  }
                  num.tagsName = str
                  num.updateTime = num.updateTime.substring(0, 10)
                  if(num.favorite == false) {
                    num.icon="star-o"
                  } else {
                    num.icon = "star"
                  }
                })
              }
          }
          if(that.flagType == true) {
            setTimeout(() => {
              that.showRefresh = false
            }, 1000)
          }
        })
      },
      onSearchSend(e) {
        console.log("rrrrrrrrrrss",this.searchValue,"dfdfdf")
        let that = this
        // this.selectArr.unshift(this.searchValue)
        // return
        if(this.searchValue) {
          if(this.selectArr.includes(this.searchValue) == false) {
            this.selectArr.unshift(this.searchValue)
          }

          that.number = 1
          let title = this.searchValue
          let type = 'short_rent'
          let url = ""
          if(this.flagType == true) {
            url = `/app/house/export/list?pageIndex=1&pageSize=10&type=${type}&counCode=${this.counCode}&title=${title}&tags=${ JSON.stringify(this.tags) }&status=${this.status}`
          } else {
            url = `/app/house/export/list?pageIndex=1&pageSize=10&type=${type}&title=${title}&counCode=${this.counCode}`
          }
          this.$http.get(url, res=> {
            if(res.data.success) {
              that.dataArr1 = [].concat(res.data.data)
              that.dataArr1.forEach(num => {
                  let tags = JSON.parse(num.tags)
                  let str = "";
                  for(let i in tags) {
                    str = str + tags[i].value + " "
                  }
                  num.tagsName = str
                num.updateTime = num.updateTime.substring(0, 10)
                if(num.favorite == false) {
                  num.icon="star-o"
                } else {
                  num.icon = "star"
                }
              })
              if(this.selectArr.length > 10) {
                this.selectArr.splice(10)
              }
            }

          })
          // this.$store.commit('changeValue', this.searchValue)
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
        console.log("点击搜索", e.mp.detail)
        if(e.mp.detail) {
          this.searchValue = e.mp.detail.value
          this.onSearchSend()
        }
      //这个方法此时还有效，点击 Enter 仍会执行

      },
      onChangeVal (e) {
          if (!(e.mp.detail instanceof Object)){
              this.searchValue = e.mp.detail
          }
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
#short .load_more {
  width: 65%;
  margin: 0rpx auto;
  margin-bottom: 70rpx;
  font-size: 14px;
  text-align: center;
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
}
#short .load_loading {
  margin: 0 10rpx;
  width: 40rpx;
  /* display: inline-block;
  vertical-align: middle; */
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;

}
#short .load_tips {
  display: inline-block;
  vertical-align: middle;
}
#short .load_end {
  width: 65%;
  margin: 0rpx auto;
  margin-bottom: 70rpx;
  font-size: 14px;
  text-align: center;
  position: relative;
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
  width: 200rpx;
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
  margin-bottom: 20rpx !important;
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
#short .content_main .spl{
  margin: 0rpx auto;
  margin-top: 10rpx;
  margin-left: 24rpx;
  display: -webkit-box;
  text-indent: 0rpx !important;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  word-wrap:break-word;
  font-size: 24rpx;
  letter-spacing: 3rpx;
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
  margin: 0 auto;
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
  padding: 20rpx 40rpx !important;
   margin: 0 auto;

}
#short .sublet:first-child {
  padding-top: 0rpx !important;
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
#short .shaixuan .van-dropdown-menu .van-dropdown-menu__title
 {
  /* left: 20px !important; */
}

#short .shaixuan .van-dropdown-menu {
  /* margin-top: 40px; */
}
/* .dropClass {
  top: 20px;
  margin-top: 20px !important;
} */
#short .shaixuan .van-ellipsis {
  font-size: 24rpx;
}
/* .shaixuan .van-popup{
   top: 115px;
} */
/* #short .van-overlay {
  top: 150rpx !important;
} */
.shaixuan .van-cell {
}
#short .van-dropdown-item--down {
  top: 600rpx!important;
}
#short .shaixuan .van-cell .van-button {
  width: 200rpx;
  height: 80rpx;
   opacity: 0.8;
  font-size: 30rpx;
}
#short .checkbox{
    /* opacity: 0; */
    position: absolute;
    top: 0;
    left: 0;
    height: 50rpx;
    width: 120rpx;
}
#short .checkbox{
    position: relative;
    height: 50rpx;
    line-height: 50rpx;
    width: 120rpx;
    background: #ccc;
    color: #fff;
    font-size: 26rpx;
    border-radius: 10rpx;
    margin: 10rpx;
    text-align: center;
    padding: 0 5rpx;
    box-sizing: border-box;
}
#short .boxflex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
#short .active{
    background: #1989fa;
}
#short .symbolRental .van-cell__title,.van-cell__value {
flex: none;
}
#short .lzy-loading{
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
#short .flex {
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
#short .select {
  width: 580rpx;
  height: auto;
  background: #fff;
  position: absolute;
  left: 48rpx;
  top: 94rpx;
  /* border-radius: 5px; */
  border: 2rpx solid #bbb;
  border-bottom-right-radius:10rpx;
  border-bottom-left-radius:10rpx;
  border-top: none;
  z-index: 99;
  padding: 5rpx;
  padding-bottom: 10rpx;

}
#short .select ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  /* align-items: center; */
  justify-content: start;
  margin: 0 10rpx;
  margin-top: 20rpx;

}
#short .select ul li {
  line-height: 30rpx;
  font-size: 30rpx;
  color: #888888;
  display: inline-block;
  height: auto;
  /* border-bottom:1px solid  #888888; */
}
#short .select ul li span{
  width: auto;
  border: 1rpx solid #888888;
  display: inline-block;
  line-height: 30rpx;
  padding: 6rpx 6rpx;
  margin-left: 5px;
  margin-bottom: 5px;;
  /* border-bottom:1px solid  #888888; */
}
#short .block {
  height: 0px;
}
.bg_red{
  color: #1989fa;
}
</style>
