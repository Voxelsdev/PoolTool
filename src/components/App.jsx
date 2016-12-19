import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import AuthService from '../utils/AuthService';

import Header from './Header';
import Main from './Main';
import Login from './Login.jsx';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      auth: new AuthService('MGb7kMb0m1LaMy5VZIAOvObm4RiZenlE', 'tylermiller.auth0.com'),
    }
    this.requireAuth = this.requireAuth.bind(this);
  }

  requireAuth(nextState, replace) {
    if (!this.state.auth.loggedIn()) {
      replace({ pathname: '/login' });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Match pattern="/" exactly componenet={Main} onEnter={this.requireAuth} />
          <Match pattern="/login" render={
            <Login auth={this.state.auth}/>
          } />
        </div>
      </BrowserRouter>
    )
  }
}
