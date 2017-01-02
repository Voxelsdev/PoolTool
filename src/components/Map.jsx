import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow, Circle } from "react-google-maps";

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
                if (!props.isAuth()) {
                  return (
                   <Circle
                     center={{ lat: marker.position.lat(), lng: marker.position.lng() }}
                     radius={marker.radius}
                     options={{
                       fillColor: 'red',
                       fillOpacity: 0.20,
                       strokeColor: 'red',
                       strokeOpacity: 1,
                       strokeWeight: 1,
                     }}
                     key={index}
                   />
                  );
                }

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
