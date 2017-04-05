import React, { Component, PropTypes } from 'react'
import DevTools from 'mobx-react-devtools'
import Header from 'components/Header'

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
        <DevTools />
        <Header/>
        { this.props.children }
      </div>
    )
  }
}
