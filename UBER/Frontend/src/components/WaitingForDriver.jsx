import React from 'react'

const WaitingForDriver = (props) => {
  return (
     <div>
            <h5 className='p-2 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
                props.WaitingForDriver(false)
            }}><i className="text-3xl text-gray-500 ri-arrow-down-s-line"></i></h5>
          
          <div className=' flex item-center justify-between'>
            <img className='h-30 ' src='https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82NDkzYzI1NS04N2M4LTRlMmUtOTQyOS1jZjcwOWJmMWI4MzgucG5n' alt='' ></img>

            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{props.ride?.captain.fullname.firstname}</h2>
              <h4 className='text-lg font-semibold -mt-1 -mb -1'>{props.ride?.captain.vehicle.plate}</h4>
              <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
              <h1 className='text-lg font-semibold'> {props.ride?.otp}</h1>
            </div>

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
             
            </div>

        </div>
  )
}

export default WaitingForDriver

