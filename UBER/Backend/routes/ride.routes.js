const express = require('express');
const router = express.Router();
const { body , query } = require('express-validator')
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { Query } = require('mongoose');

router.post('/create',

    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3, max: 200 }).withMessage('Invalid pickup'),
    body('destination').isString().isLength({ min: 3, max: 200 }).withMessage('Invalid destination'),
    body('vehicleType').isString().isIn(['auto', 'bike', 'car']).withMessage('Invalid vehicle type'),
    rideController.createRide

)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
  
    rideController.confirmRide
)

// router.get('/start-ride',
//     authMiddleware.authCaptain,
//     query('rideId').isMongoId().withMessage('Invalid ride id'),
//     query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
//     rideController.startRide
// )

// router.post('/end-ride',
//     authMiddleware.authCaptain,
//     body('rideId').isMongoId().withMessage('Invalid ride id'),
//     rideController.endRide
// )


async function startRide(otpCode) {
    try {
        const response = await axios.get(
            `${process.env.VITE_BASE_URL}/rides/start-ride`, 
            {
                // Correctly mapping query parameters for GET request
                params: { 
                    rideId: props.ride._id,
                    otp: otpCode // Must be a string exactly 6 characters long
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        console.log('Ride started successfully:', response.data);
        // Your logic here (e.g., navigate to ongoing map screen)

    } catch (error) {
        console.error('Failed to start ride:', error.response?.data || error.message);
    }
}

async function endRide() {
    try {
        const response = await axios.post(
            `${process.env.VITE_BASE_URL}/rides/end-ride`, 
            {
                // Correctly passing JSON data inside request body
                rideId: props.ride._id 
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        console.log('Ride ended successfully:', response.data);
        // Your logic here (e.g., redirect back to captain home panel)

    } catch (error) {
        console.error('Failed to end ride:', error.response?.data || error.message);
    }
}



    // body('distance').isNumeric().withMessage('Distance must be a number'),
    // body('duration').isNumeric().withMessage('Duration must be a number'),
    // body('price').isNumeric().withMessage('Price must be a number'),
    // body('origin').isString().isLength({min:3, max:200}).withMessage('Invalid origin'),
    // authMiddleware.authUser, rideController.createRide  




module.exports = router;