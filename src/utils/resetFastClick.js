import FastClick from 'fastclick'
//fastclick 在 iOS 下 input框点击慢的问题,引入
// import "@utils/resetFastClick.js

FastClick.prototype.focus = (targetElement) => {
  let length
  if (
    targetElement.setSelectionRange &&
    targetElement.type.indexOf('date') !== 0 &&
    targetElement.type !== 'time' &&
    targetElement.type !== 'month'
  ) {
    length = targetElement.value.length
    targetElement.focus()
    targetElement.setSelectionRange(length, length)
  } else {
    targetElement.focus()
  }
}
