// const socketIO = require('socket.io');
// const userModel = require ('./models/user.model')
// const captainModel = require('./models/captain.model')

// let io;
// const connectedUsers = {}; // Map to store socket id to user data
// const userSocketMap = {}; // Map userId -> socketId
// const captainSocketMap = {}; // Map captainId -> socketId

// /**
//  * Initialize Socket.IO with the HTTP server
//  * @param {http.Server} server - The HTTP server instance
//  * @returns {SocketIO.Server} - The Socket.IO instance
//  */
// const initializeSocket = (server) => {
//     io = socketIO(server, {
//         cors: {
//             origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//             methods: ['GET', 'POST'],
//             credentials: true
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log(`New connection: ${socket.id}`);

//         // Event: User/Captain joins - store user info
//         socket.on('join', async(data)=>{
//             try {
//                 const{ userId, userType } = data;
//                 connectedUsers[socket.id] = { userId, userType, socketId: socket.id };
                
//                 if(userType === 'user'){
//                     userSocketMap[userId] = socket.id;
//                     await userModel.findByIdAndUpdate(userId, {socketId: socket.id});
//                     console.log(`User ${userId} connected with socket ${socket.id}`);

//                 }else if (userType === 'captain'){
//                     captainSocketMap[userId] = socket.id;
//                     await captainModel.findByIdAndUpdate(userId, {socketId: socket.id});
//                     console.log(`Captain ${userId} connected with socket ${socket.id}`);
//                 }
//             } catch (error) {
//                 console.error('Error in join event:', error);
//             }
//         });



//         // Event: Send message to specific user
//         socket.on('send-message', (data) => {
//             const { recipientSocketId, message, senderData } = data;
            
//             if (connectedUsers[recipientSocketId]) {
//                 io.to(recipientSocketId).emit('receive-message', {
//                     message,
//                     sender: senderData,
//                     timestamp: new Date()
//                 });
//                 console.log(`Message sent to ${recipientSocketId}`);
//             } else {
//                 console.log(`Recipient ${recipientSocketId} not found`);
//             }
//         });

//         // Event: User disconnects
//         socket.on('disconnect', () => {
//             console.log(`User disconnected: ${socket.id}`);
//             const userData = connectedUsers[socket.id];
//             if (userData) {
//                 if (userData.userType === 'user') {
//                     delete userSocketMap[userData.userId];
//                 } else if (userData.userType === 'captain') {
//                     delete captainSocketMap[userData.userId];
//                 }
//             }
//             delete connectedUsers[socket.id];
//             console.log('Connected users:', Object.keys(connectedUsers));
//         });

//         // Event: Broadcast location updates
//         socket.on('location-update', (data) => {
//             socket.broadcast.emit('location-updated', {
//                 userId: socket.id,
//                 location: data.location
//             });
//         });

//         socket.on('update-location-captain', async (data) => {
//             try {
//                 const { userId, location } = data;
//                 if (!location || !location.lat || !location.lng) {
//                     return;
//                 }
//                 await captainModel.findByIdAndUpdate(userId, {
//                     location: {
//                         ltd: location.lat,
//                         lng: location.lng
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error updating captain location:', error);
//             }
//         });
//     });

//     return io;
// };

// /**
//  * Send a message to a specific user by socket ID
//  * @param {string} socketId - The socket ID of the recipient
//  * @param {string} eventName - The event name to emit
//  * @param {object} data - The data to send
//  * @returns {boolean} - True if user exists, false otherwise
//  */
// const sendMessageToSocketId = (socketId, eventName, data) => {
//     if (!io) {
//         console.error('Socket.IO not initialized');
//         return false;
//     }

//     try {
//         io.to(socketId).emit(eventName, data);
//         console.log(`Event '${eventName}' sent to socket ${socketId}`);
//         return true;
//     } catch (error) {
//         console.error(`Error sending event '${eventName}' to ${socketId}:`, error);
//         return false;
//     }
// };

// /**
//  * Send message to a specific user by user ID
//  * @param {string} userId - The user ID
//  * @param {string} eventName - Event name
//  * @param {object} data - Data to send
//  * @returns {boolean} - Success status
//  */
// const sendMessageToUser = (userId, eventName, data) => {
//     const socketId = userSocketMap[userId];
//     if (socketId) {
//         return sendMessageToSocketId(socketId, eventName, data);
//     }
//     console.log(`User ${userId} not connected`);
//     return false;
// };

// /**
//  * Send message to a specific captain by captain ID
//  * @param {string} captainId - The captain ID
//  * @param {string} eventName - Event name
//  * @param {object} data - Data to send
//  * @returns {boolean} - Success status
//  */
// const sendMessageToCaptain = (captainId, eventName, data) => {
//     const socketId = captainSocketMap[captainId];
//     if (socketId) {
//         return sendMessageToSocketId(socketId, eventName, data);
//     }
//     console.log(`Captain ${captainId} not connected`);
//     return false;
// };

// /**
//  * Get all connected users
//  * @returns {object} - Object containing all connected users
//  */
// const getConnectedUsers = () => {
//     return connectedUsers;
// };

// /**
//  * Get IO instance if needed for other parts of the app
//  * @returns {SocketIO.Server} - The Socket.IO instance
//  */
// const getIO = () => {
//     return io;
// };

// module.exports = {
//     initializeSocket,
//     sendMessageToSocketId,
//     sendMessageToUser,
//     sendMessageToCaptain,
//     getConnectedUsers,
//     getIO,
//     userSocketMap,
//     captainSocketMap
// };



const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };