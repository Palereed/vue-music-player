<template>
  <transition name="slide">
    <musiclist :songs="songs"></musiclist> 
  </transition>
</template>
<script type="text/ecmascript-6">
import Musiclist from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
export default {
  computed: {
    title() {
      return this.recommDetail.name
    },
    ...mapGetters('recommDetail')
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