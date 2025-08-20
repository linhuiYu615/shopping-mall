<template>
  <div class="countBox">
    <button @click="handlesub" class="sub">-</button>
    <input :value="value" @change="handlechange" class="inp" type="text">
    <button @click="handleadd" class="add">+</button>
  </div>
</template>

<script>
export default {
  name: 'countBox',
  props: {
    value: {
      type: Number,
      default: 1
    },
    stock: {
      type: Number
    }
  },
  methods: {
    handlesub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleadd () {
      if (this.value >= this.stock) {
        return
      }
      this.$emit('input', this.value + 1)
    },
    handlechange (e) {
      // console.log(e.target.value)
      const num = +e.target.value

      // 去判断num 不能是nan也不能是负数 否则改之前的值
      if (isNaN(num) || num < 1) {
        // 常量不可以被重新赋值
        // num = this.value
        e.target.value = this.value
        return
      }

      // value需要加this 因为它是props传过来的 他被绑在实例上面 比如data methods computed里面都要this
      // num是函数定义的 是局部变量 不用this  可以理解为你去餐厅 菜单上的菜要this 但是num是临时的订单号 不用this

      // 没问题的话 就直接传过去
      this.$emit('input', num)
    }
  }
}
</script>

<style lang="less" scoped>
.countBox {
  width: 110px;
  display: flex;
  .sub, .add {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    height: 30px;
    margin: 0 5px;
    outline: none;
    border: none;
    background-color: #efefef;
    text-align: center;
  }
}

</style>
