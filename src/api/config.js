export const queryParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}
export const options = {
  // qq音乐约定的jsonp的参数二opts的param为jsonpCallback，因此必须为这个，否则拿不到数据。
  param: 'jsonpCallback'
}

// 网易云接口url
export const URL = 'http://localhost:3000'
// 正确值设置为200，为了语义化设置好常量
export const ERR_OK = 200
