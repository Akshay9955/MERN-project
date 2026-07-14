 const axios = require('axios');
 const captainModel = require('../models/captain.model');


module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const apiKey = process.env.GOOGLE_MAP_API;
    if (!apiKey) {
        throw new Error('GOOGLE_MAP_API environment variable is not set');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Google Maps API Response:', response.data);

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            console.error('Google Maps Error:', response.data.status, response.data.error_message);
            throw new Error(`Unable to fetch coordinates: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAP_API;
    if (!apiKey) {
        throw new Error('GOOGLE_MAP_API environment variable is not set');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Distance Matrix API Response:', response.data);

        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[0].elements[0];
        } else {
            console.error('Google Maps Error:', response.data.status, response.data.error_message);
            throw new Error(`Unable to fetch distance and time: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        }

    } catch (err) {
        console.error('Error fetching distance and time:', err.message);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Input is required');
    }

    const apiKey = process.env.GOOGLE_MAP_API;
    if (!apiKey) {
        throw new Error('GOOGLE_MAP_API environment variable is not set');
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Places API Response:', response.data);

        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            console.error('Google Maps Error:', response.data.status, response.data.error_message);
            throw new Error(`Unable to fetch suggestions: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error('Error fetching suggestions:', err.message);
        throw err;
    }
}


module.exports.getCaptainsInTheRadius= async (lat, lng, radius)=>{
    
    const captains = await captainModel.find({
            location:{
        $geoWithin:{
            $centerSphere:[[lng, lat], radius/6371]
        }
      }
    });
    return captains;
      
}