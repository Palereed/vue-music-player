<template>
  <scroll class="suggest" @scrollToEnd="searchMore" :data="suggestSong.songs" :pullup="pullup">
    <div class="suggest-list">
      <div class="suggest-singer" v-show="suggestSinger.artistCount">
        <p class="icon">
          <i class="icon-mine"></i>
          <span class="type">歌手</span>
        </p>
        <ul class="type-list">
          <li @click=selectItem(singer) v-for="singer in suggestSinger.artists" :key="singer.id">
            <i class="icon-mine"></i>
            <span class="name">{{singer.name}}{{singerName(singer)}}</span>
          </li>
        </ul>
      </div>
      <div class="suggest-song" v-show="suggestSong.songCount">
        <p class="icon">
          <i class="icon-music"></i>
          <span class="type">歌曲</span>
        </p>
        <ul class="type-list">
          <li v-for="song in suggestSong.songs" :key="song.id">
            <i class="icon-music"></i>
            <span class="name">{{song.name}}{{singerName(song)}}</span>
          </li>
        </ul>
        <loading v-show="hasMore" title=""></loading>
      </div>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import { getSuggest } from 'api/search'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import { creatSong } from 'common/js/song'
import { getSongUrl } from 'api/song'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
const SONG_LIMIT = 20
const SINGER_LIMIT = 5
const OFFSET = 20
export default {
  data() {
    return {
      suggestSinger: [],
      suggestSong: [],
      pullup: true,
      hasMore: true,
      page: 0
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 歌曲搜索结果
    searchSong() {
      // 清空query时不请求
      if (!this.query) {
        return
      }
      this.hasMore = true
      getSuggest(this.query, 1, SONG_LIMIT).then(res => {
        if (res.code === ERR_OK) {
          this.suggestSong = res.result
          this.checkMore(this.suggestSong)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page ++
      getSuggest(this.query, 1, SONG_LIMIT, OFFSET * this.page).then(res => {
        if (res.code === ERR_OK) {
          this.suggestSong.songs = this.suggestSong.songs.concat(res.result.songs)
          this.checkMore(this.suggestSong)
        }
      })
    },
    checkMore(data) {
      if ((!data.songCount) || (data.songs.length + SONG_LIMIT) >= data.songCount) {
        this.hasMore = false
      }
    },
    searchSinger() {
      if (!this.query) {
        return
      }
      getSuggest(this.query, 100, SINGER_LIMIT).then(res => {
        if (res.code === ERR_OK) {
          this.suggestSinger = res.result
        }
      })
    },
    singerName(child) {
      if (child.artists) {
        let artists = []
        child.artists.forEach(item => {
          artists.push(item.name)
        })
        return ` - ${artists.join('/')}`
      }
    },
    selectItem(item) {
      const singer = new Singer({
        id: item.id,
        name: item.name,
        avatar: item.picUrl
      })
      this.$router.push({
        path: `/search/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
    query() {
      this.searchSong()
      this.searchSinger()
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 .6rem
      font-size: $font-size-medium
      color: $color-text-d
      .icon
        display: flex
        width: 100%
        height: .6rem
        align-items: center
        color: $color-theme
        i
          margin-right: .2rem
        .type
          flex: 1
      .type-list
        li
          display: flex
          align-items: center;
          height: .6rem
          line-height: .6rem
          i
            margin-right: .2rem
          .name
            flex: 1
            overflow: hidden
            text-overflow: ellipsis;
            white-space: nowrap;
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>