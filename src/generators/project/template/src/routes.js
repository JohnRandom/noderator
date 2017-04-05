import React from 'react'
import { Router, browserHistory } from 'react-router'

import App from './layouts'

const routes = {
  path: '/',
  component: App
}

const props = {
  history: browserHistory,
  routes
}

export default () => <Router {...props} />
