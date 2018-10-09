<template>
  <transition name="slide">
    <musiclist :songs="songs" :title="title" :avatar="avatar"></musiclist>
  </transition>
</template>
<script type="text/ecmascript-6">
import Musiclist from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { creatSong } from 'common/js/song'
import { ERR_OK } from 'api/config'
import { getSongUrl } from 'api/song'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    avatar() {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      // 因为详情页是通过点击歌手进来的，即歌手列表页用vuex来setSinger的，若在详情页刷新，会没有数据，我们在刷新时返回歌手列表页。
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.hotSongs)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.id && item.al.id) {
          getSongUrl(item.id).then(res => {
            if (res.code === ERR_OK) {
              // 没有url的歌剔除出去
              if (res.data[0].url) {
                item.url = res.data[0].url
                ret.push(creatSong(item))
              }
            }
          })
        }
      })
      return ret
    }
  },
  components:{
    Musiclist
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
  .singer-detail
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    background: $color-background
    z-index: 100
  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>