import React from 'react'

const RidePopUp = (props) => {
    return (
        <div   >
            <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setRidePopUp(false)
            }}><i className="text-3xl text-gray-500 ri-arrow-down-s-line"></i></h5>
            <div className=' text-2xl font-semibold mb-5'>New Ride Available!</div>

            <div className='flex item-center justify-between   mt-4 '>
                <div className='flex items-center gap-3  '>
                    <img className='h-15 w-15 rounded-full m-1 object-cover' src='https://plus.unsplash.com/premium_photo-1670650045209-54756fb80f7f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt=''></img>
                    <h2 className='text-lg font-medium'> {props.ride?.user?.fullname?.firstname && props.ride?.user?.fullname?.lastname
                        ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname}`
                        : 'Incoming Passenger'}</h2>

                </div>
                <h5 className='text-lg font-semibold   '>2.2 km</h5>

            </div>

            <div className='flex gap-4 justify-between flex-col items-center'>
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


                </div  >
                {/* <div className='flex mt-5 w-full items-center justify-between'>
                    <button onClick={() => {
                        props.setRidePopUp(false)
                        props.setConfirmRidePopUp(true)
                        props.confirmRide()

                    }} className='  bg-gray-400 text-gray-700 font-semibold p-3 px-10 rounded-lg '>Ignore</button>

                    <button onClick={() => {
                        props.setConfirmRidePopUp(true)
                    }} className='  bg-green-600 text-white font-semibold p-3 px-10 rounded-lg '>Accept</button>




                </div> */}
                <div className='flex mt-5 w-full items-center justify-between'>
                    {/* Corrected Ignore Button */}
                    <button onClick={() => {
                        props.setRidePopUp(false); // Simply hides the popup
                    }} className='bg-gray-400 text-gray-700 font-semibold p-3 px-10 rounded-lg'>
                        Ignore
                    </button>

                    {/* Corrected Accept Button */}
                    <button onClick={() => {
                        props.confirmRide(); // Calls your API handler to update state and toggle views
                    }} className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>
                        Accept
                    </button>
                </div>

            </div>

        </div>


    )
}

export default RidePopUp
