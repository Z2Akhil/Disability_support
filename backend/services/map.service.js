const axios = require('axios');
require('dotenv').config();

class MapService {
  static async geocodeAddress(address) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Geocoding failed: ' + response.data.status);
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  static async getNearbyPlaces(latitude, longitude, type, radius = 5000) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Places API failed: ' + response.data.status);
      }

      return response.data.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        location: place.geometry.location,
        rating: place.rating,
        accessibility: place.accessibility_rating || null
      }));
    } catch (error) {
      console.error('Places API error:', error);
      throw new Error('Failed to fetch nearby places');
    }
  }

  static async getDirections(origin, destination, mode = 'driving') {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin,
          destination,
          mode,
          alternatives: true,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Directions API failed: ' + response.data.status);
      }

      return response.data.routes.map(route => ({
        distance: route.legs[0].distance,
        duration: route.legs[0].duration,
        steps: route.legs[0].steps,
        accessibilityInfo: route.accessibility_info || null
      }));
    } catch (error) {
      console.error('Directions API error:', error);
      throw new Error('Failed to get directions');
    }
  }

  static async getAccessibilityInfo(placeId) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'wheelchair_accessible_entrance,accessible_toilet',
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Place details API failed: ' + response.data.status);
      }

      return response.data.result;
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error('Failed to get accessibility info');
    }
  }
}

module.exports = MapService;