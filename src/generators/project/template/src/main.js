/* globals module, require */
/* eslint-disable no-unused-vars */
import React from 'react'
import 'babel-polyfill'

import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Routes from './routes'

const DOM_APP_EL_ID = 'app'

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
