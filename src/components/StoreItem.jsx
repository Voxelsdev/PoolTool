import React, { Component } from 'react';
import axios from 'axios';
import Styles from './css/storeitem.css';
import moment from 'moment';

export default class StoreItem extends Component {
  constructor() {
    super();
    this.state = {
      timer: '',
    };
    this.handleBuy = this.handleBuy.bind(this);
  }

  handleBuy() {
    axios.post('/users/inventory', { requestedTool: this.props.item.id })
      .then((res) => {
        this.props.toast(`${res.data.tool.toolName} bought!`, 'success', 1000);
      })
			.catch((err) => { console.error(err); });
  }

  componentDidMount() {
    const currentTime = new Date().getTime();
    const expiration = new Date(this.props.item.expiration).getTime();
    let timeLeft = expiration - currentTime;
    let duration = moment.duration(timeLeft, 'seconds');
    let timer = '';

    let interval = setInterval(() => {
      if (duration.asSeconds() <= 0 || location.href !== 'http://localhost:3000/store') {
        clearInterval(interval);
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
  }

  render() {
    return (
      <div className={Styles.itemContainer}>
        <div className={Styles.nameContainer}>
          <p className={Styles.name}><span className={Styles.key}>Name:</span> {this.props.item.toolName}</p>
        </div>
        <div className={Styles.tierContainer}>
          <p className={Styles.tier}><span className={Styles.key}>Tier:</span> {this.props.item.tier}</p>
        </div>
        <div className={Styles.durabilityContainer}>
          <p className={Styles.durability}><span className={Styles.key}>Durability:</span> {this.props.item.durability}</p>
        </div>
        <div className={Styles.priceContainer}>
          <p className={Styles.price}><span className={Styles.key}>Price:</span> {this.props.item.price}</p>
        </div>
        <div className={Styles.typeContainer}>
          <p className={Styles.type}><span className={Styles.key}>Type:</span> {this.props.item.type}</p>
        </div>
        <div className={Styles.buyContainer}>
          <button onClick={this.handleBuy}
                  className={Styles.buy}>Buy me!</button>
        </div>
        <div className={Styles.timeLeftContainer}>
          <p className={Styles.timeLeft}>Time Left: {this.state.timer}</p>
        </div>
      </div>
    );
  }
}
