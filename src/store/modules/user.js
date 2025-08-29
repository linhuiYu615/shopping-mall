import { setdata, getdata } from '@/utils/stroage'

export default {
  namespaced: true,
  state () {
    return {
      // 从本地读取出来的用户数据
      userinfo: getdata()
    }
  },
  mutations: {
    saveUser (state, obj) {
      state.userinfo = obj
      // 本地存储的用户数据
      setdata(obj)
    }
  },
  actions: {
    // 一个操作多个就用actions
    logout (context) {
      // 用户数据清零 set负责登录退出 而且context.commit只能给mutations用
      context.commit('saveUser', {})

      // 清购物车 跨文件用方法 去官方看看怎么跨
      // 若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可。
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {
  }
}
