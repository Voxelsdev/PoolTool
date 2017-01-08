import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Styles from './css/mine.css';
import StoreItem from './StoreItem.jsx';

export default class Store extends Component {
  constructor() {
    super();
    this.state = {
      tools: [],
      balance: 0,
    };

    this.handleBalanceChange = this.handleBalanceChange.bind(this);
  }

  componentDidMount() {
    axios.get('/store/all')
      .then((res) => {
        this.setState({ tools: res.data.tools, balance: res.data.balance });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleBalanceChange(balance) {
    this.setState({ balance });
  }

  render() {
    return (
      <div className={Styles.fullHeight}>
        <div className={Styles.head}>
          <a className={Styles.inventory}>Your balance: {this.state.balance}</a>
        </div>
        <div className={Styles.main}>
          {
            this.state.tools.map((e, i) => {
              return (
                <StoreItem key={i}
                           item={e}
                           toast={this.props.toast}
                           onBalanceChange={this.handleBalanceChange}/>
              );
            })
          }
        </div>
        <div className={Styles.foot}>
          <Link to="/inventory"
                className={Styles.back}>Inventory</Link>
        </div>
      </div>
    );
  }
}
