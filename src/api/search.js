import { URL } from './config'
import axios from 'axios'
// 获取热门搜索
export function getHotKey() {
  let url = `${URL}/search/hot`
  let data = {
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取搜索结果
export function getSuggest(keywords, type, limit, offset) {
  let url = `${URL}/search`
  let data = {
    keywords: keywords,
    type: type,
    limit: limit,
    offset: offset,
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取歌曲详情(搜索歌曲的数据格式不对，需要拿到歌曲详情)
// export function getSongDetail(id) {
//   let url = `${URL}/song/detail`
//   let data = {
//     ids: id,
//     xhrFields: { withCredentials: true }
//   }
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   })
// }