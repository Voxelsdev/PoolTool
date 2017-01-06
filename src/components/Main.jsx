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
import Mining from './Mining.jsx';

const socket = io.connect('http://localhost:8080');

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      connectedPool: {},
    }
    this.handleLoginState = this.handleLoginState.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleUse = this.handleUse.bind(this);
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

     if (isLoggedIn && !isLoggingOut && location.href === 'http://localhost:3000/') {
      location.href = '/game';
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

  handleConnection(pool) {
    socket.emit('room', pool.id);

    socket.on('new information', (data) => {
      const nextPool = this.state.connectedPool;

      nextPool.currentAmount = data.currentAmount;
      nextPool.currentHealth = data.currentHealth;
      nextPool.reward = data.reward;
      nextPool.numPlayers = data.numPlayers;

      this.setState({ connectedPool: nextPool });
    });

    const connectedPool = Object.assign({
      currentHealth: pool.health,
      currentAmount: pool.amount,
    }, pool);

    this.setState({
      connectedPool,
    });
  }

  handleDisconnect(id) {
    socket.emit('leave', id);
  }

  handleUse(toolId, toolTier, user) {
    const data = {
      roomId: this.state.connectedPool.id,
      roomAmount: this.state.connectedPool.amount,
      roomHealth: this.state.connectedPool.health,
      userId: user,
      toolId,
      toolTier,
    };

    socket.emit('tool used', data);
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
        <Match pattern="/start" render={() =>
          <Mining pool={this.state.connectedPool}
                  onDisconnect={this.handleDisconnect}
                  onUse={this.handleUse}></Mining>
        }/>
      </div>
    )
  }
}
