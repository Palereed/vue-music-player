import { URL } from './config'
import axios from 'axios'
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

// 获取歌曲歌词
export function getSongLyric(id) {
  let url = `${URL}/lyric`
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