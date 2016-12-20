import React, { Component } from 'react';
import { Match, Miss } from 'react-router';
import axios from 'axios';

import Login from './Login.jsx';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    }
    this.handleLoginState = this.handleLoginState.bind(this);
  }

  getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  handleLoginState(isLoggingOut, isLoggingIn) {
    const isLoggedIn = (this.getCookie('loggedIn') === 'true');

    this.setState({ loggedIn: isLoggedIn });

    if (isLoggedIn && !isLoggingOut) {
      window.location.href = '/map';
    }

    if (isLoggedIn && isLoggingOut) {
      axios('/auth/logout')
        .then(() => {
          return this.setState({ loggedIn: isLoggedIn });
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (!isLoggedIn && isLoggingIn) {
      this.setState({ loggedIn: isLoggedIn });
      window.location.href = '/auth/google';
    }
  }

  componentDidMount() {
    this.handleLoginState(false, false);
  }

  render() {
    return (
      <div id="main">
        <Match pattern="/" exactly render={() =>
           <Login handleLoginState={this.handleLoginState}></Login>
        }/>
        <Match pattern="/map" component={Login} />
      </div>
    )
  }
}
