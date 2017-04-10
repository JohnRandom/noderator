import { extendObservable } from 'mobx'

export default class Store {
  constructor () {
    extendObservable(this, {
    })
  }

  initialize () {
    return Promise.resolve()
  }

  destroy () {
    return Promise.resolve()
  }
}
