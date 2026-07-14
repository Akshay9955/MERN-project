import React from 'react'

const LookingForDriver =(props) => {
  return (
       <div>
            <h5 className='p-2 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-500 ri-arrow-down-s-line"></i></h5>
            <div className=' text-2xl font-semibold mb-5'>Looking for a Driver</div>

            <div  className='flex gap-4 justify-between flex-col items-center'>
                <img className=' ' src='https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82NDkzYzI1NS04N2M4LTRlMmUtOTQyOS1jZjcwOWJmMWI4MzgucG5n' alt='' ></img>
             <div className='w-full  gap-3 flex flex-col'>
                <div className='flex items-center gap-5  border-gray-200 border-b-2' >
                      <i className="ri-map-pin-user-line"></i>
                <div>
                    <h3 className='text-lg font-medium'>Pickup</h3>
                    <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                </div>
                </div>

                <div>
                   <div className='flex items-center gap-5  border-gray-200 border-b-2' >
                    <i className="ri-map-pin-line"></i>
                <div>
                    <h3 className='text-lg font-medium'>Destination</h3>
                    <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                </div>
                </div>
                    
                </div>
                <div>
                  <div className='flex items-center gap-5  ' >
                    <i className="ri-money-rupee-circle-line"></i>
                <div>
                    <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                    <p className='text-sm -mt-1 text-gray-600'>Payment</p>
                </div>
                </div>
                </div>

            
             </div >
             
            </div>

        </div>
  )
}

export default LookingForDriver
