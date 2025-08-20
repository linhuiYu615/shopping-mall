import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/router/login'
import layout from '@/router/layout'
import search from '@/router/search'
import list from './search/list.vue'
import prodetail from '@/router/prodetail'
import pay from '@/router/pay'
import order from '@/router/order'
import home from './layout/home.vue'
import category from './layout/category.vue'
import cart from './layout/cart.vue'
import user from './layout/user.vue'
import store from '@/store'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: login },
    {
      path: '/',
      component: layout,
      redirect: '/home',
      children: [
        { path: '/home', component: home },
        { path: '/category', component: category },
        { path: '/cart', component: cart },
        { path: '/user', component: user }
      ]
    },
    { path: '/search', component: search },
    { path: '/list', component: list },
    // 商品详情需要靠id来确认是哪个商品 所以动态路由传入id
    { path: '/prodetail/:id', component: prodetail },
    { path: '/pay', component: pay },
    { path: '/order', component: order }
  ]
})

// beforeeach判断能否能到下一个页面 比如pay order
// 定义一个需要登录才能访问的页面数组
const authUrls = ['/pay', '/order']

// to要去的页面
// from从哪个页面去
// next是跳转方法
// next() 成功跳转到to的页面
// next(路径) 跳转去括号内的路径
// to.path就是这次要去的路由地址字符串，每次导航都会有，没什么默认跳转
router.beforeEach((to, from, next) => {
// 有些网页需要跳转 有些页面不用  不包含在里面 让他跳转
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  // 在跳转的页面中去判断你有没有登录 登陆过的都存在本地而且响应式了 可以用存储的token和userid 有就说明登录 没有就说明没登录去登录
  // token由服务端颁发且登出就失效，能唯一证明当前登录态；userid只是账号标识，没法判定是否已登录；
  // 这边封装到store方法里面是为了集中复用而且逻辑清晰(写到全局的store)
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
