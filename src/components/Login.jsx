import React, { Component } from 'react';
import Styles from './css/login.css';
import classnames from 'classnames';

export default class Login extends Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    this.props.handleLoginState(false, true);
  }

  render() {
    return (
      <div className={Styles.container}>
        <h2 className={Styles.loginForm}>Log in</h2>
        <button className={classnames('button', Styles.loginForm)}
           id={Styles.loginBtn}
           onClick={this.handleLogin}>Login through Google</button>
      </div>
    )
  }
}
