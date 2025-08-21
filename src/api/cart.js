import request from '@/utils/request'

export const getcart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    // 这个是分类商品id  比如红色的袜子 黑色的袜子 蓝色的袜子
    goodsSkuId

    // 我这边没写header 可以写 但是立即购买也要用 所以直接放在request拦截器里面了
  })
}
