// 样式引入
import 'common/stylus/index.styl'
// babel补丁，可以使用ES6的API，如promise
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入fastclick，解决移动端点击300ms延迟问题
import fastclick from 'fastclick'
// vue懒加载插件
import VuelazyLoad from 'vue-lazyload'
Vue.use(VuelazyLoad, {
  loading: require('common/images/default.png')
})
// fastclick推荐用法
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
