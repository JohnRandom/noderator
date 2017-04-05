import { browserHistory } from 'react-router'
import R from 'ramda'

export function scrollTop() {
  const elem = document.documentElement || document.body.parentNode || document.body
  return R.isNil(window.pageYOffset) ? window.pageYOffset : (elem).scrollTop
}

export function push(path) {
  browserHistory.push(path)
}
