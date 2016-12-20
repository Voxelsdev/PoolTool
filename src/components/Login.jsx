import React, { Component } from 'react';
import Styles from './css/login.css';
import classnames from 'classnames';

export default class Login extends Component {
  render() {
    return (
      <div className={Styles.container}>
        <h2 className={Styles.loginForm}>Log in</h2>
        <a className={classnames('button', Styles.loginForm)} href="/auth/google" id={Styles.loginBtn}>Login through Google</a>
      </div>
    )
  }
}
