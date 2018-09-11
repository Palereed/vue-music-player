import jsonp from 'common/js/jsonp'
import {queryParams, options} from './config'
export function getSingerList() {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  // ES6语法，可以向对象上加参数，config中为公共参数，这里添加一些其他参数
  let data = Object.assign({}, queryParams, {
    g_tk: 1928093487,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(id) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let data = Object.assign({}, queryParams, {
    singerid: id,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 100,
    begin: 0
  })
  return jsonp(url, data, options)
}
// 歌曲播放链接需要vkey值，这里拿到vkey值。这里的id是songmid
export function getSongvkey(mid) {
  let url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  let data = Object.assign({}, queryParams, {
    songmid: mid,
    format: 'json',
    platform: 'yqq',
    filename: `C400${mid}.m4a`,
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    guid: 2760283000,
    callback: 'vkey'
  })
  let optioned = Object.assign({}, options, {
    name: 'vkey'
  })
  return jsonp(url, data, optioned)
}