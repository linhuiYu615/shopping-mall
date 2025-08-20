<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search v-model="search" show-action placeholder="请输入搜索关键词" clearable>
      <template #action>
        <div @click="gosearch(search)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history">
      <div class="title">
        <span>最近搜索</span>
        <van-icon @click="clear" name="delete-o" size="16" />
      </div>
      <div class="list" v-if="histroy.length">
        <div class="list-item" v-for="item in histroy" :key="item"
        @click="gosearch(item)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { gethistory, sethistory } from '@/utils/stroage'

export default {
  name: 'SearchIndex',
  data () {
    return {
      search: '',
      histroy: gethistory()
    }
  },
  methods: {
    gosearch (val) {
      // 用索引找到 如果有一样的 删掉 弄到前面
      const index = this.histroy.indexOf(val)
      // 不等于-1 说明找到了一样的
      if (index !== -1) {
        // 删掉 splice 从哪删 删几个
        this.histroy.splice(index, 1)
      }
      // 添加
      this.histroy.unshift(val)
      sethistory(this.histroy)
      this.$router.push(`/list?search=${val}`)
    },
    clear () {
      this.histroy = []
      sethistory([])
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 30%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>
