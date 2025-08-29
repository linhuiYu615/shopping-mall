<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址 -->
    <div class="address" @click="onAddressClick">
      <div class="left-icon"><van-icon name="logistics" /></div>
      <div class="info" v-if="addressList.length > 0">
        <div class="info-content">
          <span class="name">{{ selectAddress.name }}</span>
          <span class="mobile">{{ selectAddress.phone }}</span>
        </div>
        <div class="info-address">{{ longAddress }}</div>
      </div>
      <div class="info" v-else>请选择配送地址</div>
      <div class="right-icon"><van-icon name="arrow" /></div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list">
        <div class="goods-item" v-for="p in list" :key="p.goods_id">
          <div class="left"><img :src="p.goods_image" /></div>
          <div class="right">
            <p class="tit text-ellipsis-2">{{ p.goods_name }}</p>
            <p class="info">
              <span class="count">x{{ p.qty }}</span>
              <span class="price">¥{{ (p.price * p.qty).toFixed(2) }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{ itemCount }} 件商品，合计：</span>
        <span class="money">￥{{ total.toFixed(2) }}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{ total.toFixed(2) }}</span>
        </div>
        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>
        <div class="pay-cell">
          <span>配送费用：</span>
          <span class="red">+￥0.00</span>
        </div>
      </div>

      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span>
            <van-icon name="balance-o" />
            余额支付（可用 ¥ {{ availableBalance.toFixed(2) }} 元）
          </span>
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <div class="buytips">
        <textarea
          v-model="remark"
          placeholder="选填：买家留言（50字内）"
        ></textarea>
      </div>
    </div>

    <div class="footer-fixed">
      <div class="left">
        实付款：<span>￥{{ total.toFixed(2) }}</span>
      </div>
      <div class="tipsbtn" @click="submitOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
import { getAddress } from '@/api/pay'
import { submitOrder, checkOrder } from '@/api/order'

export default {
  name: 'PayIndex',
  data () {
    return {
      addressList: [],
      list: [],
      remark: '',
      mode: '',
      availableBalance: 0
    }
  },
  computed: {
    // 第一个地址，无论真假
    selectAddress () {
      // 取第一条，永远有
      return this.addressList[0]
    },
    longAddress () {
      const r = this.selectAddress.region
      return `${r.province}${r.city}${r.region}${this.selectAddress.detail}`
    },
    itemCount () {
      return this.list.reduce((sum, p) => sum + p.qty, 0)
    },
    total () {
      return this.list.reduce((sum, p) => sum + p.price * p.qty, 0)
    }
  },
  async created () {
    const q = this.$route.query

    // 1️⃣ 准备商品列表（cart 或 buyNow）
    if (q.mode === 'buyNow') {
      this.mode = 'buyNow'
      this.list = (this.$store.state.pay.list || []).map(p => ({
        ...p, price: p.price * 1
      }))
    } else {
      this.mode = 'cart'
      const ids = (q.ids || '').split(',').filter(Boolean)
      this.list = this.$store.state.cart.cartList
        .filter(i => ids.includes(String(i.goods_id)))
        .map(i => ({
          goods_id: i.goods_id,
          goods_sku_id: i.goods_sku_id,
          goods_image: i.goods.goods_image,
          goods_name: i.goods.goods_name,
          price: i.goods.goods_price_min * 1,
          qty: i.goods_num
        }))
    }

    // 1. 取地址
    const { data: { list } } = await getAddress()

    if (Array.isArray(list) && list.length > 0) {
      this.addressList = list
    } else {
      // 硬编码一条假地址兜底
      this.addressList = [{
        address_id: 0,
        name: '测试用户',
        phone: '13800000000',
        region: { province: '测试省', city: '测试市', region: '测试区' },
        detail: '测试路 123 号'
      }]
    }

    // 4️⃣ 再去拿可用余额
    await this.money()
  },
  methods: {
    async money () {
      try {
        // 根据结算模式和必要参数调用 checkOrder
        let params = {}
        if (this.mode === 'cart') {
          params = { cartIds: this.$route.query.ids || '' }
        } else {
          const first = this.list[0] || {}
          params = {
            goodsId: first.goods_id,
            goodsSkuId: first.goods_sku_id || '',
            goodsNum: first.qty || 1
          }
        }

        const res = await checkOrder(this.mode, params)

        // 取真实路径：后端放在 res.data.personal.balance
        this.availableBalance = Number(res.data.personal.balance) || 0
      } catch {
        this.availableBalance = 0
      }
    },

    async submitOrder () {
      // 把 addressId 带上
      const payload = {
        remark: this.remark,
        addressId: this.selectAddress.address_id
      }

      if (this.mode === 'cart') {
        payload.cartIds = this.$route.query.ids || ''
      } else {
        const first = this.list[0] || {}
        payload.goodsId = Number(this.$route.query.goodsId || first.goods_id || 0)
        payload.goodsSkuId = this.$route.query.goodsSkuId || first.goods_sku_id || ''
        payload.goodsNum = Number(this.$route.query.goodsNum || first.qty || 1)
      }

      try {
        await submitOrder(this.mode, payload)
        this.$toast.success('支付成功')
        this.$router.replace('/order')
      } catch (err) {
        this.$toast.fail(err.message || '下单失败')
      }
    },

    // 点击地址可以改成跳地址页或不做任何事，这里先空壳
    onAddressClick () {
      this.$toast('走地址选择流程')
    }
  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>
