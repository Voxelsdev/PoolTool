import React, { Component } from 'react';
import { Match, Miss } from 'react-router';

import Login from './Login.jsx';

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="main">
        <Match pattern="/" exactly component={Login} />
        <Match pattern="/login" component={Login} />
      </div>
    )
  }
}
