// 因为jsonp函数export default，因此import不需要加{}
import jsonp from 'common/js/jsonp'
import {queryParams, options} from './config'
import axios from 'axios'
// json与config其实都是服务于getRecommend方法的，此二者封装对url的格式化与jsonp的调用，从而实现getRecommend的简洁与jsonp返回。
// 跨域获取轮播图与歌单数据
export function getRecommend() {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // ES6语法，可以向对象上加参数，config中为公共参数，这里添加一些其他参数
  let data = Object.assign({}, queryParams, {
    uin: '0',
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getSongList() {
  var url = '/api/getSongList'
  var data = Object.assign({}, queryParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    format: 'json',
    rnd: Math.random()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}