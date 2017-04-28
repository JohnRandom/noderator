import React, { Component } from 'react'
import DevTools from 'mobx-react-devtools'
import Header from 'components/Header'
import PropTypes from 'prop-types'

const isProduction = process.env.PRODUCTION

export default class App extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  render() {
    return (
      <div>
        { isProduction ? null : <DevTools /> }
        <Header/>
        { this.props.children }
      </div>
    )
  }
}
