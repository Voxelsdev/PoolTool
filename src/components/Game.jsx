import React, { Component } from 'react';
import Styles from './css/game.css';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router';
import axios from 'axios';

const pos = [47.598987, -122.333708];

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      userType: 'joe shmoe'
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
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
          <Map center={pos} zoom={13} style={{height: '100%'}} onClick={this.handleClick}>
            <TileLayer
              url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={pos}>
              <Popup>
                <span>A pretty popup</span>
              </Popup>
            </Marker>
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
