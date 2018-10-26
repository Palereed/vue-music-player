<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-wrapper" :data="recommends" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImg">
              </a>
            </div>
          </slider>
        </div>
        <div class="songlist-wapper">
          <h1>推荐歌单</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in songList" class="songlist" :key="item.id">
              <div class="icon">
                <img v-lazy="item.picUrl">
              </div>
              <div class="text">
                <h2 class="creator"><span class="icon-headphones">{{ item.playCount | listennumFormate }}</span></h2>
                <p class="name">{{item.name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-wrapper" v-show="!songList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import { getRecommend, getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playListMinxin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playListMinxin],
  data() {
    return {
      recommends: [],
      songList: []
    }
  },
  created() {
    this._getRecommend()
    this._getSongList()
  },
  filters: {
    listennumFormate: function(value) {
      value = (value | 0).toString()
      return value.slice(0, -4) + '万'
    }
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '1.2rem' : 0
      this.$refs.recommend.style.bottom = `${bottom}`
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      })
      console.log(item)
      this.setRecommDetail(item)
    },
    _getRecommend() {
      // 这里的getRecommend是一个Promise对象
      getRecommend().then(res => {
        if (res.code === 0) {
          this.recommends = res.data.slider
        }
      })
    },
    _getSongList() {
      getSongList().then(res => {
        if (res.code === ERR_OK) {
          this.songList = res.result
        }
      })
    },
    // 确保即便slider后加载出来，重新计算bs高度，确保滑动不会出现问题。
    loadImg() {
      if (!this.ifLoaded) {
        this.$refs.scroll.refresh()
        this.ifLoaded = true
      }
    },
    ...mapMutations({
      setRecommDetail: 'SET_RECOMM_DETAIL'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
  .recommend
    position: fixed
    width: 100%
    top: 1.72rem
    bottom: 0
    .recommend-wrapper
      height: 100%
      overflow: hidden
      .songlist-wapper
        position: relative
        h1
          height: 1.3rem
          line-height: 1.3rem
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .songlist
          display: flex
          padding: 0 0.4rem
          margin-bottom: 0.4rem
          .icon
            width: 1.2rem
            height: 1.2rem
            img
              width: 100%
              height: 100%
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            padding-left: 0.4rem
            .creator
              font-size: 0.3rem
              margin-bottom: 0.2rem
              span
                float: right
                font-size: 0.26rem
                color: $color-text-d
                &:before
                  margin-right: 0.1rem
            .name
              font-size: 0.3rem
              color: $color-text-d
    .loading-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
</style>