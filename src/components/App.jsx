import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';

import Header from './Header.jsx';
import Main from './Main.jsx';
import styles from './css/app.css'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter className={styles.fullHeight}>
        <div className={styles.fullHeight}>
          <Header />
          <Main  className={styles.fullHeight}/>
        </div>
      </BrowserRouter>
    )
  }
}
