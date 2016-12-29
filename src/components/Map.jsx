import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from "react-google-maps";

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
                marker.radius = 100;
                const circle = new window.google.maps.Circle({
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                  center: { lat: marker.position.lat(), lng: marker.position.lng() },
                  radius: marker.radius,
                });
                return (
                  <Marker
                    {...marker}
                    key={index}
                    onClick={() => props.onMarkerClick(marker)}
                  >
                    {marker.showInfo && (
                      <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                        <div>{marker.infoContent}</div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </GoogleMap>
          }
        />
      </section>
    );
}
