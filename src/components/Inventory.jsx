import React, { Component } from 'react';
import axios from 'axios';

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
        console.log(err);
      });
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}
