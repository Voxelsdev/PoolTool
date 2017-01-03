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
    };
  }

  componentDidMount() {
    axios.get('/store/all')
      .then((res) => {
        this.setState({ tools: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className={Styles.fullHeight}>
        <div className={Styles.head}>
          <Link to="/inventory"
                className={Styles.inventory}>Back to Inventory</Link>
        </div>
        <div className={Styles.main}>
          {
            this.state.tools.map((e, i) => {
              return (
                <StoreItem key={i}
                           item={e}
                           toast={this.props.toast} />
              );
            })
          }
        </div>
        <div className={Styles.foot}>
          <Link to="/game"
                className={Styles.back}>Back to Map</Link>
        </div>
      </div>
    );
  }
}
