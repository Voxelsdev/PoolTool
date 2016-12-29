import React, { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Styles from './css/game.css';
import Map from './Map.jsx';
import Moment from 'moment';

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      userType: 'joe shmoe',
      markers: [],
      type: '',
      amount: -Infinity,
      radius: -Infinity,
      expDay: '',
      expTime: '',
      Health: -Infinity,
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
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
          showInfo: false,
          infoContent: (
            <form onSubmit={this.handleSubmit}>
              <input type="text" placeholder="Type" />
              <input type="number" placeholder="Amount" />
              <input type="number" placeholder="Radius" />
              <input type="date" placeholder="Expiration day" />
              <input type="time" placeholder="Expiration time" />
              <input type="health" placeholder="Health" />
              <input type="submit" placeholder="Submit" />
            </form>
          ),
        },
      ];

      this.setState({ markers: newMarkers });
    }
  }

  handleMarkerClick(tm) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === tm) {
          marker.showInfo = true;
        }
        return marker;
      }),
    });
  }

  handleMarkerClose(tm) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === tm) {
          marker.showInfo = false;
        }
        return marker;
      }),
    });
  }

  handleSubmit(e) {
    if (!this.isAuthenticated()) { return null }

    e.preventDefault();
    const values = e.target.parentElement.children.map((e, i) => {
      return i < 6 ? e.value : 0;
    });

    if (!values[0])  values[0] = 'generic';

    if (!values[1]) values[1] = 100;

    if (!values[2]) values[2] = Math.sqrt(values[1]) * 500;

    if (!values[3] || !values[4]) {
      values[6] = moment().add(1, 'days').format();
    } else {
      values[6] = `${values[3]} ${values[4]}:00-00:00`;
    }

    if (!values[5]) values[5] = 100;

    const normalized = {
      type: values[0],
      amount: values[1],
      radius: values[2],
      expiration: values[6],
      health: values[5],
    };

    axios.post('/markers/new' normalized)
      .then((res) => {
        this.setState(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
            radius: e.radius,
            defaultAnimation: 2,
            key: Math.random(),
            showInfo: false,
            infoContent: (
              <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Type" />
                <input type="number" placeholder="Amount" />
                <input type="number" placeholder="Radius" />
                <input type="date" placeholder="Expiration day"/>
                <input type="time" placeholder="Expiration time" />
                <input type="health" placeholder="Health" />
                <button type="submit" placeholder="Submit" />
              </form>
            ),
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
                onClick={this.handleLogout}>Logout</Link>
        </div>
        <div className={Styles.map}>
          <Map markers={this.state.markers}
               onMapClick={this.handleMapClick}
               onMarkerClick={this.handleMarkerClick}
               onMarkerClose={this.handleMarkerClose}>
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
