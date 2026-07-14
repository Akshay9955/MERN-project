# UBER Clone - Complete Integration Guide

## Overview
This document outlines all the integrated components connecting the user, captain, and real-time Socket.IO communication between frontend and backend.

---

## Backend Socket.IO Server (`/Backend/socket.js`)

### Connection Tracking
```javascript
- userSocketMap: Maps userId → socketId (for Users)
- captainSocketMap: Maps captainId → socketId (for Captains)  
- connectedUsers: Stores complete connection metadata
```

### Core Functions

#### 1. `initializeSocket(server)`
- Initializes Socket.IO with CORS configuration
- Handles 'join' event to register users/captains
- Tracks connections and updates database with socketId
- Handles disconnections and cleanup

#### 2. `sendMessageToSocketId(socketId, eventName, data)`
- Sends message directly to a socket ID
- Used for low-level socket communication

#### 3. `sendMessageToUser(userId, eventName, data)`
- **NEW**: Sends message to a specific user by userId
- Looks up socketId from userSocketMap
- Example: `sendMessageToUser(userId, 'ride-accepted', rideData)`

#### 4. `sendMessageToCaptain(captainId, eventName, data)`
- **NEW**: Sends message to a specific captain by captainId
- Looks up socketId from captainSocketMap
- Example: `sendMessageToCaptain(captainId, 'new-ride', rideData)`

---

## Backend Ride Creation Flow (`/Backend/controllers/ride.controller.js`)

### Updated `createRide` Function
```javascript
1. Validate request
2. Create ride in database
3. Get pickup coordinates (lat, lng)
4. Find captains within radius
5. Send 'new-ride' event to all nearby captains via sendMessageToCaptain()
6. Return ride data to user
```

### Socket Events Emitted
- **Event**: `new-ride`
- **Recipients**: All captains within 2km radius
- **Data Structure**:
  ```javascript
  {
    ride: { _id, user, pickup, destination, vehicleType, otp, fare },
    pickupLocation: { lat, lng }
  }
  ```

---

## Frontend User Connection (`/Frontend/src/pages/Home.jsx`)

### Socket Join Event
```javascript
useEffect(()=>{
  if(user && user._id){
    sendMessage("join", {
      userType: "user", 
      userId: user._id
    })
  }
}, [user, sendMessage])
```

### Expected Flow
1. User logs in → User context populates
2. Home component mounts → useEffect triggers
3. `sendMessage("join", ...)` emits to backend
4. Backend registers user in `userSocketMap[userId]`
5. Backend stores `socketId` in user document

---

## Frontend Captain Connection (`/Frontend/src/pages/CaptainHome.jsx`)

### Socket Join Event
```javascript
useEffect(() => {
  if(captain && captain._id){
    sendMessage('join', {
      userId: captain._id,
      userType: 'captain'
    })
  }
}, [captain, sendMessage])
```

### Location Tracking
```javascript
useEffect(() => {
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        sendMessage('update-location-captain', {
          userId: captain._id,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      })
    }
  }
  
  const locationInterval = setInterval(updateLocation, 10000)
  updateLocation()
  
  return () => clearInterval(locationInterval)
}, [captain, sendMessage])
```

### Listen for New Rides
```javascript
useEffect(() => {
  const unsubscribe = receiveMessage('new-ride', (data) => {
    console.log('New ride received:', data)
    setRide(data.ride || data)
    setRidePopUp(true)
  })
  
  return () => unsubscribe()
}, [receiveMessage])
```

---

## Frontend Socket Context (`/Frontend/src/context/SocketContext.jsx`)

### Exported Functions

#### `sendMessage(eventName, data)`
- Emits socket event to backend
- Returns boolean success status
- Used by components to send data

#### `receiveMessage(eventName, callback)`
- Registers listener for specific event
- Returns unsubscribe function
- Used in useEffect cleanup

#### Properties
- `socket`: Raw Socket.IO instance
- `isConnected`: Connection status
- `socketId`: Socket's unique ID
- `joinRoom(roomId)`: Join a room
- `leaveRoom(roomId)`: Leave a room

---

## Data Flow Diagram

```
USER CREATES RIDE
    ↓
Home.jsx → POST /rides/create
    ↓
rideController.createRide()
    ↓
[Get coordinates, Find captains, Save ride]
    ↓
sendMessageToCaptain(captainId, 'new-ride', rideData)
    ↓
socket.js: Looks up captainId in captainSocketMap
    ↓
Sends to socket ID via io.to(socketId).emit()
    ↓
CaptainHome.jsx receives 'new-ride' event
    ↓
receiveMessage listener catches event
    ↓
setRide(data) → Shows RidePopUp
```

---

## Key Fixes Applied

### 1. Socket.js Enhancements
- ✅ Added `userSocketMap` and `captainSocketMap` for ID-based lookups
- ✅ Added `sendMessageToUser()` and `sendMessageToCaptain()` helpers  
- ✅ Proper disconnection cleanup for both maps
- ✅ Error handling in join event

### 2. Ride Controller Fixes
- ✅ Removed early return that prevented sending to captains
- ✅ Fixed coordinate property names (`lat` instead of `ltd`)
- ✅ Fixed socket message parameters (eventName, data)
- ✅ Proper error handling

### 3. Maps Service Fixes
- ✅ Fixed `getCaptainsInTheRadius` parameter names (lat, lng)
- ✅ Corrected coordinate order in geoWithin query

### 4. Frontend Fixes
- **Home.jsx**:
  - ✅ Added null check for user before sending join event
  - ✅ Added proper dependency array

- **CaptainHome.jsx**:
  - ✅ Switched from `socket.emit` to `sendMessage`
  - ✅ Switched from `socket.on` to `receiveMessage`
  - ✅ Added `ride` state management
  - ✅ Fixed location property names (lat, lng)
  - ✅ Added cleanup for intervals and event listeners
  - ✅ Pass ride data to components

---

## Testing Checklist

### Backend (Terminal)
```bash
cd Backend
npm start

Expected logs:
✅ Server running on port 4000
✅ Socket.IO initialized
✅ MongoDB connected
```

### Frontend (Terminal)
```bash
cd Frontend
npm run dev

Expected output:
✅ Vite dev server running
✅ App loads without errors
```

### End-to-End Test
1. **User Login** → Home page loads
2. **User joins socket** → Backend logs: "User [id] connected with socket [socketId]"
3. **Captain Login** → CaptainHome page loads
4. **Captain joins socket** → Backend logs: "Captain [id] connected with socket [socketId]"
5. **User creates ride** → Backend logs ride creation and captain search
6. **Captains receive notification** → CaptainHome shows "new-ride" event
7. **Location updates** → Captain sends location every 10 seconds

---

## Architecture Summary

```
📱 FRONTEND
├── Home.jsx (User)
├── CaptainHome.jsx (Captain)
└── SocketContext.jsx (Shared)

🔌 SOCKET.IO
├── Join events (register users/captains)
├── Ride events (new-ride, ride-accepted)
└── Location events (update-location-captain)

⚙️ BACKEND
├── socket.js (Connection management)
├── ride.controller.js (Ride creation → Captain notification)
├── maps.service.js (Geolocation, radius search)
└── user/captain models (Database)
```

---

## Next Steps (Optional Enhancements)

1. **Ride Acceptance**: Captain accepts ride → emit event back to user
2. **Real-time Location**: Both parties track live location during ride
3. **Ride Status Updates**: Arrive, Start, Complete events
4. **Rating System**: Add rating after ride completion
5. **Payment Integration**: Process payments via Socket

---

Generated: April 27, 2026
