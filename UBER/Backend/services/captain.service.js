// const captainModel = require('../models/captain.model');

// module.exports.createCaptain = async ({
//     firstname, lastname, email, password, color, plate, capacity, vehicleType
// }) => {
//     if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
//         throw new Error('All required fields must be provided');
//     }

//     if (firstname.length < 3) {
//         throw new Error('First name must be at least 3 characters long');
//     }

//     if (lastname && lastname.length < 3) {
//         throw new Error('Last name must be at least 3 characters long');
//     }

//     if (color.length < 3) {
//         throw new Error('Vehicle color must be at least 3 characters long');
//     }

//     if (plate.length < 3) {
//         throw new Error('Vehicle plate must be at least 3 characters long');
//     }

//     if (capacity < 1) {
//         throw new Error('Vehicle capacity must be at least 1');
//     }

//     if (!['car', 'motorcycle', 'auto'].includes(vehicleType)) {
//         throw new Error('Invalid vehicle type');
//     }

//     const hashedPassword = await captainModel.hashPassword(password);

//     const captain = await captainModel.create({
//         fullname: {
//             firstname,
//             lastname
//         },
//         email,
//         password: hashedPassword,
//         vehicle: {
//             color,
//             plate,
//             capacity,
//             vehicleType
//         }
//     });

//     return captain;
// };

const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    // 1. Validation Logic (Keep this)
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All required fields must be provided');
    }

    if (firstname.length < 3) {
        throw new Error('First name must be at least 3 characters long');
    }

    // ... other validations ...

    // 2. REMOVE THE LINE BELOW:
    // const hashedPassword = await captainModel.hashPassword(password); 

    // 3. Create the captain using the password (which is already hashed by the controller)
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password: password, // This is the hash sent from the controller
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });

    return captain;
};
