<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="song-item">
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
      default: []
    }
  },
  methods: {
    getDesc(song) {
      return `${song.name} ▪ ${song.album}`
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
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