import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}
  },
  mutations: {
    setUserInfo (state, obj) {
      if (obj.username) {
        state.userInfo = obj
        localStorage.setItem('userInfo', JSON.stringify(obj))
      }
    },
    delUserInfo (state) {
      state.userInfo = {}
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userTimer')
    }
  }
})
