<template>
  <div class="search">
    <div class="searchbox-wrapper">
      <searchbox></searchbox>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Searchbox from 'base/search-box/search-box'
export default{
  data () {
    return {
      
    }
  },
  components: {
    Searchbox
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
  .search
    .searchbox-wrapper
      margin: 20px
</style>