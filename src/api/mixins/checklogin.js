import { Dialog } from 'vant'
export default {
  methods: {
    checkLogin () {
      if (!this.$store.getters.token) {
        Dialog.confirm({
          title: '提示',
          message: '接下来要登录才能继续',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        }).then(() => {
          this.$router.replace({
            path: '/login',
            query: { backUrl: this.$route.fullPath }
          })
        }).catch(() => {})
        return false
      }
      return true
    }
  }
}
