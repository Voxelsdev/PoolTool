import React,  { Component } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Styles from './css/mine.css';
import Pool from './Pool.jsx';

export default class Mine extends Component {
  constructor() {
    super();
    this.state = {
      nearby: [],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((geo) => {
      const latLng = {
        lat: geo.coords.latitude,
        lng: geo.coords.longitude,
      };

      axios.post('/markers/near', latLng)
        .then((res) => {
          this.setState({ nearby: res.data });
        })
        .catch((err) => {
          console.error(err);
        });
    }, (error) => {
      if (this.state.nearby.length) {
        this.props.toast('Nav Failure', 'error', 1500);
      } else {
        const latLng = {
          lat: 47.599068599999995,
          lng: -122.33344479999998,
        };

        axios.post('/markers/near', latLng)
          .then((res) => {
            this.setState({ nearby: res.data });
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }, {timeout: 2000});
  }

  render() {
    return (
      <div className={Styles.fullHeight}>
        <div className={Styles.head}>
          <Link to="/inventory"
                className={Styles.inventory}>Inventory</Link>
        </div>
        <div className={Styles.main}>
          {
            this.state.nearby.map((e, i) => {
              return (
                <Pool pool={e}
                      key={i}
                      handleConnection={this.props.handleConnection}/>
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
