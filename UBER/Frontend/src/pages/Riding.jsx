import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {

    const location = useLocation()
    const { ride } = location.state || {}
    const { Socket } = useContext(SocketContext)
    const navigate = useNavigate()

     Socket.on('ride-ended',()=>{
      navigate('/home')
    
     })
    

  return (
    <div className='h-screen'>
        <Link to='/home' className=' right-2 top-2 h-10 fixed w-10 bg-white flex items-center justify-center rounded-full '>
            <i className=" text-lg font-medium ri-home-5-line"></i></Link>

      <div className='  h-1/2'>
        <LiveTracking/>

      </div>
       <div className='h-1/2 p-4'> 
       <div className=' flex item-center justify-between'>
            <img className='h-30 ' src='https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82NDkzYzI1NS04N2M4LTRlMmUtOTQyOS1jZjcwOWJmMWI4MzgucG5n' alt='' ></img>

            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
              <h4 className='text-lg font-semibold -mt-1 -mb -1'>{ride?.captain.vehicle.plate}</h4>
              <p className='text-sm text-gray-600'>{ride?.captain.vehicle.vehicleType}</p>
            </div>

          </div>

            <div  className='flex gap-4 justify-between flex-col items-center'>
             <div className='w-full  gap-3 flex flex-col'>
              

                <div>
                   <div className='flex items-center gap-5  border-gray-200 border-b-2' >
                    <i className="ri-map-pin-line"></i>
                <div>
                    <h3>Destination</h3>
                    <p className=' tesxt-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                </div>
                </div>
                    
                </div>
                <div>
                  <div className='flex items-center gap-5  ' >
                    <i className="ri-money-rupee-circle-line"></i>
                <div>
                    <h3>₹{ride?.fare}</h3>
                    <p className=' tesxt-sm -mt-1 text-gray-600'>payment</p>
                </div>
                </div>
                </div>

            
             </div >
             
            </div>
          <button  className='w-full  mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg '>Make a Payment</button>
       </div>

    </div>
  )
}

export default Riding
