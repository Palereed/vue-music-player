<template>
  <div class="search">
    <div class="searchbox-wrapper">
      <searchbox ref="searchbox" @query="onQueryChange"></searchbox>
    </div>
    <div class="showcontent-wrapper" v-show="!query">
      <div class="hotkey-wrapper">
        <p class="title">热门搜索</p>
        <ul>
          <li class="item" v-for="(item,index) in hotkeyList" :key="item.id" @click="addQuery(item.first,index)" :class="{'active': index === whichKey}">
            <span>{{item.first}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Searchbox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
export default {
  data() {
    return {
      hotkeyList: [],
      whichKey: 0,
      query: ''
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkeyList = res.result.hots
        }
      })
    },
    addQuery(query,idx) {
      this.$refs.searchbox.setQuery(query)
      this.whichKey = idx
    },
    onQueryChange(query) {
      this.query = query
    }
  },
  components: {
    Searchbox,
    Suggest
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .search
    .searchbox-wrapper
      margin: 20px
    .showcontent-wrapper
      position: fixed
      top: 3.32rem
      bottom: 0
      width: 100%
      .hotkey-wrapper
        margin: 0 .4rem .4rem .4rem
        font-size: 0
        .title
          margin-bottom: .4rem
          color: $color-text-l
          font-size: $font-size-medium
        .item
          display: inline-block
          padding: .1rem .2rem
          margin: 0 .3rem .2rem 0
          border-radius: .12rem
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-medium
          border: 1px $color-highlight-background solid
          &.active
            color: $color-theme
            border: 1px $color-theme solid
      // .search-history
      //   position: relative
      //   margin: 0 .4rem
      //   .title
      //     display: flex
      //     align-items: center
      //     height: .8rem
      //     font-size: $font-size-medium
      //     color: $color-text-l
      //     .text
      //       flex: 1
      //     .clear
      //       extend-click()
      //       .icon-clear
      //         font-size: $font-size-medium
      //         color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 3.32rem
      bottom: 0
</style>