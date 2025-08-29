import request from '@/utils/request'

export const submitOrder = (mode, params) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 配送方式：10 快递 20 自提
    couponId: 0, // 优惠券
    payType: 10, // 余额支付
    isUsePoints: 0, // 不用积分
    ...params // <-- 这里会把 addressId、shopId、cartIds 或 goodsId/goodsSkuId/goodsNum 都展开
  })
}

/** 结算预览（检查余额、可用优惠等）
 *  - cart 模式: 传 { cartIds }
 *  - buyNow 模式: 传 { goodsId, goodsSkuId, goodsNum }
 */
export const checkOrder = (mode, params = {}) => {
  return request.get('/checkout/order', {
    params: {
      mode,
      delivery: 0,
      couponId: 0,
      isUsePoints: 0,
      ...params
    }
  })
}

// 订单列表
export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
