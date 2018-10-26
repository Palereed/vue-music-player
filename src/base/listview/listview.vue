<template>
  <scroll class="listview" :data="data" :probeType="this.probeType" :isListen="this.isListen" ref="listview" @scroll="listenScroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.id">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-item" @click="selectItem(item)" :key="item.id">
            <img v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- @touchmove.stop.prevent防止冒泡，防止浏览器滚动或者歌手页滚动 -->
    <div class="quick-entry" @touchstart="onQuickentryTouchStart" @touchmove.stop.prevent="onQuickentryTouchMove">
      <ul>
        <li v-for="(item,index) in quickList" class="item" :class="{'current':currentIndex===index}" :data-index='index' ref="anchorItem" :key="item.id">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="fixed-title" v-show="fixedTitle" ref="fixTitle">
      <h2>{{fixedTitle}}</h2>
    </div>
    <div v-show="!data.length" class="loading-wrapper">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'
export default {
  data() {
    return {
      scrollY: 0,
      heightList: [],
      currentIndex: 0,
      diff: 0
    }
  },
  // 不需要监测变化的放到created中即可
  created() {
    this.touch = {}
    // 设置为3，bs滚动时实时监听，不节流
    this.probeType = 3
    this.isListen = true
    // 因为为rem适配。不能像视频中设为常量，在初始化高度中通过dom获取。
    this.fixTitleHeight = 0
    this.anchorHeight = 0
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    quickList() {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      // 这里的处理简直了，要是我肯定要$refs获取隐藏dom，然后再其他情况显示。
      // 学习Vue，就是要从操作DOM的观念中改变过来，操作数据就行。
      // 学了这么久了，还是改不了操作DOM的习惯，return ''，再用v-show来控制，这才是Vue。自己还是菜啊！
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    onQuickentryTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      // 以下均为了滑动滚动做参数准备
      // e中保存了点击事件对象，touches[0]包括点击对象的位置信息。
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      // 记录下按下时的索引
      this.touch.firstIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onQuickentryTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let offset = ((this.touch.y2 - this.touch.y1) / this.anchorHeight) | 0
      let lastIndex = parseInt(this.touch.firstIndex) + offset
      this._scrollTo(lastIndex)
    },
    listenScroll(pos) {
      this.scrollY = pos.y
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    _calculateHeight() {
      let list = this.$refs.listGroup
      let height = 0
      // 别忘了将0先push进去
      this.heightList.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].offsetHeight
        this.heightList.push(height)
      }
      // 固定栏与锚点的高度，固定栏高度放在watch内的diff锚点放在点击事件方法中太浪费资源，每次事件都会获取
      this.fixTitleHeight = this.$refs.fixTitle.clientHeight
      this.anchorHeight = this.$refs.anchorItem[0].clientHeight
    },
    _scrollTo(index) {
      // 点击的不是快速标签，而是padding部分，做边界处理。bs已经做了边界处理，而这里需要自己做。
      if (!index && index !== 0) {
        return
      }
      // 拖动情况下，拖至padding部分或父层以外的处理，做边界处理。
      if (index < 0) {
        index = 0
      } else if (index > this.heightList.length - 2) {
        index = this.heightList.length - 2
      }
      this.scrollY = -this.heightList[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      let heightList = this.heightList
      // 滚动至顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 中间部分滚动，-1确保height2是永远存在的
      for (let i = 0; i < heightList.length - 1; i++) {
        let height1 = heightList[i]
        let height2 = heightList[i + 1]
        if (height1 <= -newY && -newY < height2) {
          this.currentIndex = i
          // fixed-title距下一个list-group距离
          this.diff = height2 + newY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = heightList.length - 2
    },
    diff(newdiff) {
      let fixedTop = 0
      if (newdiff > 0 && newdiff < this.fixTitleHeight) {
        fixedTop = newdiff - this.fixTitleHeight
      } else {
        fixedTop = 0
      }
      this.$refs.fixTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.listview
  position: relative
  height: 100%
  overflow: hidden
  font-size: $font-size-medium
  .list-group
    padding-bottom: 0.4rem
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
      align-items: center
      padding: 0.4rem 0 0 0.6rem
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
  .fixed-title
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 0.6rem
    line-height 0.6rem
    padding-left: 0.4rem
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
  .loading-wrapper
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>