
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);


module.exports = userModel;



// const mongoose = require('mongoose');

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const userSchema = new mongoose.Schema({
//     fullname: {
//         firstname: {
//             type: String,
//             required: true,
//             minlength: [3, 'First name must be at least 3 characters long'],
//         },
//         lastname: {
//             type: String,
//             minlength: [3, 'Last name must be at least 3 characters long'],
//         },
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         minlength: [5, 'Email must be at least 5 characters long'],
//         lowercase: true,
//         match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//     },
//     password: {
//         type: String,
//         required: true,
//         select: false,
//     },
//     socketId: {
//         type: String,
//     },
// });

// userSchema.methods.generateAuthToken = function() {
//     const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
//     return token;
// };

// // userSchema.methods.comparePassword = async function(password) {
// //     return await bcrypt.compare(password, this.password);
// // };

// // Inside your userSchema (models/user.model.js)
// userSchema.methods.comparePassword = async function (password) {
//     const trimmedPassword = password?.trim();
//     console.log('COMPARE DEBUG - Provided password length:', trimmedPassword?.length);
//     console.log('COMPARE DEBUG - Stored hash length:', this.password?.length);
//     const result = await bcrypt.compare(trimmedPassword, this.password);
//     console.log('COMPARE DEBUG - bcrypt.compare result:', result);
//     return result;
// }

// userSchema.statics.hashPassword = async function(password) {
//     return await bcrypt.hash(password, 10);
// };

// const userModel = mongoose.model('user', userSchema);
// module.exports = userModel;
    
// // const userModel = mongoose.model('user', userSchema);

// // module.exports= userModel;