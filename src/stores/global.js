
import Vue from 'vue';
import Vuex from 'vuex';
 
Vue.use(Vuex);
 
export default new Vuex.Store({  
  state: {
    count: 0,
    gg: "sss",
    style: {},
    searchValue: "",
    type: "short_rent",
    counCode: "",
    address: "",
    select: [],
    message: 0
  }, 
  mutations: {    
    increment: (state) => {
      state.count += 1
    },
    changeMessage(state, data) { 
      state.message = ""
      state.message = data
    },
    changeSelect: (state, data) => { 
      state.select = []
      for (let i in data) { 
        state.select[i] = data[i]
      }
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
    },
    changeCounCode: (state, data) => {
      state.counCode = ""
      state.counCode = data
    },
    changeAdress: (state, data) => { 
      state.address = ""
      state.address = data
    }
  }
});