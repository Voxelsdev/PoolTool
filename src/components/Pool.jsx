import React, { Component } from 'react';
import { Link } from 'react-router';
import Styles from './css/pool.css';

export default class Pool extends Component {
  constructor() {
    super();
    this.onConnect = this.onConnect.bind(this);
  }

  onConnect() {
    this.props.handleConnection(this.props.pool);
  }

  render() {
    return (
      <div className={Styles.poolContainer}>
        <div className={Styles.amountContainer}>
          <p className={Styles.amount}>Amount: {this.props.pool.amount}</p>
        </div>
        <div className={Styles.typeContainer}>
          <p className={Styles.type}>Type: {this.props.pool.type}</p>
        </div>
        <div className={Styles.healthContainer}>
          <p className={Styles.health}>Health: {this.props.pool.health}</p>
        </div>
        <div className={Styles.mineContainer}>
          <Link to="/start"
                className={Styles.mine}
                onClick={this.onConnect}>Mine!</Link>
        </div>
      </div>
    );
  }
}
