import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";

export default function Map (props) {
    return (
      <section style={{height: "100%"}}>
        <GoogleMapLoader
          containerElement={
            <div
              {...props.containerElementProps}
              style={{
                height: "100%",
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => map }
              defaultZoom={13}
              defaultCenter={{ lat: 47.599037, lng: -122.333794 }}
              onClick={props.onMapClick}
              defaultOptions={{
                styles: require('../../utils/mapstyle.json'),
              }}
            >
              {props.markers.map((marker, index) => {
                return (
                  <Marker
                    {...marker}
                    onRightclick={() => props.onMarkerRightclick(index)} />
                );
              })}
            </GoogleMap>
          }
        />
      </section>
    );
}
