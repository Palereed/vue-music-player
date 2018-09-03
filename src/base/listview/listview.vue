<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-item">
            <img v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- @touchmove.stop.prevent防止冒泡，防止浏览器滚动或者歌手页滚动 -->
    <div class="quick-entry" @touchstart="onQuickentryTouchStart" @touchmove.stop.prevent="onQuickentryTouchMove">
      <ul>
        <li v-for="(item,index) in quickList" class="item" :data-index='index'>
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
export default {
  created() {
    this.touch = {}
  },
  props:{
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    quickList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onQuickentryTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      console.log(e)
      this.touch.y1 = firstTouch.pageY
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    },
    onQuickentryTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let offset = this.touch.y2 - this.touch.y1
      console.log(offset)
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.listview
  position: relative
  height: 100%
  overflow: hidden
  font-size: 0.26rem
  .list-group
    margin-bottom: 0.4rem
    .list-group-title
      width: 100%
      height: 0.6rem
      line-height 0.6rem
      padding-left: 0.4rem
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-item
      display: flex
      align-items: center;
      margin: 0.4rem 0 0 0.6rem
      img
        width: 1rem
        height: 1rem
        border-radius: 0.5rem
      .name
        margin-left: 0.4rem
        color: $color-text-l
        font-size: $font-size-medium
  .quick-entry
    width: 0.4rem
    padding: 0.4rem 0
    border-radius: 0.2rem
    position: absolute
    top: 50%
    right: 0
    transform: translateY(-50%)
    text-align: center
    background: $color-background-d
    .item
      padding: 3px
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
</style>