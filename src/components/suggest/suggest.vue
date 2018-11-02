<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in suggest" :key="item.id">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{111}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
import { getSuggest } from 'api/search'
import { ERR_OK } from 'api/config'
export default {
  data() {
    return {
      suggest: []
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 30
    },
    offset: {
      type: Number,
      default: 1
    },
    type: {
      type: Number,
      default: 1
    }
  },
  methods: {
    search() {
      // 清空query时不请求
      if (!this.query) {
        return
      }
      getSuggest(this.query).then(res => {
        if (res.code === ERR_OK) {
          this.suggest = res.result
          console.log(this.suggest)
        }
      })
    }
  },
  watch: {
    query() {
      this.search()
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 .6rem
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: .4rem
      .icon
        flex: 0 0 .6rem
        width: .6rem
        font-size: $font-size-medium
        color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>