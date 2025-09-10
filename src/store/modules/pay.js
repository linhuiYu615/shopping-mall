// store/pay.js
export default {
  namespaced: true,
  state: () => ({ list: [] }),

  mutations: {
    SET (state, arr) {
      state.list = arr
    }
  }
}
