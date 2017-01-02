import React, { Component } from 'react';
import Styles from './css/storeitem.css';
import moment from 'moment';

export default class StoreItem extends Component {
  constructor() {
    super();
    this.state = {
      timer: '',
    };
  }

  componentDidMount() {
    const currentTime = new Date().getTime();
    const expiration = new Date(this.props.item.expiration).getTime();
    let timeLeft = expiration - currentTime;
    let duration = moment.duration(timeLeft, 'seconds');
    let timer = '';

    setInterval(() => {
      if (duration.asSeconds() <= 0) {
        clearInterval(intervalId);
      }

      duration = moment.duration(duration.asSeconds() - 1, 'seconds');
      this.setState({
        timer: `${duration.days()}d:
                ${duration.hours()}h:
                ${duration.minutes()}m:
                ${duration.seconds()}s`,
      });
    }, 1000);
  }

  render() {
    return (
      <div className={Styles.itemContainer}>
        <div className={Styles.nameContainer}>
          <p className={Styles.name}>Name: {this.props.item.toolName}</p>
        </div>
        <div className={Styles.tierContainer}>
          <p className={Styles.tier}>Tier: {this.props.item.tier}</p>
        </div>
        <div className={Styles.durabilityContainer}>
          <p className={Styles.durability}>Durability: {this.props.item.durability}</p>
        </div>
        <div className={Styles.priceContainer}>
          <p className={Styles.price}>Price: {this.props.item.price}</p>
        </div>
        <div className={Styles.typeContainer}>
          <p className={Styles.type}>Type: {this.props.item.type}</p>
        </div>
        <div className={Styles.timeLeftContainer}>
          <p className={Styles.timeLeft}>Time Left: {this.state.timer}</p>
        </div>
      </div>
    );
  }
}
