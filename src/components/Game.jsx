import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Styles from './css/game.css';
import Map from './Map.jsx';

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      userType: 'joe shmoe'
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  handleLogout() {
    this.props.handleLoginState(true, false);
  }

  componentDidMount() {
    axios.get('/users/type')
      .then((res) => {
        this.setState({ userType: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
  }

  render() {
    return (
      <div className={Styles.fullHeight}>
        <div className={Styles.header}>
          <Link to="/inventory"
                className={Styles.inventory}>Inventory</Link>
          <Link to="/"
                className={Styles.logout}
                onClick={this.handleLogout} >Logout</Link>
        </div>
        <div className={Styles.map}>
          <Map markers={[{
              position: {
                  lat: 25.0112183,
                  lng: 121.52067570000001,
                 },
                 key: `Taiwan`,
                 defaultAnimation: 2,
              }]}
              onMapClick={this.onMapClick}>
          </Map>
        </div>
        <div className={Styles.mine}>
          <Link to='/'
                className={Styles.inventory}
                id={Styles.mineBtn}>Mine</Link>
        </div>
      </div>
    );
  }
}
