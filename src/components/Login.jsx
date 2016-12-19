import React, { Component, propTypes as T } from 'react';
import AuthService from '../utils/AuthService';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      location: T.object,
      auth: T.instanceOf(AuthService)
    }
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <button onClick={this.props.auth.login.bind(this)}>Login through Auth0</button>
      </div>
    )
  }
}
