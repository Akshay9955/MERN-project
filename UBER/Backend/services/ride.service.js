const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');
const mapsService = require('./maps.service');
const crypto = require('crypto');

// function getOtp(num) {
//     // // Generate random bytes and convert to hex string
//     // const randomBytes = crypto.randomBytes(Math.ceil(num )).toString('hex');
    
//     // // Extract only digits
//     // const digits = randomBytes.replace(/\D/g, '');
//     const randomBytes = crypto.randomBytes(Math.ceil(num)).toString('hex'); // E.g., Generates "a1b2c3d4e5f6"
// const digits = randomBytes.replace(/\D/g, ''); // Removes all non-digits (letters) -> E.g., Leaves "123456" or LESS

    
//     // Return first 'num' digits
//     return digits.substring(0, num);
// }

function getOtp(num) {
    if (num <= 0) return '';
    // Generates a cryptographically secure random integer within the exact length required
    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num) - 1;
    return crypto.randomInt(min, max).toString();
}



async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('pickup and destination are required')
    }
    
    const distanceTime = await mapsService.getDistanceTime(pickup, destination);
    
    console.log('Distance Time Response:', distanceTime);

    // Google Distance Matrix returns different format - check what we got
    const distance = distanceTime.distance?.value || distanceTime.distance?.text || 0;
    const duration = distanceTime.duration?.value || distanceTime.duration?.text || 0;

    let distanceKm = distance;
    let durationMin = duration;

    // If we got text format, extract numbers
    if (typeof distance === 'string') {
        distanceKm = parseInt(distance) / 1000;
    } else if (typeof distance === 'number') {
        distanceKm = distance / 1000;
    }

    if (typeof duration === 'string') {
        durationMin = parseInt(duration) / 60;
    } else if (typeof duration === 'number') {
        durationMin = duration / 60;
    }

    // const fare = {
    //     auto: Math.round(30 + (distanceKm * 15) + (durationMin * 1)),
    //     bike: Math.round(20 + (distanceKm * 8) + (durationMin * 0.5)),
    //     car: Math.round(50 + (distanceKm * 20) + (durationMin * 2))
    // };
    const fare = {
    auto: Math.round(30 + (distanceKm * 15) + (durationMin * 1)),
    bike: Math.round(20 + (distanceKm * 8) + (durationMin * 0.5)),
    car: Math.round(50 + (distanceKm * 20) + (durationMin * 2))
};


    return fare;
}

module.exports.getFare = getFare;


module.exports.createRide = async ({ 
    user, pickup, destination, vehicleType

}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);

    const ride = new rideModel({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType],
        status: 'pending'
    });

    await ride.save();   
    const rideWithUser = await rideModel.findById(ride._id).populate('user');
    return rideWithUser;
 }

 module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}