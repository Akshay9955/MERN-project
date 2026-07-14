const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

// module.exports.getAddressCoordinate = async (req, res) => {
//     const address = req.query.address;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     if (!address) {
//         return res.status(400).json({ error: 'Address query parameter is required' });
//     }

//     try {
//         const coordinates = await mapService.getAddressCoordinate(address);
//         if (coordinates) {
//             res.json(coordinates);
//         } else {
//             res.status(404).json({ error: 'Coordinates not found for the given address' });
//         }
//     } catch (error) {
//         console.error('Error fetching coordinates:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }   

// }

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}


// module.exports.getDistanceAndTime = async (req, res) => {
//     const origin = req.query.origin;
//     const destination = req.query.destination;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     if (!origin || !destination) {
//         return res.status(400).json({ error: 'Origin and destination query parameters are required' });
//     }

//     try {
//         const result = await mapService.getDistanceAndTime(origin, destination);
//         if (result) {
//             res.json(result);
//         } else {
//             res.status(404).json({ error: 'Distance and time not found for the given origin and destination' });
//         }
//     } catch (error) {
//         console.error('Error fetching distance and time:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }

// }
module.exports.getDistanceTime = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// module.exports.getSuggestions = async (req, res) => {

//     const input = req.query.input;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     if (!input) {
//         return res.status(400).json({ error: 'Input query parameter is required' });
//     }

//     try {
//         const suggestions = await mapService.getSuggestions(input);
//         if (suggestions) {
//             res.json(suggestions);
//         } else {
//             res.status(404).json({ error: 'No suggestions found for the given input' });
//         }
//     } catch (error) {
//         console.error('Error fetching suggestions:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }   