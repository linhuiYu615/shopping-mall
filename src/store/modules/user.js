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
  actions: {},
  getters: {
  }
}
