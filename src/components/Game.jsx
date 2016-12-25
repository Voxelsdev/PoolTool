import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Styles from './css/game.css';
import Map from './Map.jsx';

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      userType: 'joe shmoe',
      markers: [],
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  handleLogout() {
    this.props.handleLoginState(true, false);
  }

  isAuthenticated() {
    return this.state.userType === 'admin';
  }

  handleMapClick(event) {
    if (this.isAuthenticated()) {
      const newMarkers = [
        ...this.state.markers,
        {
          position: event.latLng,
          defaultAnimation: 2,
          key: Date.now(),
        },
      ];

      this.setState({ markers: newMarkers });
    }
  }

  handleMarkerClick(targetMarker) {
    console.log(targetMarker);
    if (this.isAuthenticated()) {
      const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        this.setState({
          markers: nextMarkers,
        });
    }
  }

  componentDidMount() {
    axios.get('/users/type')
      .then((res) => {
        this.setState({ userType: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
    axios.get('/markers/all')
      .then((res) => {
        const markers = res.data.map((e) => {
          return {
            position: new window.google.maps.LatLng(e.latitude, e.longitude),
            defaultAnimation: 2,
            key: Math.random(),
          }
        });

        this.setState({ markers });
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
          <Map markers={this.state.markers}
               onMapClick={this.handleMapClick}
               handleMarker={this.handleMarkerClick}>
          </Map>
        </div>
        <div className={Styles.mine}>
          <Link to='/mine'
                className={Styles.inventory}
                id={Styles.mineBtn}>Mine</Link>
        </div>
      </div>
    );
  }
}
