const captainModel = require('../models/captain.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

// module.exports.registerCaptain = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { fullname, email, password, vehicle } = req.body;
//         const isCaptainAlreadyExist = await captainModel.findOne({ email });
//         if (isCaptainAlreadyExist) {
//             return res.status(400).json({ message: 'Captain already exists' });
//         }

//         const hashedPassword = await captainModel.hashPassword(password);

//         const captain = await captainService.createCaptain({
//             firstname: fullname.firstname,
//             lastname: fullname.lastname,
//             email,
//             password: hashedPassword,
//             color: vehicle.color,
//             plate: vehicle.plate,
//             capacity: vehicle.capacity,
//             vehicleType: vehicle.vehicleType
//         });

//         const token = captain.generateAuthToken();
//         res.status(201).json({ token, captain });
//     } catch (error) {
//         console.error('Captain registration error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports.loginCaptain = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             console.log('Captain login validation errors:', errors.array());
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { email, password } = req.body;
        
//         // Validate inputs exist
//         if (!email || !password) {
//             console.warn('Captain login: missing email or password');
//             return res.status(400).json({ message: 'Email and password are required' });
//         }

//         const normalizedEmail = email.trim().toLowerCase();
//         console.log('Captain login attempt:', { email: normalizedEmail, passwordLength: password.length });

//         const captain = await captainModel.findOne({ email: normalizedEmail }).select('+password');

//         if (!captain) {
//             console.warn('Captain login failed: no user found with email:', normalizedEmail);
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         console.log('Captain found, comparing passwords...');
//         const isMatch = await captain.comparePassword(password);
//         console.log('Captain password match result:', isMatch);

//         if (!isMatch) {
//             console.warn('Captain login failed: password mismatch for email:', normalizedEmail);
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = captain.generateAuthToken();
//         res.cookie('token', token, {
//             httpOnly: true,
//             sameSite: 'lax',
//             secure: process.env.NODE_ENV === 'production',
//         });

//         console.log('Captain login successful:', { captainId: captain._id, email: normalizedEmail });
//         res.status(200).json({ token, captain });
//     } catch (error) {
//         console.error('Captain login error:', error.message, error.stack);
//         res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
//     }
// };




module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        // 1. Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();

        const isCaptainAlreadyExist = await captainModel.findOne({ email: normalizedEmail });
        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // 2. Hash the password ONLY ONCE (Right here)
        const hashedPassword = await captainModel.hashPassword(password);

        // 3. Pass the hash to the service
        // IMPORTANT: Ensure captainService.createCaptain DOES NOT hash it again!
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email: normalizedEmail,
            password: hashedPassword, // Send the already hashed password
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });

        const token = captain.generateAuthToken();

        // 4. Remove password from the response object
        const captainResponse = captain.toObject();
        delete captainResponse.password;

        return res.status(201).json({ token, captain: captainResponse });

    } catch (error) {
        console.error('Captain registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Fetch captain and include password field
        const captain = await captainModel.findOne({ email: normalizedEmail }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Compare password (Ensure you deleted old double-hashed records from DB!)
        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Generate Auth Token
        const token = captain.generateAuthToken();

        // 4. Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        // 5. Remove password from the object before sending response
        const captainData = captain.toObject();
        delete captainData.password;

        // 6. Final response (only call this ONCE)
        return res.status(200).json({ token, captain: captainData });

    } catch (error) {
        console.error('Captain login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.captain);
    } catch (error) {
        console.error('Get captain profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (token) {
            await blacklistTokenModel.create({ token });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Captain logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

