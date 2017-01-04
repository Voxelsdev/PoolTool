import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

import Styles from './css/mining.css';

export default class Mining extends Component {
  constructor() {
    super();
    this.state = {
      inventory: [],
    };
  }

  componentDidMount() {
    axios.post('/users/inventory/useable', { type: 'normal' })
      .then((res) => {
        console.log(res.data);
        this.setState({ inventory: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className={Styles.gameContainer}>
        <div className={Styles.healthContainer}>
          <p className={Styles.health}>Health: {/*this.props.pool.currentHealth*/42} / {/*this.props.pool.maxHealth*/42}</p>
        </div>
        <div className={Styles.amountContainer}>
          <p className={Styles.amount}>Amount remaining: {/*this.props.pool.amountLeft*/42} / {/*this.props.pool.amount*/42}</p>
        </div>
        <div className={Styles.typeContainer}>
          <p className={Styles.type}>Type: {/*this.props.pool.type*/'normal'}</p>
        </div>
        <div className={Styles.timeLeftContainer}>
          <p className={Styles.timeLeft}>Time remaining: 42h</p>
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
