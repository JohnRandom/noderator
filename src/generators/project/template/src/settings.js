import {action, observable, extendObservable, toJS} from 'mobx'
import {assign, zipObject, map, keys, isString} from 'lodash'

const repository = {}

const defaultModuleConfig = {}

class ModuleConfig {
  constructor() {
    this.repository = repository

    extendObservable(this, {
      settings: observable.shallowMap(assign({}, defaultModuleConfig, this.load()))
    })
  }

  dump() {
    const conf = toJS(this.settings)
    const data = zipObject(keys(conf), map(conf, (value) => value.version))

    if (window.localStorage) {
      window.localStorage.setItem('module_config', JSON.stringify(data))
    }
  }

  load() {
    if (window.localStorage) {
      const value = window.localStorage.getItem('module_config')

      if (isString(value)) {
        const data = JSON.parse(value)

        return zipObject(
          keys(data),
          map(data, (value, key) => {
            return {
              version: value,
              component: repository[key][value].component,
              service: repository[key][value].service
            }
          })
        )
      }
    }

    return {}
  }

  read = (attr) => {
    return this.settings.get(attr)
  }

  @action write = (attr, value) => {
    const data = {
      version: value,
      component: repository[attr][value].component,
      service: repository[attr][value].service
    }

    this.settings.set(attr, data)

    this.dump()
  }

  getComponents() {
    const keys = this.settings.keys()

    return zipObject(keys.map((key) => {
      return key.charAt(0).toUpperCase() + key.substr(1)
    }), keys.map((key) => {
      return this.settings.get(key).component
    }))
  }

  getServices() {
    const keys = this.settings.keys()

    return zipObject(keys, keys.map((key) => {
      return this.settings.get(key).service
    }))
  }
}

const defaultApplicationConfig = {}

class Settings {
  constructor() {
    this.moduleConfig = new ModuleConfig()

    extendObservable(this, {
      params: observable.shallowMap(assign({}, defaultApplicationConfig, this.load()))
    })
  }

  dump() {
    if (window.localStorage) {
      window.localStorage.setItem(
        'settings_params',
        JSON.stringify(toJS(this.params))
      )
    }

    this.moduleConfig.dump()
  }

  load() {
    if (window.localStorage) {
      const value = window.localStorage.getItem('settings_params')

      if (isString(value)) {
        return JSON.parse(value)
      }
    }

    return {}
  }

  read = (attr) => {
    return this.params.get(attr)
  }

  @action write = (attr, value) => {
    this.params.set(attr, value)

    this.dump()
  }
}

export default new Settings()
