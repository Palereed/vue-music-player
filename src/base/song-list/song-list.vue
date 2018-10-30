<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="song-item" :key="song.id">
        <div class="rank-icon" v-show="rank">
          <span :class="iconIndex(index)">{{iconTxt(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.name} ▪ ${song.album}`
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    iconIndex(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    iconTxt(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .song-list
    padding-top: 0.2rem
    .song-item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 1.28rem
      padding: 0 0.6rem
      font-size: $font-size-medium
      .rank-icon
        flex: .5rem 0 0
        width: .5rem
        margin-right: .6rem
        text-align: center
        .icon
          display: inline-block
          width: .5rem
          height: .48rem
          background-size: .5rem .48rem
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 0.4rem
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>