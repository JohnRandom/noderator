import R from 'ramda'
import Rx from 'rx'

import settings from './settings'

class Manager {
  constructor () {
    this.services = settings.moduleConfig.getServices()
    this.state = {}
    this.stream = Rx.Observable.from((observer) => {
      // ...
    }).publish()
  }

  refresh () {
    this.services = settings.moduleConfig.getServices()
  }

  get (name, version = null) {
    if (!R.isNil(this.services[name])) {
      if (R.isNil(this.state[name])) {
        this.state[name] = {}
      }

      if (R.isNil(this.state[name][version])) {
        const { stream } = this
        const service = new this.services[name]({ name, version, stream })
        service.getService = this.get
        service.initialize()

        this.state[name][version] = service
      }

      return this.state[name][version]
    }

    throw new Error(`Service ${name}:${version} is unknown`)
  }

  remove (name, version = null) {
    if (!R.isNil(this.state[name])) {
      if (!R.isNil(this.state[name][version])) {
        delete this.state[name][version]
      }
    }
  }

  destroy() {
    this.stream.dispose()
  }
}

export default new Manager()
