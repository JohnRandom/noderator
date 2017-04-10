import Store from './store'

export default class Service {
  constructor({ name, version }) {
    this.name = name
    this.version = version

    this.store = new Store()
  }

  getCaller() {
    return {
      name: this.name,
      version: this.version
    }
  }

  getService() {
    throw new Error(`${this.constructor.name} was not initialised via the manager`)
  }

  initialize(events) {
    return new Promise((resolve, reject) => {
      try {
        this.store.initialize().then(resolve)
      } catch (err) {
        reject(err)
      }
    })
  }

  destroy() {
    return new Promise((resolve, reject) => {
      try {
        this.store.destroy().then(resolve)
      } catch (err) {
        reject(err)
      }
    })
  }
}
