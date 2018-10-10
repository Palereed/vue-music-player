import { mapGetters } from 'vuex'
export const playListMinxin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  methods: {
    handlePlaylist() {
      throw Error('component has not implemented handlePlaylist method')
    }
  },
  watch: {
    playList() {
      this.handlePlaylist(this.playList)
    }
  }
}
