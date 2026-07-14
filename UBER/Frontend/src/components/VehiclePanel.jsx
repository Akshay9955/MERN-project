import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
       <h5 className='p-2 text-center w-[93%] absolute top-0' onClick={()=>{
        props.setVehiclePanelOpen(false)
      }}   ><i className="text-3xl text-gray-500 ri-arrow-down-s-line"></i></h5>
      <div className=' text-2xl font-semibold mb-5'>Choose a ride</div>
          <div onClick={()=>{
            props.setConfirmRidePanel(true)
             props.createRide('car')
          }}  className='flex border-2  active:border-black  mb-2 rounded-xl  w-full p-3  items-center justify-between '>
              <img className='w-20 h-20  object-cover rounded-{200}' src='https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82NDkzYzI1NS04N2M4LTRlMmUtOTQyOS1jZjcwOWJmMWI4MzgucG5n 'alt=''></img>

              <div className='ml-2 w-1/2'> 
                <h4 className='font-medium text-base'>
                  UberGo <span><i className='ri-user-3-fill'> 4</i></span>
                  </h4>
                  <h5 className='font-medium text-sm' >2 mins away</h5>
                  <p className='font-normal text-xs text-gray-600'>Affordable,compact rides</p>
              </div>
              <h2 className='text-lg font-semibold'>₹{props.fare.car}</h2>
          </div>
        
         <div onClick={()=>{
            props.setConfirmRidePanel(true)
            props.createRide('bike')
         }} className='flex border-2 active:border-black  mb-2  rounded-xl  w-full p-3  items-center justify-between '>
              <img className='w-17 h-20  object-cover rounded-{200}' src='https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n'alt=''></img>

              <div className='ml-2 w-1/2'> 
                <h4 className='font-medium text-base'>
                  Moto <span><i className='ri-user-3-fill'> 1</i></span>
                  </h4>
                  <h5 className='font-medium text-sm' >5 mins away</h5>
                  <p className='font-normal text-xs text-gray-600'>Affordable,bike rides</p>
              </div>
              <h2 className='text-lg  font-semibold'>₹{props.fare.bike}</h2>
          </div>

       <div onClick={()=>{
        props.setConfirmRidePanel(true)
         props.createRide('auto')
       }} className='flex border-2 mb-2 active:border-black  w-full p-3  items-center justify-between '>
              <img className='w-17 h-20  object-cover rounded-{200}' src='https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png'alt=''></img>

              <div className='ml-2 w-1/2'> 
                <h4 className='font-medium text-base'>
                  UborAuto <span><i className='ri-user-3-fill'> 1</i></span>
                  </h4>
                  <h5 className='font-medium text-sm' >2 mins away</h5>
                  <p className='font-normal text-xs text-gray-600'>Affordable Auto rides</p>
              </div>
              <h2 className='text-lg  font-semibold'>₹{props.fare.auto}</h2>
          </div>


    </div>
  )
}

export default VehiclePanel
