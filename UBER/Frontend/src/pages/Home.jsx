


import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';


const Home = () => {
  const [pickup, setPickup] = React.useState('')
  const [destination, setDestination] = React.useState('')
  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [vehicleType, setVehicleType] = useState(null)
  const [panelOpen, setPanelOpen] = React.useState(false)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const panelRef = React.useRef(null)
  const panelCloseRef = useRef(null)
  const [vehiclePanelOpen, setVehiclePanelOpen] = React.useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = React.useState(false)
  const [vehicleFound, setVehicleFound] = React.useState(false)
  const [waitingForDriver, setWaitingForDriver] = React.useState(false)
  const [fare, setFare] = useState({})
  const [ride,setRide] = useState(null)
  const navigate = useNavigate()

 const { socket } = useContext(SocketContext)
 const {user}= useContext(UserDataContext)

 useEffect(() => {
    if (user && user._id) {
      socket.emit("join", { userType: "user", userId: user._id })
    }
  }, [ user, socket ])

  useEffect(() => {
    socket.on('ride-confirmed', (ride) => {
      setVehicleFound(false)
      setWaitingForDriver(true)
      setRide(ride)
    })

    socket.on('ride-started', (ride) => {
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } })
    })

    return () => {
      socket.off('ride-confirmed')
      socket.off('ride-started')
    }
  }, [ socket, navigate ])

  // Fetch suggestions from backend
  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${encodeURIComponent(input)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle pickup input change
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    setActiveField('pickup');
    fetchSuggestions(value);
  };

  // Handle destination input change
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setActiveField('destination');
    fetchSuggestions(value);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (activeField === 'pickup') {
      setPickup(location);
    } else if (activeField === 'destination') {
      setDestination(location);
    }
    setSuggestions([]);
    setPanelOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault()
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24
        // opacity:1
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
        // opacity:0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if (vehiclePanelOpen) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })

    }
  }, [vehiclePanelOpen])


  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })

    }
  }, [confirmRidePanel])


  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })

    }
  }, [vehicleFound])

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })

    }
  }, [waitingForDriver])


  async function findTrip() {
    setVehiclePanelOpen(true)
    setPanelOpen(false)

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    setFare(response.data)

  }


  async function createRide(type) {
    setVehicleType(type)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType: type
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      console.log('Ride created:', response.data)
      setVehicleFound(true)
    } catch (error) {
      console.error('Error creating ride:', error.response?.data || error.message)
    }
  }

  return (
    <div className='h-screen relative overflow-hidden'>

      <img className='w-16 absolute left-5 top-5 ' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />

      <div className='h-screen w-screen'>
                 <LiveTracking/>
        </div>


      <div className=' flex flex-col justify-end h-screen top-0 absolute  w-full  '>
        <div className='h-[40%] p-5 bg-white' >
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false)
          }} className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i></h5>

          <h4 className='text-2xl font-semibold '>Find a trip</h4>
          <form onSubmit={() => {
            submitHandler(e)
          }} >
            {/* <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div> */}

            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5 ' type='text' placeholder='Add a pick_up location' />
            <input
              onClick={() => {
                setPanelOpen(true)
              }}
              value={destination}
              onChange={handleDestinationChange}

              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5 ' type='text' placeholder='Add a drop_off location' />
          </form>
          <button onClick={findTrip}
            className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full' >
            Find Trip
          </button>

        </div>
        <div ref={panelRef} className=' bg-white  h-0 '>
          <LocationSearchPanel
            suggestions={suggestions}
            onLocationSelect={handleLocationSelect}
            setPanelOpen={setPanelOpen} 
            setVehiclePanelOpen={setVehiclePanelOpen} 
            // suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            // setPanelOpen={setPanelOpen}
            // setVehiclePanel={setVehiclePanel}
            // setPickup={setPickup}
            // setDestination={setDestination}
            // activeField={activeField}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className=' fixed w-full  bg-white  z-10 bottom-0   translate-full  px-3 py-10 pt-12'>
        <VehiclePanel
          createRide={createRide}
          fare={fare} 
          setConfirmRidePanel={setConfirmRidePanel} 
          setVehiclePanelOpen={setVehiclePanelOpen} 
        />

      </div>


      <div ref={confirmRidePanelRef} className=' fixed w-full  bg-white  z-10 bottom-0   translate-full  px-3 py-8 pt-12'>
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
         
          setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className=' fixed w-full  bg-white  z-10 bottom-0   translate-full  px-3 py-8 pt-12'>
        <LookingForDriver
          createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
         setVehicleFound={setVehicleFound} />

      </div>

      <div ref={waitingForDriverRef} className=' fixed w-full  bg-white  z-10 bottom-0     px-3 py-8 pt-12'>
        <WaitingForDriver
        ride={ride}
        setVehicleFound={setVehicleFound}
        setWaitingForDriver={setWaitingForDriver}
         waitingForDriver={waitingForDriver} />

      </div>





    </div>



  )
}

export default Home
