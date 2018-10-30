<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input v-model="query" :placeholder="placeholder" class="box" type="text"/>
    <i v-show="query" class="icon-dismiss" @click="clearQuery"></i>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data () {
    return {
      query: '11'
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索推荐 歌手'
    }
  },
  computed: {
    
  },
  methods: {
    clearQuery() {
      this.query = ''
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 .12rem
    height: .8rem
    background: $color-highlight-background
    border-radius: .12rem
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 .1rem
      line-height: .36rem
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      border: none
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>