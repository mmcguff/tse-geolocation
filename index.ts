/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let map: google.maps.Map;
let loc = document.getElementById('location');

function initMap(_lat, _lng): void {
  
  const mapOptions = {
    zoom: 8,
    center: { lat: _lat, lng: _lng },
  };

  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    mapOptions
  );

  const marker = new google.maps.Marker({
    // The below line is equivalent to writing:
    // position: new google.maps.LatLng(-34.397, 150.644)
    position: { lat: _lat, lng: _lng },
    map: map,
  });

  (document.getElementById("submit") as HTMLElement).addEventListener(
    "click",
    () => {
      geocodeLatLng(geocoder, map, infowindow);
    }
  );


}

function geocodeLatLng(
  geocoder: google.maps.Geocoder,
  map: google.maps.Map,
  infowindow: google.maps.InfoWindow
) {
  const input = (document.getElementById("latlng") as HTMLInputElement).value;
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        map.setZoom(11);

        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
        });

        infowindow.setContent(response.results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}


function getLocation() {
  console.log('I got called');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    loc.innerHTML = 'Geolocation is not supported by this browser.';
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  loc.innerHTML =
    'Latitude: ' +
    lat +
    '<br>Longitude: ' +
    lng;
  initMap(lat, lng);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

window.onload = getLocation;

export {};
