import 'lib/polyfills'

import React from 'react'
import 'babel-polyfill'

import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { Module, coreModule } from 'modules/core'
import Routes from './routes'

const DOM_APP_EL_ID = 'app'

const mainModule = new Module([], [
  coreModule
])

mainModule.bootstrap()

ReactDOM.render(
  <AppContainer><Routes /></AppContainer>,
  document.getElementById(DOM_APP_EL_ID)
)

if (module.hot) {
  module.hot.accept('./routes', function() {
    const RoutesNext = require('./routes').default

    ReactDOM.render(
      <AppContainer><RoutesNext /></AppContainer>,
      document.getElementById(DOM_APP_EL_ID)
    )
  })
}
