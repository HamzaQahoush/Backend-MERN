const axios = require('axios');
const HttpError = require('../models/http-error');
const API_KEY = 'pk.f69608be861430958e22e7f5628d5585';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `http://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(
      address
    )}&format=json`
  );
  let coorLat;
  let coorLon;
  let coordinates = {
    lat: "",
    lng: "",
  };
  console.log(response, 'responseeeeeeeeeeeeeeeee');
  if (!response.data || response.data[0].status === 'ZERO_RESULTS') {
    coorLat = 20;
    coorLon = 25;
     coordinates = {
      lat: coorLat,
      lng: coorLon,
    };
  } else {
    const data = response.data[0];

    coorLat = data.lat;
    coorLon = data.lon;
     coordinates = {
      lat: coorLat,
      lng: coorLon,
    };
  }

  return coordinates;
}

module.exports = getCoordsForAddress;
