
import Vue from 'vue';
import Vuex from 'vuex';
 
Vue.use(Vuex);
 
export default new Vuex.Store({  
  state: {
    count: 0,
    gg: "sss",
    style: {},
    searchValue: "",
    type: "short_rent"
  }, 
  mutations: {    
    increment: (state) => {
      state.count += 1
    },    
    decrement: (state) => {
      state.count -= 1
    },
    SETSTYLE: (state, data) => { 
      state.style = Object.assign({}, data)
      console.log(state.style)
    },
    changeValue: (state, data) => { 
      state.searchValue = ""
      state.searchValue = data
    },
    changeType: (state, data) => {
      state.type = ""
      state.type = data
    }
  }
});