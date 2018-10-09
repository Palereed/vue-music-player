import { getSongLyric } from 'api/song'
import { ERR_OK } from 'api/config'
const Error = 'no lyric'
// 类的拓展性比对象强很多
export default class Song {
  constructor({id, alid, singer, name, album, duration, image, url}) {
    this.id = id
    this.alid = alid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getSongLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getSongLyric(this.id).then(res => {
        if (res.code === ERR_OK) {
          if (res.lrc) {
            this.lyric = res.lrc.lyric
            resolve(this.lyric)
          }
        } else {
          reject(Error)
        }
      })
    })
  }
}

// 抽象出来工厂方法，更抽象一层，代码更少。防止在创建Song的时候重复出来一大堆代码。
export function creatSong(musicData) {
  return new Song({
    // 直接处理好数据能直接运用到dom上
    id: musicData.id,
    alid: musicData.al.id,
    singer: filterSinger(musicData.ar),
    name: musicData.name,
    album: musicData.al.name,
    duration: musicData.dt / 1000,
    image: musicData.al.picUrl,
    url: musicData.url
  })
}
// 歌是多人唱的，需要对这多个名字用/分开
function filterSinger(ar) {
  let ret = []
  if (!ar) {
    return ''
  }
  ar.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
