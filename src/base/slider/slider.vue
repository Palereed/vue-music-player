<template>
  <!-- 不能功能性的组件，我们就将它放在base中，一般正式项目都会打包成npm，然后在项目中安装，待项目完成后可以试一试。 -->
  <div class="slider" ref="slider">
    <div class="slider-content" ref="sliderContent">
      <!-- slot相当于一个插槽，也就是占位的，可以在父组件中填充它。 -->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span v-for="(item, index) in this.dots" :class="{active : activeIndex === index}" :key="item"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      dots: [],
      activeIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  mounted() {
    // 一直加不上类名，因为slider内slot填充的是数据，其父组件recommend的数据是异步获取到的，而在数据还未拿到mounted已经执行了，因此没有效果。
    // 因此在recommend中给slider的包裹层slider-wrapper添加v-if判断，在获取到数据后再渲染，这样保证mounted的执行性。
    setTimeout(() => {
      this._setSliderWidth()
      this._initdots()
      this._initSlider()
      // autoplay
      if (this.autoplay) {
        this._play()
      }
    })

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.slider.refresh()
    })
  },
  methods: {
    _initdots() {
      this.dots = new Array(this.imgs.length)
    },
    _setSliderWidth(isResize) {
      this.imgs = this.$refs.sliderContent.children
      let swidth = this.$refs.slider.clientWidth
      let totalWidth = this.imgs.length * swidth
      for (let i = 0; i < this.imgs.length; i++) {
        let img = this.imgs[i]
        addClass(img, 'slider-item')
        img.style.width = swidth + 'px'
      }
      // 判断是否是缩小尺寸，是的话，就不用再加两个宽度了，因为DOM已经改变过了，imgs数量已经变化了。
      if (this.loop && !isResize) {
        totalWidth = swidth * 2 + totalWidth
      }
      this.$refs.sliderContent.style.width = totalWidth + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        }
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.activeIndex = pageIndex
        if (this.autoplay) {
          this._play()
        }
      })
      // 这样可以解决长按时仍会跳到下一张的bug。
      this.slider.on('beforeScrollStart', () => {
        if (this.autoplay) {
          clearTimeout(this.timer)
        }
      })
    },
    _play() {
      // clearTimeout，假设你有个函数一开始想要在30秒后执行，然后，在还没有30秒的时候，由于用户做了其他操作，需要取消那个30秒后的操作，你怎么办？当然是清掉她啊
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  // destroyed，即切换组件或关闭页面，此时销毁计时器，释放内存
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.slider
  position: relative
  overflow: hidden
  .slider-content
    overflow: hidden
    .slider-item
      float: left
      a
        display: block
        width: 100%
        overflow: hidden
      img
        // img为行内块元素，在块元素里默认有空白，若不设置display:block或vertical-align:top;会导致父层比自身高
        display: block
        width: 100%
  .dots
    position: absolute
    width: 100%
    bottom: 0.24rem
    text-align: center
    font-size: 0
    span
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
</style>