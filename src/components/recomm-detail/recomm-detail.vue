<template>
  <transition name="slide">
    <musiclist :title="title" :avatar="backimg" :songs="songs"></musiclist>
  </transition>
</template>
<script type="text/ecmascript-6">
import Musiclist from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getRecommDetail } from 'api/recommend'
import { getSongUrl } from 'api/song'
import { creatSong } from 'common/js/song'
import { ERR_OK } from 'api/config'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.recommDetail.name
    },
    backimg() {
      return this.recommDetail.picUrl
    },
    ...mapGetters([
      'recommDetail'
    ])
  },
  methods: {
    _getRecommDetail() {
      if (!this.recommDetail.id) {
        this.$router.push('/recommend')
        return
      }
      getRecommDetail(this.recommDetail.id).then(res => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.songs = this._normalizeSongs(res.playlist.tracks)
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
  created () {
    this._getRecommDetail()
  },
  components: {
    Musiclist
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active,.slide-leave-active
    transition: all 0.3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>