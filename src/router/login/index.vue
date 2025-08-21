<template>
  <div class="login">
    <!-- 头部 -->
    <van-nav-bar
      title="会员登录"
      left-text
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 主体 -->
    <div class="content">
      <h1>手机号登录</h1>
      <span>未注册的手机号登录后将自动注册</span>
      <div class="from">
        <div class="from-item">
          <input
            class="inp"
            v-model="mobile"
            maxlength="11"
            placeholder="请输入手机号"
            type="text"
          />
        </div>
        <hr />
        <div class="from-item">
          <input
            v-model="code"
            class="inp"
            maxlength="4"
            placeholder="请输入图形验证码"
            type="text"
          />
          <img v-if="url" @click="getlogin" :src="url" alt="" />
        </div>
        <hr />
        <div class="from-item">
          <input
            class="inp"
            maxlength="6"
            placeholder="请输入短信验证码"
            type="text"
            v-model="msgcode"
          />
          <button ref="btn" @click="getcode">获取验证码</button>
        </div>
        <hr />
      </div>
      <button @click="login" class="get">登录</button>
    </div>
  </div>
</template>

<script>
import { getPic, getmsg, logincome } from '@/api/login'
import { Toast } from 'vant'
import '@/store/modules/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      code: '',
      key: '',
      url: '',
      seacond: 10,
      timeid: null,
      mobile: '',
      msgcode: ''
    }
  },
  created () {
    this.getlogin()
  },
  methods: {
    async getlogin () {
      const {
        data: { base64, key }
      } = await getPic()
      // console.log(base64, key)
      this.key = key
      this.url = base64
    },

    // 点击获取验证码之前 先判断手机号和图形验证码是否合规 封装个方法
    test () {
      // test测试输入的手机号是否满足手机号的正则 不符合false 符合true
      // 别忘了 这个是不正确有弹窗 然后拦住 前面有感叹号
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        Toast('请输入正确手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.code)) {
        Toast('请输入正确的图形验证码')
        return false
      }
      return true
    },

    // 这边开始获取短信验证码
    async getcode () {
      // 先判断上面的test是否成功 成功往下开启定时器 不成功返回
      if (!this.test()) return
      // 判断之前的timeid有没有完成 不可以重复点击
      if (!this.timeid) {
        // 这个判断之前去拦截 如果之前图形验证码是错的 就不要往下走了 不用发短信验证码了 我们去实例里面拦截

        // 请求后端接口发送短信验证码 发送完请求开始倒计时
        await getmsg(this.code, this.key, this.mobile)
        // 每次都从新开始
        this.seacond = 3
        // 开始少一秒
        // this.$refs.btn.innerHTML = `${this.seacond}秒后重新获取`
        this.timeid = setInterval(() => {
          // 页面离开需要销毁定时器 可以搞一个log去看是否销毁成功
          console.log('111')
          this.$refs.btn.innerHTML = `${this.seacond}秒后重新获取`
          this.seacond--
          if (this.seacond < 0) {
            clearInterval(this.timeid)
            // 定时器结束后清空 才能开始第二次定时
            this.timeid = null
            this.$refs.btn.innerHTML = '获取验证码'
          }
        }, 1000)
        Toast('已发送验证码')
      }
    },
    async login () {
      // 先判断之前写的信息 手机号 图形验证码和短信验证码
      if (!this.test()) return
      if (!/^\d{4,6}$/.test(this.msgcode)) {
        Toast('请输入正确的短信验证码')
        return
      }
      const res = await logincome(this.mobile, this.msgcode)
      this.$store.commit('user/saveUser', res.data)
      Toast('登录成功')
      // 登录后不一定去主页 也可能是登录后去付钱 做判断 如果说上一个页面是产品那边跳过来的 登录完回去
      const url = this.$route.query.backUrl || '/home'
      this.$router.replace(url)
    }
  },
  // 页面离开需要销毁定时器 可以搞一个log去看是否销毁成功
  destroyed () {
    clearInterval(this.timeid)
  }
}
</script>

<style lang="less" scoped>
.content {
  margin: 30px;
  h1 {
    margin: 7px 0;
    font-weight: 400;
  }
  span {
    // span是行内 mb不生效 改display
    display: inline-block;
    color: #686565;
    margin-bottom: 38px;
  }
  .from-item {
    display: flex;
    width: 315px;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  .from-item .inp {
    border: none;
    height: 50px;
    flex: 1;
  }
  .from-item .inp::placeholder {
    color: purple;
    font-size: 14px;
  }
  .from-item img {
    width: 100px;
    height: 30px;
  }
  hr {
    height: 1px;
    width: 100%;
    color: black;
  }
  .from-item button {
    border: none;
    background-color: #fff;
    color: rgb(226, 154, 19);
    font-size: 14px;
  }
  .get {
    width: 100%;
    height: 45px;
    background-color: rgb(226, 154, 19);
    margin-top: 30px;
    border: none;
    border-radius: 50px;
    color: #fff;
  }
}
</style>
