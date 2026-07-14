const userModel = require('../models/user.model.js');
const userService = require('../services/user.service.js');
const { validationResult } = require('express-validator');
const blacklistTokenSchema = require('../models/blacklistToken.model.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// module.exports.registerUser = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullname, email, password } = req.body;

//     const isUserAlready = await userModel.findOne({ email });

//     if (isUserAlready) {
//         return res.status(400).json({ message: 'User already exist' });
//     }

//     const hashedPassword = await userModel.hashPassword(password);

//     const user = await userService.createUser({
//         firstname: fullname.firstname,
//         lastname: fullname.lastname,
//         email,
//         password: hashedPassword
//     });

//     const token = user.generateAuthToken();

//     res.status(201).json({ token, user });


// }

// module.exports.loginUser = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
    

//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email }).select('+password');
    
    

//     if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }
  

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }
   

//     const token = user.generateAuthToken();

//     res.cookie('token', token);

//     res.status(200).json({ token, user });
   
// }

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    // Normalize email to lowercase so it matches the login logic
    const normalizedEmail = email.toLowerCase();

    const isUserAlready = await userModel.findOne({ email: normalizedEmail });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    // IMPORTANT: Ensure userService doesn't hash this AGAIN
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email: normalizedEmail,
        password: hashedPassword 
    });

    const token = user.generateAuthToken();

    // Clean sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
}





// module.exports.loginUser = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log('User login validation errors:', errors.array());
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const { email, password } = req.body;

//         // Validate inputs exist
//         if (!email || !password) {
//             console.warn('User login: missing email or password');
//             return res.status(400).json({ message: 'Email and password are required' });
//         }

//         const normalizedEmail = email.trim().toLowerCase();
//         console.log('User login attempt:', { email: normalizedEmail, passwordLength: password.length });

//         // .toLowerCase() ensures login works regardless of caps
//         const user = await userModel.findOne({ email: normalizedEmail }).select('+password');

//         if (!user) {
//             console.warn('User login failed: no user found with email:', normalizedEmail);
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         console.log('User found, comparing passwords...');
//         const isMatch = await user.comparePassword(password);
//         console.log('User password match result:', isMatch);

//         if (!isMatch) {
//             console.warn('User login failed: password mismatch for email:', normalizedEmail);
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = user.generateAuthToken();
//         res.status(200).json({ token, user });

//         // Secure cookie settings are required for React/Axios
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax' 
//         });

//         console.log('User login successful:', { userId: user._id, email: normalizedEmail });
//         res.status(200).json({ token, user });
//     } catch (err) {
//         console.error('User login error:', err.message, err.stack);
//         res.status(500).json({ message: "Internal server error", error: process.env.NODE_ENV === 'development' ? err.message : undefined });
//     }
// }

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Use the email exactly as sent, or ensure you lowercased it during registration too
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // This calls the method in your userModel.js
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        // 1. Set the cookie FIRST
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' 
        });

        // 2. Send the JSON response ONLY ONCE at the very end
        return res.status(200).json({ token, user });

    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
}





module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}


module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        
        // Use optional chaining (?.) to prevent crashing if header is missing
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blacklistTokenSchema.create({ token });
        }

        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ message: "Logout failed" });
    }
}











// module.exports.logoutUser = async (req, res, next) => {
// //     res.clearCookie('token');
// //     const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

// //     await blackListTokenModel.create({ token });

// //     res.status(200).json({ message: 'Logged out' });

// // }


// const userModel = require('../models/user.model');
// const userService = require('../services/user.service');
// const { validationResult } = require('express-validator');
// const blacklistTokenModel = require('../models/blacklistToken.model');

// module.exports.registerUser = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { fullname, email, password } = req.body;

//         const isUserAlreadyExist = await userModel.findOne({ email });
//         if (isUserAlreadyExist) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPassword = await userModel.hashPassword(password);

//         const user = await userService.createUser({
//             firstname: fullname.firstname,
//             lastname: fullname.lastname,
//             email,
//             password: hashedPassword
//         });

//         const token = user.generateAuthToken();
//         res.status(201).json({ token, user });
//     } catch (error) {
//         console.error('User registration error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // module.exports.loginUser = async (req, res, next) => {

// //     try {
// //         const errors = validationResult(req);
// //         if (!errors.isEmpty()) {
// //             return res.status(400).json({ errors: errors.array() });
// //         }

// //         const { email, password } = req.body;
// //         const normalizedEmail = email?.trim().toLowerCase();
// //         const trimmedPassword = password?.trim();

// //         console.log('User login request:', { 
// //             email: normalizedEmail, 
// //             passwordLength: trimmedPassword?.length,
// //             passwordChars: trimmedPassword?.substring(0, 5) + '...',
// //         });

// //         const user = await userModel.findOne({ email: normalizedEmail }).select('+password');
// //         if (!user) {
// //             console.warn('User login failed: user not found', { email: normalizedEmail });
// //             return res.status(401).json({ message: 'Invalid email or password' });
// //         }

// //         console.log('DEBUG - Stored hash:', user.password.substring(0, 20) + '...');
// //         console.log('DEBUG - Password input length:', trimmedPassword?.length);
// //         console.log('DEBUG - Password input preview:', trimmedPassword?.substring(0, 20) + '...');

// //         const isMatch = await user.comparePassword(trimmedPassword);
// //         console.log('Password compare result:', isMatch);
        
// //         if (!isMatch) {
// //             // Try without trimming as last resort
// //             const isMatchUnTrimmed = await user.comparePassword(password);
// //             console.log('Password compare result (untrimmed):', isMatchUnTrimmed);
// //         }

// //         if (!isMatch) {
// //             console.warn('User login failed: password mismatch', { email: normalizedEmail });
// //             return res.status(401).json({ message: 'Invalid email or password' });
// //         }

// //         const token = user.generateAuthToken();
// //         res.cookie('token', token, {
// //             httpOnly: true,
// //             sameSite: 'lax',
// //             secure: process.env.NODE_ENV === 'production',
// //         });

// //         res.status(200).json({ token, user });
// //     } catch (error) {
// //         console.error('User login error:', error);
// //         res.status(500).json({ message: 'Internal server error' });
// //     }
// // };

// module.exports.loginUser = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     console.log('Login request body:', req.body);

//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email }).select('+password');

//     if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = user.generateAuthToken();

//     res.cookie('token', token);

//     res.status(200).json({ token, user });
// }




// module.exports.getUserProfile = async (req, res, next) => {
//     try {
//         res.status(200).json(req.user);
//     } catch (error) {
//         console.error('Get user profile error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports.logoutUser = async (req, res, next) => {
//     try {
//         res.clearCookie('token');
//         const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
//         if (token) {
//             await blacklistTokenModel.create({ token });
//         }
//         res.status(200).json({ message: 'Logged out successfully' });
//     } catch (error) {
//         console.error('User logout error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };