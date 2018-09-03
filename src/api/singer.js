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