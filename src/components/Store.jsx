import React, { Component } from 'react';
import axios from 'axios';
import Styles from './css/store.css';

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
        let tools = res.data;
        this.setState({ tools });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div></div>
    );
  }
}
