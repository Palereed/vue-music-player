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
        <div class="middle-wrap"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent='middleTouchMove'
             @touchend='middleTouchEnd'
             ref="middleWrapper">
          <div class="middle-l" ref="cdMiddle">
            <div class="cd-wrap" ref="cdWrap">
              <div class="cd" ref="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric">
              {{playingLyric}}
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrap">
              <div v-if="this.currentLyric" class="text">
                <ul>
                  <li v-for="(line, index) in this.currentLyric.lines" :class="{'current': currentLineNum === index}" ref="lyricLine" :key="line.id">{{line.txt}}</li>
                </ul>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom-wrap">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progressbar :percent="percent" @percentChange='onProgressBarChange'></progressbar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prevSong" ></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="nextSong"></i>
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
          <img :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="song-name">{{currentSong.name}}</h2>
          <p class="singer-name">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progresscircle :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop.prevent="togglePlaying"></i>
          </progresscircle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" @canplay="ready" @error="error" ref="audio" @timeupdate="timeUpdate" @ended="end"></audio>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import Progressbar from 'base/progress-bar/progress-bar'
import Progresscircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Scroll from 'base/scroll/scroll'
import Lyric from 'lyric-parser'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  mounted() {
    // 第一次弹出full，避免mini显示又隐藏。
    this.$refs.miniPlayer.style.display = 'none'
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    modeIcon() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  created() {
    this.touch = {}
  },
  methods: {
    onProgressBarChange(percent) {
      const currentTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      this.currentLyric.seek(currentTime * 1000)
    },
    changeMode() {
      const modeIndex = (this.mode + 1) % 3
      this.setPlayMode(modeIndex)
      let list = null
      if (modeIndex === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    togglePlaying() {
      this.setPlayState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    ready() {
      this.songReady = true
    },
    // 网络问题或别的原因歌曲未加载出来，保证按钮是可以使用的。
    error() {
      this.songReady = true
    },
    timeUpdate(e) {
      this.currentTime = e.target.currentTime
    },
    format(duration) {
      duration = duration | 0
      let minute = (duration / 60) | 0
      let second = duration % 60
      second < 10 ? (second = '0' + second) : second
      return `${minute}:${second}`
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    prevSong() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    nextSong() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
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
      this.$refs.cdWrap.style.transition = 'all 0.4s'
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
      const percent = (1 / 6) * 0.8
      const windoWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const x = -(windoWidth / 2 - cdWrapRect.width * percent)
      const y =
        windowHeight -
        cdWrapRect.top -
        cdWrapRect.height / 2 -
        (cdWrapRect.width * percent * 1.5) / 2
      const scale = percent
      return { x, y, scale }
    },
    getLyric() {
      this.currentSong.getSongLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 异常处理，无歌词情况
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 如果Y轴滑动大于X轴滑动，斜角滑动时，代表用户只是在滚歌词，不做切换处理。
      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(width / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px, 0, 0)`
      this.$refs.cdMiddle.style.opacity = 1 - this.touch.percent
      // 需要将动画时间，否则拖动时候会有卡顿
      this.$refs.lyricList.$el.style[transitionDuration] = '0s'
      this.$refs.cdMiddle.style[transitionDuration] = '0s'
    },
    middleTouchEnd() {
      let offsetwidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetwidth = -window.innerWidth
          this.currentShow = 'lyric'
          // 这里必须重置percent，否则会出现bug
          this.touch.percent = 1
          opacity = 0
        } else {
          offsetwidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetwidth = 0
          this.currentShow = 'cd'
          this.touch.percent = 0
          opacity = 1
        } else {
          offsetwidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = '0.3s'
      this.$refs.cdMiddle.style[transitionDuration] = '0.3s'
      this.$refs.cdMiddle.style.opacity = opacity
      this.touch.initiated = false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    Progressbar,
    Progresscircle,
    Scroll
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
        bottom: 4.05rem
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
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric
            margin: 0.6rem auto 0
            overflow: hidden
            text-align: center
            width: 80%
            height: 0.4rem
            line-height: 0.4rem
            font-size: $font-size-medium
            color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrap
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 0.64rem
              color: $color-text-l
              font-size: $font-size-medium
              .current
                color: $color-text
      .bottom-wrap
        position: absolute
        bottom: 1rem
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            width: 0.16rem
            height: 0.16rem
            margin: 0 0.08rem
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 0.4rem
              border-radius: 0.1rem
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 0.2rem 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 0.6rem
            line-height: 0.6rem
            width: 0.6rem
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
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
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
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
        position: relative
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          display: block
          font-size: 0.6rem
          color: $color-theme-d
        .icon-mini
          font-size: 0.6rem
          position: absolute
          left: 0
          top: 0
      &.mini-enter-active,&.mini-leave-active
        transition: 0.4s
      &.mini-enter,&.mini-leave-to
        transform: translate3d(0, 1.2rem, 0)
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>