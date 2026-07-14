const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require ('../services/maps.service')
const {sendMessageToCaptain, getIO} = require('../socket')

module.exports.createRide = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { pickup, destination, vehicleType } = req.body;
       

        try {
            const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
            
            // Get pickup coordinates
            const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
            console.log('Pickup Coordinates:', pickupCoordinates);
            
            // Get captains in radius
            const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2)
            console.log('Captains in radius:', captainsInRadius.length);

            // Send ride notification to all captains in radius
            captainsInRadius.forEach(captain => {
                if (captain.socketId) {
                    sendMessageToCaptain(captain._id, 'new-ride', {
                        ride,
                        pickupLocation: pickupCoordinates
                    });
                }
            });
            
            return res.status(201).json(ride);

        } catch (error) {
            console.error('Error creating ride:', error.message);
            console.error('Full error:', error);
           return res.status(500).json({ error: 'Failed to create ride', details: error.message });
        }   
};


module.exports.getFare = async (req, res)=>{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
      }
      const {pickup, destination} = req.query;
      try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
      } catch (error) {
        console.error('Error fetching fare:', error.message);
        return res.status(500).json({message: error.message});
      }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}