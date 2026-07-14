import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socketId, setSocketId] = useState(null);

    // Initialize Socket.IO connection
    useEffect(() => {
        const socketURL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';
        
        const newSocket = io(socketURL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            query: {
                token: localStorage.getItem('token')
            }
        });

        // Connection events
        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setSocket(newSocket);
            setIsConnected(true);
            setSocketId(newSocket.id);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    /**
     * Send a message/event to server with data
     * @param {string} eventName - Name of the event to emit
     * @param {any} data - Data to send
     * @returns {boolean} - True if socket is connected, false otherwise
     */
    const sendMessage = (eventName, data) => {
        if (!socket || !isConnected) {
            console.warn('Socket not connected. Cannot send message.');
            return false;
        }

        try {
            socket.emit(eventName, data);
            console.log(`Event '${eventName}' sent:`, data);
            return true;
        } catch (error) {
            console.error(`Error sending event '${eventName}':`, error);
            return false;
        }
    };

    /**
     * Listen for messages/events from server
     * @param {string} eventName - Name of the event to listen for
     * @param {function} callback - Callback function to handle received data
     * @returns {function} - Unsubscribe function to stop listening
     */
    const receiveMessage = (eventName, callback) => {
        if (!socket) {
            console.warn('Socket not initialized. Cannot listen for messages.');
            return () => {};
        }

        socket.on(eventName, callback);
        console.log(`Listening for event: '${eventName}'`);

        // Return function to unsubscribe
        return () => {
            socket.off(eventName, callback);
            console.log(`Stopped listening for event: '${eventName}'`);
        };
    };

    /**
     * Join a specific room
     * @param {string} roomId - Room ID to join
     */
    const joinRoom = (roomId) => {
        if (!socket || !isConnected) {
            console.warn('Socket not connected. Cannot join room.');
            return false;
        }

        socket.emit('join', { roomId });
        console.log(`Joined room: ${roomId}`);
        return true;
    };

    /**
     * Leave a specific room
     * @param {string} roomId - Room ID to leave
     */
    const leaveRoom = (roomId) => {
        if (!socket || !isConnected) {
            console.warn('Socket not connected. Cannot leave room.');
            return false;
        }

        socket.emit('leave', { roomId });
        console.log(`Left room: ${roomId}`);
        return true;
    };

    const value = {
        socket,
        isConnected,
        socketId,
        sendMessage,
        receiveMessage,
        joinRoom,
        leaveRoom
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContextProvider;
