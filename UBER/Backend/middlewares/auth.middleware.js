const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await userModel.findById(decoded._id);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        // Add this validation check right here:
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User account not found' });
        }

        req.user = user;
        return next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports.authCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);

        req.captain = captain;
        return next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};