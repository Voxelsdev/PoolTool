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
      user: {},
    };

    this.handleUse = this.handleUse.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleToolSelect = this.handleToolSelect.bind(this);
  }

  handleUse() {
    this.props.onUse(this.state.currentTool.id, this.state.currentTool.tier, this.state.user.id);
  }

  handleBack() {
    this.props.onDisconnect(this.props.pool.id);
  }

  handleToolSelect(tool) {
    this.props.toast(`${tool.toolName}!`, 'warning', 1000);
    this.setState({ currentTool: tool });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pool !== nextProps.pool) {
      axios.post('/users/inventory/useable', { type: nextProps.pool.type })
        .then((res) => {
          this.setState({ inventory: res.data });

          const currentTime = new Date().getTime();
          const expiration = new Date(nextProps.pool.expiration).getTime();
          let timeLeft = expiration - currentTime;
          let duration = moment.duration(timeLeft * 1000, 'milliseconds');
          let timer = '';

          let time = setInterval(() => {
            if (duration.asSeconds() <= 0 || location.href !== 'http://jackpool.herokuapp.com/start') {
              clearInterval(time);
            } else {
              duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
              this.setState({
                timer: moment(duration.asMilliseconds()).format('d[d]:[ ]h[h]:[ ]mm[m]:[ ]ss[s]'),
              });
            }
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  componentWillMount() {
    window.addEventListener('beforeunload', () => {
      this.handleBack();
    });

    axios.get('/auth/user')
      .then((res) => {
        this.setState({ user: res.data });
      })
      .catch((err) => {
        console.error(err);
      });

    axios.post('/users/inventory/useable', { type: this.props.pool.type })
      .then((res) => {
        this.setState({ inventory: res.data });

        const currentTime = moment(new Date().getTime(), 'x');
        const expiration = new Date(this.props.pool.expiration).getTime();
        let timeLeft = expiration - currentTime;
        let duration = moment.duration(timeLeft * 1000, 'milliseconds');
        let timer = '';

        let time = setInterval(() => {
          if (duration.asMilliseconds() <= 0 || location.href !== 'http://localhost:3000/start') {
            clearInterval(time);
          } else {
            duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
            this.setState({
              timer: moment(duration.asMilliseconds()).format('d[d]:[ ]h[h]:[ ]mm[m]:[ ]ss[s]'),
            });
          }
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className={Styles.gameContainer}>
        <div className={Styles.healthContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.health}>Health:</p>
            <p className={Styles.health}>{this.props.pool.currentHealth} / {this.props.pool.health}</p>
          </div>
        </div>
        <div className={Styles.amountContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.amount}>Amount remaining:</p>
            <p className={Styles.amount2}>{this.props.pool.currentAmount} / {this.props.pool.amount}</p>
          </div>
        </div>
        <div className={Styles.typeContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.type}>Type:</p>
            <p className={Styles.type}>{this.props.pool.type}</p>
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
            <p className={Styles.numOthers}># Players: {this.props.pool.numPlayers}</p>
          </div>
        </div>
        <div className={Styles.rewardContainer}>
          <div className={Styles.fullFlexy}>
            <p className={Styles.reward}>Reward: {this.props.pool.reward}</p>
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
