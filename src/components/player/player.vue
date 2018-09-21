<template>
  <div class="player" v-show="playList.length>0">
    <transition name="full" @enter="enter" @afterEnter="afterEnter" @leave="leave" @afterLeave="afterLeave">
      <div class="full-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top-wrap">
          <div class="back" @click="mini">
            <i class="icon-back"></i>
          </div>
          <h1 class="song-name">{{currentSong.name}}</h1>
          <h2 class="singer-name">{{currentSong.singer}}</h2>
        </div>
        <div class="middle-wrap">
          <div class="middle-l">
            <div class="cd-wrap" ref="cdWrap">
              <div class="cd">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div> 
        </div>
        <div class="bottom-wrap">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i class="icon-play"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-like"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="full" ref="miniPlayer">
        <div class="icon">
          <img :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="song-name">{{currentSong.name}}</h2>
          <p class="singer-name">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
export default {
  mounted() {
    // 第一次弹出full，避免mini显示又隐藏。
    this.$refs.miniPlayer.style.display = 'none'
  },
  computed: {
    ...mapGetters(['fullScreen', 'playList', 'currentSong'])
  },
  methods: {
    mini() {
      this.setFullScreen(false)
    },
    full() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosandScale()
      const points = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation: points,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrap, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrap.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrap.style.transition = "all 0.4s"
      const { x, y, scale } = this._getPosandScale()
      this.$refs.cdWrap.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrap.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrap.style.transition = ''
      this.$refs.cdWrap.style[transform] = ''
    },
    _getPosandScale() {
      const cdWrapRect = this.$refs.cdWrap.getBoundingClientRect()
      // mini图片与full的比例，因为rem适配，并且获取不到mini的dom，因此按比例算。
      const percent = 1 / 6 * 0.8
      const windoWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const x = -(windoWidth / 2 - cdWrapRect.width * percent)
      const y = windowHeight - cdWrapRect.top - cdWrapRect.height / 2 - cdWrapRect.width * percent * 1.5 / 2
      const scale = percent
      return { x, y, scale }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .full-player
      position: fixed
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top-wrap
        position: relative
        margin-bottom: 0.25rem
        .back
          position absolute
          top: 0
          left: 0.06rem
          z-index: 50
          .icon-back
            display: block
            padding: 0.18rem
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .song-name
          width: 70%
          margin: 0 auto
          line-height: 0.8rem
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .singer-name
          line-height: 0.4rem
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle-wrap
        position: fixed
        width: 100%
        top: 1.6rem
        bottom: 3.4rem
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrap
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 0.2rem solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .image
                width: 100%
                height: 100%
                border-radius: 50%
      .bottom-wrap
        position: absolute
        bottom: 1rem
        width: 100%     
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 0.6rem
          .i-left
            text-align: right
          .i-center
            padding: 0 0.4rem
            text-align: center
            i
              font-size: 0.8rem
          .i-right
            text-align: left
          .icon-like
            color: $color-sub-theme
      &.full-enter-active,&.full-leave-active
        transition: all 0.4s
        .top-wrap,.bottom-wrap
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.full-enter,&.full-leave-to
        opacity: 0
        .top-wrap
          transform: translate3d(0, -100px, 0)
        .bottom-wrap
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 1.2rem
      background: $color-highlight-background
      transform: translate3d(0, 0, 0)
      .icon
        flex: 0 0 0.8rem
        width: 0.8rem
        height 0.8rem
        padding: 0 0.2rem 0 0.4rem
        img
          display: block
          width: 100%
          height: 100%
          border-radius: 50%
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 0.4rem
        overflow: hidden
        .song-name
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .singer-name
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 0.6rem
        width: 0.6rem
        height: 0.6rem
        padding: 0 0.2rem
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          display: block
          font-size: 0.6rem
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
      &.mini-enter-active,&.mini-leave-active
        transition: 0.4s
      &.mini-enter,&.mini-leave-to
        transform: translate3d(0, 1.2rem, 0)
</style>