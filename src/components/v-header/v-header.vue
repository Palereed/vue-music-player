<template>
  <div class="v-header">
    <div class="cat"></div>
    <h1 class="name">Cat Music</h1>
  </div>
</template>
<script type="text/ecmascript-6">
export default {}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  // 要加上~，~common表示相对common，否则会报错
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .v-header
    height: 0.64rem
    line-height: 0.64rem
    text-align: center
    margin-top: 0.2rem
    .cat
      display: inline-block
      width: 0.6rem
      height: 0.64rem
      bg-image('cat')
      vertical-align: top
      margin-right: -0.2rem
    .name
      display: inline-block
      font-size: $font-size-large
      color: $color-theme
      vertical-align: top
</style>