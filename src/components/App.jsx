import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';

import Header from './Header.jsx';
import Main from './Main.jsx';
import styles from './css/app.css'

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Main />
        </div>
      </BrowserRouter>
    )
  }
}
