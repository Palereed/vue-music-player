import { URL } from './config'
import axios from 'axios'
// 获取歌手排行榜
export function getSingerList() {
  let url = `${URL}/top/artists`
  let data = {
    limit: 100,
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取歌手详情
export function getSingerDetail(id) {
  let url = `${URL}/artists`
  let data = {
    id: id,
    limit: 100,
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取歌曲url
export function getSongUrl(id) {
  let url = `${URL}/music/url`
  let data = {
    id: id,
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}