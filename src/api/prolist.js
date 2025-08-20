import request from '@/utils/request'

// obj是为了简化代码 本来要写 a=4 现在写a就行了 你的参数多就越方便 只需要给obj解构即可
export const getprolist = (obj) => {
  const { categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}

export const getdetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

/* 我要 图片渲染 用空数组list
详情 因为有标签 v-HTML
要传入list的id  冒号所以是pamars 用计算属性和路由去获取
页面分装成一个方法 因为加入购物车和付钱都要用 */

// 评论
export const getprocomment = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}
