import React, { Component } from 'react';
import axios from 'axios';
import Styles from './css/inventory.css';
import { Link } from 'react-router';
import Tool from './Tool.jsx';

export default class Inventory extends Component {
  constructor() {
    super();
    this.state = {
      tools: [],
    }
  }

  componentDidMount() {
    axios.get('/users/inventory')
      .then((res) => {
        const tools = res.data;
        this.setState({ tools });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className={Styles.inventoryContainer}>
        <div className={Styles.header}>
          <Link to="/store"
                className={Styles.buy}>Buy new tools</Link>
        </div>
        <div className={Styles.main}>
          {
            this.state.tools.map((tool, i) => {
              return (<Tool tool={tool} key={i}></Tool>);
            })
          }
        </div>
        <div className={Styles.back}>
          <Link to="/game"
                className={Styles.backBtn}>Back To Map</Link>
        </div>
      </div>
    );
  }
}
