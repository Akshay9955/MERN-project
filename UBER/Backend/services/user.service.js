// const userModel = require('../models/user.model');

// module.exports.createUser = async ({
//     firstname, lastname, email, password
// }) => {
//     if (!firstname || !email || !password) {
//         throw new Error('All required fields must be provided');
//     }

//     if (firstname.length < 3) {
//         throw new Error('First name must be at least 3 characters long');
//     }

//     if (lastname && lastname.length < 3) {
//         throw new Error('Last name must be at least 3 characters long');
//     }

//     const hashedPassword = await userModel.hashPassword(password);

//     const user = await userModel.create({
//         fullname: {
//             firstname,
//             lastname
//         },
//         email,
//         password: hashedPassword
//     });

//     return user;
// };


const userModel = require('../models/user.model');

module.exports.createUser = async ({
    firstname, lastname, email, password
}) => {
    // 1. Basic validation
    if (!firstname || !email || !password) {
        throw new Error('All required fields must be provided');
    }

    // 2. Create the user directly
    // NOTE: 'password' here is already hashed by the controller
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password: password // Use the password as passed from controller
    });

    return user;
};
