import { URL } from './config'
import axios from 'axios'
// 获取排行榜
export function getRankList(idx) {
  let url = `${URL}/top/list`
  let data = {
    idx: idx,
    xhrFields: { withCredentials: true }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}