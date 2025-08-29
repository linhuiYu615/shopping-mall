/* src/router/index.js */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// ======== 页面组件 ========
import Login from '@/router/login'
import Layout from '@/router/layout'
import Search from '@/router/search'
import List from '@/router/search/list.vue'
import ProDetail from '@/router/prodetail'
import Pay from '@/router/pay'
import Order from '@/router/order'

// 二级 tab
import Home from '@/router/layout/home.vue'
import Category from '@/router/layout/category.vue'
import Cart from '@/router/layout/cart.vue'
import User from '@/router/layout/user.vue'

Vue.use(VueRouter)

/* 统一给 push/replace 打补丁 —— 避免重复导航报错 */
const originPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location, onResolve, onReject) {
  if (onResolve || onReject) return originPush.call(this, location, onResolve, onReject)
  return originPush.call(this, location).catch(() => {}) // ← 吞掉 NavigationDuplicated
}
VueRouter.prototype.replace = function (location, onResolve, onReject) {
  if (onResolve || onReject) return originPush.call(this, location, onResolve, onReject)
  return originPush.call(this, location).catch(() => {})
}

/* 路由表 */
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },

    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },

    { path: '/search', component: Search },
    { path: '/list', component: List },
    // 商品要传id
    { path: '/prodetail/:id', component: ProDetail },

    /* 下面两个需要登录，因此加 meta.requiresAuth */
    { path: '/pay', component: Pay, meta: { requiresAuth: true } },
    { path: '/order', component: Order, meta: { requiresAuth: true } }
  ]
})

/* 全局前置守卫：统一鉴权 */
router.beforeEach((to, from, next) => {
  // 不需要登录 -> 直接通行
  if (!to.meta.requiresAuth) return next()

  // 需要登录：检查 token
  const token = store.getters.token
  if (token) {
    next() // 有 token，放行
  } else {
    next('/login') // 无 token，跳登录
  }
})

export default router
