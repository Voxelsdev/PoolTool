import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

import GameInventory from './GameInventory.jsx';
import Styles from './css/mining.css';

import moment from 'moment';

export default class Mining extends Component {
  constructor() {
    super();
    this.state = {
      inventory: [],
      timer: '',
      currentTool: {},
    };

    this.handleUse = this.handleUse.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleToolSelect = this.handleToolSelect.bind(this);
  }

  handleUse() {
    console.log('use, gotta send tool used to room');
    this.props.onUse(currentTool);
  }

  handleBack() {
    console.log('back, gotta disconnect');
    this.props.onDisconnect();
  }

  handleToolSelect(tool) {
    console.log('butts');
    this.setState({ currentTool: tool });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      axios.post('/users/inventory/useable', { type: nextProps.pool.type })
        .then((res) => {
          this.setState({ inventory: res.data });

          const currentTime = new Date().getTime();
          const expiration = new Date(nextProps.pool.expiration).getTime();
          let timeLeft = expiration - currentTime;
          let duration = moment.duration(timeLeft * 1000, 'milliseconds');
          let timer = '';

          let time = setInterval(() => {
            if (duration.asSeconds() <= 0 || location.href !== 'http://localhost:3000/start') {
              clearInterval(time);
            } else {
              duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
              this.setState({
                timer: moment(duration.asMilliseconds()).format('d[d]:h[h]:mm[m]:ss[s]'),
              });
            }
          }, 1000);
        })
        .catch((err) => {
        console.error(err);
        });
    }
  }

  render() {
    return (
      <div className={Styles.gameContainer}>
        <div className={Styles.healthContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.health}>Health: {/*this.props.socketPool.currentHealth*/42} / {this.props.pool.health}</p>
          </div>
        </div>
        <div className={Styles.amountContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.amount}>Amount remaining:</p>
            <p className={Styles.amount2}>{/*this.props.socketPool.amount*/42} / {this.props.pool.amount}</p>
          </div>
        </div>
        <div className={Styles.typeContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.type}>Type: {this.props.pool.type}</p>
          </div>
        </div>
        <div className={Styles.timeLeftContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.timeLeft}>Time Remaining:</p>
            <p className={Styles.timeLeft2}>{this.state.timer}</p>
          </div>
        </div>
        <div className={Styles.numOthersContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.numOthers}># Players: {42}</p>
          </div>
        </div>
        <div className={Styles.rewardContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.reward}>Reward: {42}</p>
          </div>
        </div>
        <div className={Styles.useContainer}>
          <div className={Styles.fullFlexy}>
            <button className={Styles.use}
                    id={Styles.use}
                    onClick={this.handleUse}>Use Selected Tool
            </button>
          </div>
        </div>
        <div className={Styles.inventoryContainer}>
          {
            this.state.inventory.map((tool, i) =>
              <GameInventory tool={tool}
                             key={i}
                             onToolSelect={this.handleToolSelect}></GameInventory>
            )
          }
        </div>
        <div className={Styles.backContainer}>
          <div className={Styles.fullFlexy}>
            <Link to='/mine'
                  className={Styles.back}
                  onClick={this.handleBack}>Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
