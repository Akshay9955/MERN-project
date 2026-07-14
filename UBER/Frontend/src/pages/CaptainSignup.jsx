import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate()
  const { setCaptain } = useContext(CaptainDataContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehicleType, setVehicleType] = useState('car')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        vehicleType: vehicleType,
        plate: vehiclePlate,
        capacity: parseInt(vehicleCapacity)
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setVehicleCapacity('')
        setVehicleColor('')
        setVehiclePlate('')
        setVehicleType('car')
        alert('Captain registered successfully!')
        navigate('/captain-home')
      }
    } catch (error) {
      // console.log("Server Error Response:", error.response?.data)
      setError(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Uber Logo" />

          <form onSubmit={submitHandler}>
            <h3 className='text-lg w-full font-medium mb-2'>Register as Captain</h3>
            
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base disabled:opacity-50'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base disabled:opacity-50'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>Email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
              type="email"
              placeholder='email@example.com'
              disabled={loading}
            />

            <h3 className='text-lg font-medium mb-2'>Password</h3>
            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='password'
              disabled={loading}
            />

            <h3 className='text-lg font-medium mb-2'>Vehicle Color</h3>
            <input
              required
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
              type="text"
              placeholder='e.g., Red'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              disabled={loading}
            />

            <h3 className='text-lg font-medium mb-2'>Vehicle Type</h3>
            <select
              required
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              disabled={loading}
            >
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Motorcycle</option>
            </select>

            <h3 className='text-lg font-medium mb-2'>License Plate</h3>
            <input
              required
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
              type="text"
              placeholder='e.g., ABC1234'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              disabled={loading}
            />

            <h3 className='text-lg font-medium mb-2'>Vehicle Capacity</h3>
            <input
              required
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
              type="number"
              placeholder='e.g., 4'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              disabled={loading}
            />

            {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Creating account...' : 'Register as Captain'}
            </button>
          </form>
          <p className='text-center'>Already have an account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] mt-10 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup

//             <h3 className='text-lg font-medium mb-2'> Captain email</h3>
//             <input
//               required
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value)
//               }}
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//               type="email"
//               placeholder='email@example.com'
//             />

//             <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//             <input
//               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value)
//               }}
//               required type="password"
//               placeholder='password'
//             />


    
//              <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Color'
//               value={vehicleColor}
//               onChange={(e) => {
//                 setVehicleColor(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Plate'
//               value={vehiclePlate}
//               onChange={(e) => {
//                 setVehiclePlate(e.target.value)
//               }}
//             />
//           </div>


//             <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="number"
//               placeholder='Vehicle Capacity'
//               value={vehicleCapacity}
//               onChange={(e) => {
//                 setVehicleCapacity(e.target.value)
//               }}
//             />
//             <select
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               value={vehicleType}
//               onChange={(e) => {
//                 setVehicleType(e.target.value)
//               }}
//             >
//               <option value="" disabled>Select Vehicle Type</option>
//               <option value="car">Car</option>
//               <option value="auto">Auto</option>
//               <option value="moto">Moto</option>
//             </select>
//           </div>







//             <button
//               className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//             >Create Captain account</button>

//           </form>
//           <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
//         </div>
//         <div>
//           <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//             Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//         </div>
//       </div>
//     </div >
//   )
// }

// export default CaptainSignup


// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { CaptainDataContext } from '../context/CaptainContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const CaptainSignup = () => {

//   const navigate = useNavigate()

//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ firstName, setFirstName ] = useState('')
//   const [ lastName, setLastName ] = useState('')

//   const [ vehicleColor, setVehicleColor ] = useState('')
//   const [ vehiclePlate, setVehiclePlate ] = useState('')
//   const [ vehicleCapacity, setVehicleCapacity ] = useState('')
//   const [ vehicleType, setVehicleType ] = useState('')


//   const { captain, setCaptain } = React.useContext(CaptainDataContext)


//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const captainData = {
//       fullname: {
//         firstname: firstName,
//         lastname: lastName
//       },
//       email: email,
//       password: password,
//       vehicle: {
//         color: vehicleColor,
//         plate: vehiclePlate,
//         capacity: vehicleCapacity,
//         vehicleType: vehicleType
//       }
//     }

//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

//     if (response.status === 201) {
//       const data = response.data
//       setCaptain(data.captain)
//       localStorage.setItem('token', data.token)
//       navigate('/captain-home')
//     }

//     setEmail('')
//     setFirstName('')
//     setLastName('')
//     setPassword('')
//     setVehicleColor('')
//     setVehiclePlate('')
//     setVehicleCapacity('')
//     setVehicleType('')

//   }
//   return (
//     <div className='py-5 px-5 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

//         <form onSubmit={(e) => {
//           submitHandler(e)
//         }}>

//           <h3 className='text-lg w-full  font-medium mb-2'>What's our Captain's name</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//               type="text"
//               placeholder='First name'
//               value={firstName}
//               onChange={(e) => {
//                 setFirstName(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//               type="text"
//               placeholder='Last name'
//               value={lastName}
//               onChange={(e) => {
//                 setLastName(e.target.value)
//               }}
//             />
//           </div>

//           <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
//           <input
//             required
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value)
//             }}
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             type="email"
//             placeholder='email@example.com'
//           />

//           <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//           <input
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value)
//             }}
//             required type="password"
//             placeholder='password'
//           />

//           <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Color'
//               value={vehicleColor}
//               onChange={(e) => {
//                 setVehicleColor(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Plate'
//               value={vehiclePlate}
//               onChange={(e) => {
//                 setVehiclePlate(e.target.value)
//               }}
//             />
//           </div>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="number"
//               placeholder='Vehicle Capacity'
//               value={vehicleCapacity}
//               onChange={(e) => {
//                 setVehicleCapacity(e.target.value)
//               }}
//             />
//             <select
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               value={vehicleType}
//               onChange={(e) => {
//                 setVehicleType(e.target.value)
//               }}
//             >
//               <option value="" disabled>Select Vehicle Type</option>
//               <option value="car">Car</option>
//               <option value="auto">Auto</option>
//               <option value="moto">Moto</option>
//             </select>
//           </div>

//           <button
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//           >Create Captain Account</button>

//         </form>
//         <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
//       </div>
//       <div>
//         <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//           Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//       </div>
//     </div>
//   )
// }

// export default CaptainSignup