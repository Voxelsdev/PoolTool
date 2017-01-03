import React, { Component } from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';

import Main from './Main.jsx';
import styles from './css/app.css'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter className={styles.fullHeight}>
        <div className={styles.fullHeight}>
          <Main  className={styles.fullHeight}/>
        </div>
      </BrowserRouter>
    )
  }
}
