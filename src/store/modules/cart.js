import { getcartlist } from '@/api/cartlist'
import { del, getcount } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      // 购物车列表
      cartList: []
    }
  },
  mutations: {
    // 提供mutation去存action
    setCartList (state, newList) {
      state.cartList = newList
    },
    check (state, id) {
      // 先去判断是不是我勾选的商品 find
      const goods = state.cartList.find((item) => item.goods_id === id)
      goods.isCheck = !goods.isCheck
    },
    all (state, flag) {
      // flag是同一状态 所有都让他一个状态 再去取反 foreach
      state.cartList.forEach(item => { item.isCheck = flag })
    },
    countmutations (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(i => i.goods_id === goodsId)
      if (goods) goods.goods_num = goodsNum // 这里就能正确更新
    }
  },
  // 异步操作放到actions 然后用mutations去调用state context是参数 commit和dispath都要用它来传
  // 去渲染 一打开页面就要渲染这个列表 登录才能渲染
  actions: {
    async getprocart (context) {
      const { data } = await getcartlist()

      // 复选框自己写 每个商品前面都要
      data.list.forEach(item => {
        item.isCheck = true
      })
      // console.log(data.list)
      // commit调用

      // newList是data.list的实参
      context.commit('setCartList', data.list)
      /* console.log(
        data
      ) */
    },
    async deletepro (context) {
      // 删东西要id selTotal删打钩的 用到这个方法 先使用这个方法
      const selTotal = context.getters.Choose
      const arr = selTotal.map(item => item.id)
      // console.log(arr)
      await del(arr)
      Toast('删除成功')

      // 删一个重新渲染新列表
      context.dispatch('getprocart')
    },
    async changecount (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj
      // 先本地修改 再同步到后台
      // {goodId,goodsNum}要用的传过去
      context.commit('countmutations', { goodsId, goodsNum })
      // 再同步到后台
      await getcount(goodsId, goodsNum, goodsSkuId)
    }
  },
  // getters必须得第一个参数  state
  getters: {
    // 全部商品 reduce
    countTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },

    // 要买的 打钩了的商品 筛选 filter 函数 不要写成boolen
    Choose (state) {
      return state.cartList.filter(item => item.isCheck)
    },

    // 打钩的商品一共几件 用到上一个getters方法 去vuex官方文档里面查 可以用
    selTotal (state, getters) {
      return getters.Choose.reduce((sum, item) => {
        return sum + item.goods_num
      }, 0)
    },

    // 选中的价格合计
    selprice (state, getters) {
      return getters.Choose.reduce((sum, item) => {
        return sum + item.goods.goods_price_min * item.goods_num
      }, 0).toFixed(2)
    },

    // 全选
    allcheck (state) {
      // every返回的是boolean
      return state.cartList.every(item => item.isCheck)
    }
  }
}
