import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  // 直接list会报错，mutate vuex outside mutation？整不懂。
  // 必须得创建list的副本？
  let newList = list.slice()
  commit(types.SET_SEQUENCE_LIST, newList)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, newList)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song) {
  let playList = state.playList
  let sequenceList = state.sequenceList
  let currentIndex = state.currentIndex
  // playlist的处理
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // playlist中查找要插入的歌曲
  let fqindex = findIndex(playList, song)
  // 因为要插入歌曲，索引加1
  currentIndex ++
  // 插入歌曲
  playList.splice(currentIndex, 0, song)
  // 判断歌单是否存在欲插入的歌曲，fqindex必须要在插入歌曲前判断。
  if (fqindex > -1) {
    // 如果存在的位置小于插入的位置，删除并使currentIndex减小1
    // 否则存在的位置大于插入的位置，因为已经插入fqindex需要加1，才是存在的位置
    if (currentIndex > fqindex) {
      playList.splice(fqindex, 1)
      currentIndex --
    } else {
      playList.splice(fqindex + 1, 1)
    }
  }
  
  // sequenceList的处理
  let currentSindex = findIndex(sequenceList, currentSong) + 1
  // sequenceList中查找要插入的歌曲
  let fqSindex = findIndex(sequenceList, song)
  sequenceList.splice(currentSindex, 0, song)
  if (fqSindex > -1) {
    if (currentSindex > fqSindex) {
      sequenceList.splice(fqindex, 1)
    } else {
      sequenceList.splice(fqSindex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
