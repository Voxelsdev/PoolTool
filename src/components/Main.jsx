import React, { Component } from 'react';
import { Match, Miss } from 'react-router';
import axios from 'axios';
import Notifications, { notify } from 'react-notify-toast';

import io from 'socket.io-client';

import Styles from './css/main.css'

import Login from './Login.jsx';
import Game from './Game.jsx';
import Inventory from './Inventory.jsx';
import Store from './Store.jsx';
import Mine from './Mine.jsx';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    }
    this.handleLoginState = this.handleLoginState.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.toast = this.toast.bind(this);
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

  handleConnection(room) {
    const socket = io.connect();

    socket.on('connect', () => {
      socket.emit('room', room);
    });

    socket.on('message', (data) => {
      console.log('Incoming data: ', data);
    });
  }

  toast(message, type, timeout) {
    notify.show(message, type, timeout);
  }

  componentDidMount() {
    this.handleLoginState(false, false);
  }

  render() {
    return (
      <div className={Styles.main}>
        <Notifications />
        <Match pattern="/" exactly render={() =>
           <Login handleLoginState={this.handleLoginState}></Login>
        }/>
        <Match pattern="/game" render={() =>
          <Game handleLoginState={this.handleLoginState}
                toast={this.toast}></Game>
        }/>
        <Match pattern="/inventory" render={() =>
          <Inventory></Inventory>
        }/>
        <Match pattern="/store" render={() =>
          <Store toast={this.toast}></Store>
        }/>
        <Match pattern="/mine" render={() =>
          <Mine handleConnection={this.handleConnection}></Mine>
        }/>
      </div>
    )
  }
}
