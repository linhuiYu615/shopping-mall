import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    token (state) {
      // getters就是为了拿组件值的 必须有返回值 里面写方法也必须有返回值 比如reduce
      return state.user.userinfo.token
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  }
})
