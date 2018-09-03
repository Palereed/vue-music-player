<template>
  <div class="singer">
    <listview :data="this.singers"></listview>
  </div>
</template>
<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
const HOT_NAME = '热门'
const OTHER_NAME = '其他'
const HOT_LENGTH = 10
export default{
  data() {
    return{
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 将数据格式化为我们想要的。
    _normalizeSinger(list) {
      let map = {
        // 热门歌曲
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if ( index < HOT_LENGTH){
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]){
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 得到有序列表，对map进行处理
      let hot = []
      let ret = []
      let other = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME){
          hot.push(val)
        } else {
          val.title = OTHER_NAME
          other.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret).concat(other)
    }
  },
  components: {
    Listview
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.singer
  position: fixed
  width: 100%
  top: 1.72rem
  bottom: 0
</style>