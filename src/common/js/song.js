// 类的拓展性比对象强很多
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}
// 抽象出来工厂方法，更抽象一层，代码更少。防止在创建Song的时候重复出来一大堆代码。
export function creatSong(musicData, songvkey) {
  return new Song({
    // 直接处理好数据能直接运用到dom上
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    // 播放时长
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg`,
    // 歌曲播放链接需要songvkey值，我们需要jsonp跨域获取到该值。
    url: `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songvkey}&guid=2760283000&uin=0&fromtag=66`
  })
}
// 歌是多人唱的，需要对这多个名字用/分开
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
