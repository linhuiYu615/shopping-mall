import axios from 'axios'
import { Toast } from 'vant'
// https://apifox.com/apidoc/shared-12ab6b18-adc2-444c-ad11-0e60f5693f66/doc-2221080
// 创建axios实例 对创建出来的实例进行自定义配置 不会污染原始axios实例
const instance = axios.create({
  // 接口换
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: { platform: 'H5' }
})

// 自定义配置 -请求/响应 拦截器
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner'
    })
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    Toast.clear()
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么 (.data 因为数据层级太深不好处理，所以我直接在响应拦截器处理了 )
    // 在这边拦截 res.status只有两百才往下走 没有两百
    const res = response.data
    // console.log(res)
    // 提醒用户输入的不对
    if (res.status !== 200) {
      Toast('图形验证码输入错误')
      // 用promise.reject方法进行手动拦截
      return Promise.reject(new Error('图形验证码输入错误'))
    }
    return res
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 导出 新的实例
export default instance
