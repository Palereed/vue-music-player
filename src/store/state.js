// 播放配置文件，防止语义不详
import { playMode } from 'common/js/config'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  // 播放模式，顺序播放，两者一样，随机播放则两者不同
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state
