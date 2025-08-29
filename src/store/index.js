import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'
import pay from './modules/pay'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'smart-shop-h5', // 本地存储的 key
      paths: [ // 需要持久化的模块/字段
        'cart.cartList',
        'pay.list',
        'user.userinfo'
      ],
      storage: window.localStorage // 默认就是 localStorage，可省略
    })
  ],
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
    user,
    cart,
    pay
  }
})
