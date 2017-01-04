import React, { Component } from 'react';
import Styles from './css/gameinventory.css';

export default class GameInventory extends Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    this.props.onToolSelect(this.props.tool);
  }

  render() {
    return (
      <div className={Styles.toolContainer}
           onClick={this.handleSelect}>
          <p className={Styles.info}>Name: {this.props.tool.toolName}</p>
          <p className={Styles.info}>Type: {this.props.tool.type}</p>
          <p className={Styles.info}>Tier: {this.props.tool.tier}</p>
          <p className={Styles.info}>Durability: {this.props.tool.durability}</p>
        </div>
    );
  }
}
