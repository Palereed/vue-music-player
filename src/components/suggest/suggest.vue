<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in suggest" :key="item.id">
        <div class="icon">
          <i :class="searchType[item.idx]"></i>
          <p class="type">{{item.type}}</p>
        </div>
        <ul class="type-list">
          <li v-for="child in item.list" :key="child.id">{{child.name}}-{{singerName(child)}}</li>
        </ul>
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
    }
  },
  created () {
    this.searchType = ['icon-mine','icon-music','icon-cd','icon-film','icon-playlist']
  },
  computed: {
    
  },
  methods: {
    search() {
      // 清空query时不请求
      if (!this.query) {
        return
      }
      getSuggest(this.query).then(res => {
        if (res.code === ERR_OK) {
          this.suggest = this.formatData(res.result)
          console.log(this.suggest)
        }
      })
    },
    formatData(data) {
      let ret = []
      let type = ''
      let idx = 0
      for (var key in data) {
        if (key === "order") {
          continue
        }
        switch (key) {
          case 'artists': 
            type = '歌手'
            idx = 0
          break;
          case 'songs': 
            type = '单曲'
            idx = 1
          break;
          case 'albums': 
            type = '专辑'
            idx = 2
          break;
          case 'mvs': 
            type = '视频'
            idx = 3
          break;
          case 'playlists': 
            type = '歌单'
            idx = 4
          break;
        }
        let item = {
          key,
          idx,
          type,
          list: data[key]
        }
        ret.splice(item.idx, 0, item)
      }
      return ret
    },
    singerName(child) {
      if (child.artists) {
        return child.artists[0].name
      }
      
      //return child.artists[0].name
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
      .icon
        display: flex
        width: 100%
        font-size: $font-size-medium
        color: $color-theme
        height: .6rem
        align-items: center
        i
          margin-right: .2rem
        .type
          flex: 1
          font-size: $font-size-medium
      .type-list
        font-size: $font-size-medium
        color: $color-text-d
        padding-left: .48rem
        li
          height: .6rem
          line-height: .6rem
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>