import React from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import ConfirmRidePopUp from '../components/ConfirmRidePopup'
import RidePopUp from '../components/RidePopUp' 
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { useEffect, useContext, useState } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'


const CaptainHome = () => {
  const  ridePopupPanelRef = React.useRef(null)
  const confirmRidePopUpRef = React.useRef(null)
  
 const [ridePopUp, setRidePopUp] = React.useState(false)
 const [confirmRidePopUp, setConfirmRidePopUp] = React.useState(false)
 const [ride, setRide] = useState(null)

const { sendMessage, receiveMessage } = useContext(SocketContext)
const {captain} = useContext(CaptainDataContext)

 useEffect(() => {
    if(captain?._id){ // Use optional chaining for safer access
      sendMessage('join', {
          userId: captain._id,
          userType: 'captain'
      })
      console.log('Captain joined socket:', captain._id);
    }
 }, [captain, sendMessage]);

 // Setup location tracking
 useEffect(() => {
    // const updateLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(position => {
    //             if (captain?._id) { // Add check for captain._id before sending location
    //                 sendMessage('update-location-captain', {
    //                     userId: captain._id,
    //                     location: {
    //                         lat: position.coords.latitude,
    //                         lng: position.coords.longitude
    //                     }
    //                 })
    //             }
    //         }, error => {
    //             console.error('Error getting location:', error);
    //         })
    //     }
    // }
    const updateLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            if (captain?._id) {
                sendMessage('update-location-captain', {
                    userId: captain._id,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                })
            }
        }, error => {
            console.error('Error getting location:', error.message);
        }, {
            enableHighAccuracy: false, // Change to false if it keeps failing on Mac
            timeout: 5000,
            maximumAge: 0
        })
    }
}


    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()

    return () => clearInterval(locationInterval)
 }, [captain, sendMessage]);

 // Listen for new ride events
 useEffect(() => {
    const unsubscribe = receiveMessage('new-ride', (data) => {
        console.log('New ride received:', data);
        setRide(data.ride || data);
        setRidePopUp(true)
    })

    return () => unsubscribe();
 }, [receiveMessage]);

//  Socket.on('name-ride', (data)=>{
//   console.log(data);
  
//   setRide(data)
//   setRidePopUp(true)
//  })

    //  async function confirmRide() {

    //     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`, {

    //         rideId: ride._id,
    //         captainId: captain._id,


    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         }
    //     })

    //     setRidePopUp(false)
    //     setConfirmRidePopUp(true)
    // }

    
async function confirmRide() {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/confirm`, // Kept as /confirm based on your routes
            {
                rideId: ride._id // Only send rideId. Express-validator will reject extra fields or captainId [1]
            }, 
            {
                headers: {
                    // REQUIRED: This allows authMiddleware.authCaptain to verify the captain [1]
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );

        console.log('Ride confirmed successfully:', response.data);

        // State changes only run once the server confirms success
        setRidePopUp(false);
        setConfirmRidePopUp(true);

    } catch (error) {
        console.error('Error confirming ride:', error.response?.data || error.message);
        // Optional: Alert the user if the ride has already been accepted by someone else
    }
}



     useGSAP(function(){
         if(ridePopUp){
           gsap.to(ridePopupPanelRef.current,{
            transform: 'translateY(0)'
         })
         }else{
          gsap.to(ridePopupPanelRef.current,{
            transform: 'translateY(100%)'
         })

        }
    },[ridePopUp])

        useGSAP(function(){
         if(confirmRidePopUp){
           gsap.to(confirmRidePopUpRef.current,{
            transform: 'translateY(0)'
         })
         }else{
          gsap.to(confirmRidePopUpRef.current,{
            transform: 'translateY(100%)'
         })

        }
    },[confirmRidePopUp])

  return (
      <div className='h-screen'>
       <div className='fixed p-6 top-0 flex items-center justify-between w-screen' >

          <img className='w-16' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt=''></img>
         <Link to='/home' className=' right-2 top-2 h-10 fixed w-10 bg-white flex items-center justify-center rounded-full '>
            <i className="ri-logout-box-r-line"></i></Link>
       </div>

      <div className='  h-1/2'>
        <img  className='w-full h-full object-cover' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' alt=''/>

      </div>
       <div className='h-1/2 h-full  ' > 
           <CaptainDetails/>

            <div  ref={ridePopupPanelRef}  className=' fixed w-full  bg-white  z-10 bottom-0  translate-y-full    px-3 py-8 pt-12'>
                   <RidePopUp ride={ride} setRidePopUp={setRidePopUp} setConfirmRidePopUp={setConfirmRidePopUp}
                   confirmRide={confirmRide} />
         </div>
            
             <div  ref={confirmRidePopUpRef}  className=' fixed w-full  h-screen bg-white  z-10 bottom-0  translate-y-full    px-3 py-8 pt-12'>
                   <ConfirmRidePopUp ride={ride} setConfirmRidePopUp={setConfirmRidePopUp} setRidePopUp={setRidePopUp} />
         </div>
             
       </div>

    </div>
  )
}

export default CaptainHome
