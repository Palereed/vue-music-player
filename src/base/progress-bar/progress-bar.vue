<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtnWrapper">
        <div class="progress-btn" ref="progressBtn"></div>
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
  watch: {
    percent(now) {
      if (now >= 0) {
        const progressBtnWidth = this.$refs.progressBtn.offsetWidth
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = now * barWidth
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtnWrapper.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
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