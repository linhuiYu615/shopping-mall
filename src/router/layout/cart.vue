<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />
    <div v-if="isLoading && cartList.length > 0">
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all"
          >共<i>{{ countTotal }}</i
          >件商品</span
        >
        <span class="edit">
          <van-icon @click="Edit = !Edit" name="edit">编辑</van-icon>
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
          <!-- 不要用v-model 因为v-model是双向绑定 state的参数是不允许外界修改的 只允许mutation改 -->
          <van-checkbox
            :value="item.isCheck"
            @click="check(item.goods_id)"
          ></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="" />
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
            <span class="bottom">
              <div class="price">
                ¥ <span>{{ item.goods.goods_price_min }}</span>
              </div>
              <!-- 保留原本的num 同时也要 外界传过来的 goodsid skuid 用箭头函数 value是num -->
              <CountBox
  :value="item.goods_num"
  @input="value => handlecount(item.goods_id, item.goods_sku_id, value)"
/>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div @click="all" class="all-check">
          <van-checkbox :value="allcheck" icon-size="18"></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div class="price">
            <span>合计：</span>
            <span
              >¥ <i class="totalPrice">{{ selprice }}</i></span
            >
          </div>
          <!-- 没有选中商品就不要高亮 css里面写了样式的 叫disabled -->
          <div v-if="!Edit" @click="toPay" class="goPay" :class="{ disabled: selTotal === 0 }">
            结算({{ selTotal }})
          </div>
          <div
            v-else
            @click="handle"
            class="delete"
            :class="{ disabled: selTotal === 0 }"
          >
            删除
          </div>
        </div>
      </div>
    </div>
    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="" />
      <div class="tips">您的购物车是空的, 快去逛逛吧</div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>
  </div>
</template>

<script>
import CountBox from '@/components/CountBoxs.vue'
// import { turn } from 'core-js/core/array'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'CartPage',
  data () {
    return {
      Edit: false
    }
  },
  components: {
    CountBox
  },
  computed: {
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', ['countTotal', 'Choose', 'allcheck', 'selTotal', 'selprice'])
  },
  methods: {
    check (id) {
      this.$store.commit('cart/check', id)
    },
    all () {
      this.$store.commit('cart/all', !this.allcheck)
    },
    async handle () {
      // 没有选择的 就返回
      if (this.selTotal === 0) return
      // mutation/action 不会「挂」到任何 this.xxx this.$store.check也不行 只能用mapmutations去印设
      // if (this.check === 0) return

      // 我这边没传id id我从actions里面有map传了
      this.$store.dispatch('cart/deletepro')
      // 全删完了 变成暗的结算页面
      this.Edit = false
    },
    isLoading () {
      return this.$store.getters.token
    },
    toPay () {
      if (this.selTotal === 0) return
      const ids = this.Choose.map(i => i.goods_id).join(',')
      this.$router.push({ path: '/pay', query: { ids } })
    },
    handlecount (goodsId, goodsSkuId, goodsNum) {
      this.$store.dispatch('cart/changecount', {
        goodsId,
        goodsNum, // ← 现在是真正的数量
        goodsSkuId
      })
    }
  },
  created () {
    // 有登录才有购物车 this.isLoading()是方法
    if (this.isLoading()) {
      // 调用actions dispatch
      this.$store.dispatch('cart/getprocart')
    }
  },
  // 点击编辑出现删除页面 取消所有选中 观察到页面变成删除
  // watch两个参数 一个新（监听后最新的值） 一个旧 两个都可以省略 取决于你想不想要新旧值
  watch: {
    Edit (newValue) {
      // console.log(newValue) true false
      this.$store.commit('cart/all', !newValue)
    }
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay,
    .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }
}

.empty-cart {
  padding: 80px 30px;
  img {
    width: 140px;
    height: 92px;
    display: block;
    margin: 0 auto;
  }
  .tips {
    text-align: center;
    color: #666;
    margin: 30px;
  }
  .btn {
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #fa2c20;
    border-radius: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>
