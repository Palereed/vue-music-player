import JSONP from 'jsonp'
// 原本库内url需要拼好后加query，而这里我们希望url纯净一点，data封装好参数。
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    JSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })

  function param(data) {
    let query = ''
    for (var k in data) {
      let value = data[k] !== undefined ? data[k] : ''
      // encodeURIComponent将字符串作为url组件进行编码。
      query += `&${k}=${encodeURIComponent(value)}`
    }
    return query
  }
}
