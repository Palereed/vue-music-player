<template>
  <div id="app">
    <v-header></v-header>
    <div class="nav">
      <router-link to="/recommend" class="nav-item">
        <span class="nav-link">推荐</span>
      </router-link>
      <router-link to="/singer" class="nav-item">
        <span class="nav-link">歌手</span>
      </router-link>
      <router-link to="/rank" class="nav-item">
        <span class="nav-link">排行</span>
      </router-link>
      <router-link to="/search" class="nav-item">
        <span class="nav-link">搜索</span>
      </router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import VHeader from 'components/v-header/v-header'
import Player from 'components/player/player'
export default {
  components: {
    VHeader,
    Player
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .nav
    display: flex
    font-size: $font-size-medium
    height: 0.88rem
    line-height: 0.88rem
    .nav-item
      flex: 1
      text-align: center
      .nav-link
        color: $color-text-l
        padding-bottom: 0.15rem
      &.active
        .nav-link
          color: $color-theme
          position: relative
          &:after
            content: ''
            position: absolute
            bottom: 0
            left: 0
            width: 100%
            height: 0.04rem
            background: $color-theme
            border-radius: 0.02rem
</style>