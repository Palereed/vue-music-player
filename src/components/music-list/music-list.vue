<template>
  <div class="music-list">
    <div class="back" @click="returnSinger">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" ref="title">{{title}}</h1>
    <div class="singer-avatar" :style="avatarStyle" ref="avatar">
      <!-- 模糊层 -->
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper" ref="playwrapper" @click="random">
        <div class="play" v-show="songs.length > 0">
          <i class="icon-play"></i>
          <span class="text">随机播放全部音乐</span>
        </div>
      </div>
    </div>
    <div class="avatar-layer" ref="layer"></div>
    <scroll :data="songs" :probe-type="probeType" :is-listen="isListen" @scroll="scroll" class="songlist-wrapper" ref="songlistwrapper">
      <songlist :songs="songs" @select="selectItem"></songlist>
    </scroll>
    <div v-show="!songs.length" class="loading-wrapper">
      <loading></loading>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Songlist from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
import { playListMinxin } from 'common/js/mixin'
export default {
  mixins: [playListMinxin],
  data() {
    return {
      scrollY: 0
    }
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  created() {
    this.probeType = 3
    this.isListen = true
  },
  computed: {
    avatarStyle() {
      return `background-image: url(${this.avatar})`
    }
  },
  mounted() {
    // 因为图片padding: 70%，被占位了，因此在图片加载之前就可以得到高度了。
    this.avatarHeight = this.$refs.avatar.clientHeight
    this.titleHeight = this.$refs.title.clientHeight
    this.maxTranslate = -this.avatarHeight + this.titleHeight
    this.$refs.songlistwrapper.$el.style.top = `${this.avatarHeight}px`
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '1.2rem' : 0
      this.$refs.songlistwrapper.$el.style.bottom = `${bottom}`
      this.$refs.songlistwrapper.refresh()
    },
    returnSinger() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.maxTranslate, newY)
      let zIndex = 0
      let scale = 1
      let blur = 20
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      let percent = Math.abs(newY / this.avatarHeight)
      if (newY > 0) {
        scale = 1 + percent
      } else {
        blur = Math.min(blur * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      if (newY < this.maxTranslate) {
        zIndex = 10
        this.$refs.avatar.style.paddingTop = 0
        this.$refs.avatar.style.height = `${this.titleHeight}px`
        this.$refs.playwrapper.style.display = 'none'
      } else {
        zIndex = 0
        this.$refs.avatar.style.paddingTop = '70%'
        this.$refs.avatar.style.height = 0
        this.$refs.playwrapper.style.display = 'block'
      }
      this.$refs.avatar.style.zIndex = zIndex
      // 下拉歌手图片放大
      this.$refs.avatar.style[transform] = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    Songlist,
    Loading
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 0.06rem
      z-index: 50
      .icon-back
        display: block
        padding: 0.2rem
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 0
      width: 100%
      font-size: $font-size-large
      text-align: center
      z-index: 40
      line-height: 0.84rem
      color: $color-theme
    .singer-avatar
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      // 从顶部开始放大而非整体放大
      transform-origin: top
      background-size: cover
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .play-wrapper
        position: absolute
        bottom: 0.4rem
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 2.7rem
          padding: 0.14rem 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 4rem
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 0.12rem
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .avatar-layer
      position: relative
      height: 100%
      background: $color-background
    .songlist-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      width: 100%
    .loading-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
</style>