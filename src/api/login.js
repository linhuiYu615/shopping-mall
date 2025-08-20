// 来存放所有接口请求 并且导出
import request from '@/utils/request'

// login的图形验证码请求
// 必须！！ 必须要return返回 必须
export const getPic = () => {
  return request.get('/captcha/image')
}

// 短信验证码
export const getmsg = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}
// 登录 后端查询能不能登录
export const logincome = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      // 不是第三方登录
      isParty: false,
      // 不是第三方登录 所以也没有对象信息
      partyData: {},
      mobile,
      // 短信验证码
      smsCode
    }
  })
}
