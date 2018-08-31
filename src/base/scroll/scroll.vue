<template>
  <div ref="scrollWrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    _initScroll() {
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>