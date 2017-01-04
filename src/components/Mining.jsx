import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

import Styles from './css/mining.css';

import moment from 'moment';

export default class Mining extends Component {
  constructor() {
    super();
    this.state = {
      pool: {},
      inventory: [],
      timer: '',
    };
  }

  componentDidMount() {
    axios.post('/markers/specific', { poolId: this.props.poolid })
      .then((data) => {
        const pool = data.data;
        console.log(pool);
        axios.post('/users/inventory/useable', { type: pool.type })
          .then((res) => {
            this.setState({ inventory: res.data, currentPool: pool });

            const currentTime = new Date().getTime();
            const expiration = new Date(pool.expiration).getTime();
            let timeLeft = expiration - currentTime;
            let duration = moment.duration(timeLeft * 1000, 'milliseconds');
            let timer = '';

            let time = setInterval(() => {
              if (duration.asSeconds() <= 0 || location.href !== 'http://localhost:3000/start') {
                clearInterval(time);
              } else {
                duration = moment.duration(duration.asSeconds() - 1, 'seconds');
                this.setState({
                timer: `${duration.days()}d:
                        ${duration.hours()}h:
                        ${duration.minutes()}m:
                        ${duration.seconds()}s`,
                });
              }
            }, 1000);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className={Styles.gameContainer}>
        <div className={Styles.healthContainer}>
          <p className={Styles.health}>Health: {/*this.props.pool.currentHealth*/42} / {this.state.pool.health}</p>
        </div>
        <div className={Styles.amountContainer}>
          <p className={Styles.amount}>Amount remaining: {/*this.props.pool.amountLeft*/42} / {this.state.pool.amount}</p>
        </div>
        <div className={Styles.typeContainer}>
          <p className={Styles.type}>Type: {this.state.pool.type}</p>
        </div>
        <div className={Styles.timeLeftContainer}>
          <p className={Styles.timeLeft}>Time Remaining: {this.state.timer}</p>
        </div>
        <div className={Styles.numOthersContainer}>
          <p className={Styles.numOthers}># Players: {42}</p>
        </div>
        <div className={Styles.rewardContainer}>
          <p className={Styles.reward}>Reward: {42}</p>
        </div>
        <div className={Styles.useContainer}>
          <button className={Styles.use}>Use Selected Tool</button>
        </div>
        <div className={Styles.inventoryContainer}>
          <p>Inventory component here</p>
        </div>
        <div className={Styles.backContainer}>
          <Link to='/mine'>Go Back</Link>
        </div>
      </div>
    );
  }
}
