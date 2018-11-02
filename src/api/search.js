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
// 获取搜索建议
export function getSuggest(keywords) {
  let url = `${URL}/search/suggest`
  let data = {
    keywords: keywords,
    // limit: limit,
    // offset: offset,
    // type: type,
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
