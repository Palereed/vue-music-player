function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let newArr = arr.slice()
  for (let i = 0; i < newArr.length; i++) {
    let j = getRandomInt(0, i)
    let t = 0
    t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr
}
