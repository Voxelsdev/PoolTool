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
      testtool: [{
        id: 1,
        toolName: 'pickaxe',
        tier: 42,
        durability: 100,
        iconUrl: 'http://i.imgur.com/u9fIpFN.png',
      }],
    }
  }

  componentDidMount() {
    axios.get('/users/inventory')
      .then((res) => {
        const tools = res.data;
        this.setState({ tools });
      })
      .catch(err => {
        console.log(err);
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
            this.state.testtool.map((tool) => {
              return (<Tool tool={tool} key={tool.id}></Tool>);
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
