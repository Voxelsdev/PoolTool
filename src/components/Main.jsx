import React, { Component } from 'react';
import { Match, Miss } from 'react-router';
import axios from 'axios';
import Styles from './css/main.css'

import Login from './Login.jsx';
import Game from './Game.jsx';
import Inventory from './Inventory.jsx';
import Store from './Store.jsx';

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

    if (isLoggedIn && !isLoggingOut && window.location.href !== 'http://localhost:3000/game') {
      window.location.href = '/game';
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
      <div className={Styles.main}>
        <Match pattern="/" exactly render={() =>
           <Login handleLoginState={this.handleLoginState}></Login>
        }/>
        <Match pattern="/game" render={() =>
          <Game handleLoginState={this.handleLoginState}></Game>
        }/>
        <Match pattern="/inventory" render={() =>
          <Inventory></Inventory>
        }/>
        <Match pattern="/store" component={Store} />
      </div>
    )
  }
}
