<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="listview">
      <ul class="list-wrap">
        <li @click="selectItem(item)" class="item" v-for="item in rankList" :key="item.id">
          <div class="icon">
            <img v-lazy="item.coverImgUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.tracks.slice(0,3)" :key="song.id">
              <span>{{index + 1}}</span>
              <span>{{song.name}} ▪ {{song.al.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!rankList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import { getRankList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playListMinxin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playListMinxin],
  data() {
    return {
      rankList: []
    }
  },
  created() {
    this._getRankList()
  },
  methods: {
    _getRankList() {
      for (let i = 0; i < 24; i++) {
        getRankList(i).then(res => {
          if (res.code === ERR_OK) {
            this.rankList.splice(i, 0, res.playlist)
          }
        })
      }
    },
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '1.2rem' : 0
      this.$refs.rank.style.bottom = `${bottom}`
      this.$refs.listview.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.rank
  position: fixed
  width: 100%
  top: 1.72rem
  bottom: 0
  overflow: hidden
  .toplist
    height: 100%
    overflow: hidden
    .list-wrap
      overflow: hidden
      .item
        display: flex
        margin: .4rem .4rem 0 .4rem
        height: 2rem
        &:last-child
          margin-bottom: .4rem
        .icon
          flex: 0 0 2rem
          width 2rem
          height: 2rem
          img
            width: 100%
            height: 100%
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: .4rem
          height: 2rem
          box-sizing: border-box
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-medium
          .song
            no-wrap()
            line-height: .52rem
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>