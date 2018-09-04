import Vue from 'vue'
import Vuex from 'vuex'
// actions与getters都import * as，这样避免所有的方法都是用{}来import，这也是ES6import的语法
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 每次通过mutations修改state时，都会打印日志。
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 调试工具，是否通过mutations修改state，不是会报错。
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})