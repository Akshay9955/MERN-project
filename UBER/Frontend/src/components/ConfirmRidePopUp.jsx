import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
     const [otp,setOtp] = React.useState('')
     const navigate = useNavigate()
     
    const SubmitHandler = async(e) =>{
        e.preventDefault()
         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopUp(false)
            props.setRidePopUp(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }
    }
  return (
   <div   >
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setConfirmRidePopUp(false)
            }}><i className="text-3xl text-gray-500 ri-arrow-down-s-line"></i></h5>
            <div className=' text-2xl font-semibold mb-5'>Confirm this ride to start</div>

               <div className='flex item-center justify-between   mt-4 '>
                 <div className='flex items-center gap-3  '>
                    <img className='h-15 w-15 rounded-full m-1 object-cover' src='https://plus.unsplash.com/premium_photo-1670650045209-54756fb80f7f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt=''></img>
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                     
                </div>
                <h5 className='text-lg font-semibold   '>2.2 km</h5>
               
               </div>

            <div  className='flex gap-4 justify-between flex-col items-center'>
             <div className='w-full  gap-3 flex flex-col'>
                <div className='flex items-center gap-5  border-gray-200 border-b-2' >
                      <i className="ri-map-pin-user-line"></i>
                <div>
                    <h3>5654/67-A</h3>
                    <p className=' tesxt-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                </div>
                </div>

                <div>
                   <div className='flex items-center gap-5  border-gray-200 border-b-2' >
                    <i className="ri-map-pin-line"></i>
                <div>
                    <h3>5654/67-A</h3>
                    <p className=' tesxt-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                </div>
                </div>
                    
                </div>
                <div>
                  <div className='flex items-center gap-5  ' >
                    <i className="ri-money-rupee-circle-line"></i>
                <div>
                    <h3>₹{props.ride?.fare}</h3>
                    <p className=' tesxt-sm -mt-1 text-gray-600'>payment</p>
                </div>
                </div>
                </div>

            
             </div >
            
            <div className='mt-6  w-full'>
                <form onSubmit={SubmitHandler}>
                    <input value={otp} onChange={(e)=>setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 py-4  font-mono  text-lg rounded-lg w-full mt-3' placeholder='Enter OTP'/>
                     <button className='w-full text-lg flex justify-center  mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg '>Confirm</button>
             
             <button onClick={()=>{
             props.setConfirmRidePopUp(false)
                props.setRidePopUp(false)
             }} className='w-full  mt-1 bg-red-500 text-white text-lg font-semibold p-3 rounded-lg '>Cancel</button>
                </form>
            </div>

            </div>
             
        </div>
  )
}

export default ConfirmRidePopUp
