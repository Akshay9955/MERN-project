require('dotenv').config();
const mongoose = require('mongoose');

function connectToDb() {
    const uri = process.env.DB_CONNECT || process.env.MONGO_URI;
    if (!uri) {
        console.error('MongoDB connection string is not defined. Set DB_CONNECT or MONGO_URI in your .env file.');
        return;
    }

    mongoose
        .connect(uri)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });
}

module.exports = connectToDb;

