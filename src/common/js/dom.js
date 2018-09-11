export function addClass(el, className) {
  if (hasClass(el, className)) {
    // 若开始类名为cat，先变为["cat"]，split不会改变自身，赋给新变量
    let newClass = el.className.split(' ')
    // 新类名为dog，那变为["cat","dog"]
    newClass.push(className)
    // 最后变为["cat dog"]
    el.className = newClass.join(' ')
  }
  // 我觉的视频里有问题，没类名直接赋类名就行了，有类名返回什么鬼？有才不应该转化数组进行接下来操作么。
  el.className = className
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  let prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// css hack
let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transfrom'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standand') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
