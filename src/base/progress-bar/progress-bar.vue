<template>
  <div class="progress-bar" ref="progressBar" @click.prevent='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtnWrapper">
        <div class="progress-btn" ref="progressBtn"
             @touchstart.prevent='progressTouchStart'
             @touchmove.prevent='progressTouchMove'
             @touchend='progressTouchEnd'
             >
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // touch事件中的共享数据，将数据挂载在此对象上即可。
    this.touch = {}
    this.barWidth = 0
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      // touches[0]即第一个手指的点击对象。
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(
        this.barWidth,
        Math.max(0, this.touch.left + deltaX)
      )
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _triggerPercent() {
      const percent = this.$refs.progress.clientWidth / this.barWidth
      this.$emit('percentChange', percent)
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      let moveTo = Math.max(
        0,
        Math.min(
          offsetWidth - this.$refs.progressBtn.offsetWidth / 2,
          this.barWidth
        )
      )
      this._offset(moveTo)
      this._triggerPercent()
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtnWrapper.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent(now) {
      if (now >= 0 && !this.touch.initiated) {
        const progressBtnWidth = this.$refs.progressBtn.offsetWidth
        const progressBarWidth = this.$refs.progressBar.clientWidth
        this.barWidth = progressBarWidth - progressBtnWidth
        const offsetWidth = now * this.barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .progress-bar
    height: 0.6rem
    .bar-inner
      position: relative
      top: 0.26rem
      height: 0.08rem
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        width: 0.6rem
        height: 0.6rem
        top: 50%
        left: 0
        margin: -0.3rem 0 0 -0.14rem
        .progress-btn
          position: relative
          top: 0.14rem
          left: 0.14rem
          box-sizing: border-box
          width: 0.32rem
          height: 0.32rem
          border: 0.06rem solid $color-text
          border-radius: 50%
          background: $color-theme
</style>