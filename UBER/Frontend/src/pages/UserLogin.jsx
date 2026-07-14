import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('') // Added back for UI feedback
  const [ loading, setLoading ] = useState(false) // Added for better UX

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs on frontend
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const loginData = { // Renamed to avoid shadowing state
      email: email.trim().toLowerCase(),
      password: password
    }
    console.log('User login attempt:', { email: loginData.email, passwordLength: loginData.password.length });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`, 
        loginData,
        { withCredentials: true } // CRITICAL: Required for cookies to work
      )

      if (response.status === 200) {
        const data = response.data
        console.log('User login successful');
        setUser(data.user)
        localStorage.setItem('token', data.token) // Storing JWT in localStorage
        setEmail('')
        setPassword('')
        navigate('/home')
      }
    } catch (err) {
      console.error('User login error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Uber Logo" />

        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            required
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='password'
          />

          {/* Show error message to user */}
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <button
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base disabled:bg-gray-400'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>
        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </div>
      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin









// // import React, { useContext, useState } from 'react'
// // import { Link } from 'react-router-dom'
// // import { UserDataContext } from '../context/UserContext'
// // import { useNavigate } from 'react-router-dom'
// // import axios from 'axios'



// // const UserLogin = () => {
// //    const [email, setEmail] = useState('')
// //    const [password, setPassword] = useState('');
// //   //  const [error, setError] = useState('')
// //   //  const [loading, setLoading] = useState(false)

// //    const { user, setUser } = useContext(UserDataContext)

// //    const navigate = useNavigate()


// //    const submitHandler = async (e) => {
// //         e.preventDefault();
// //         setError('')
// //         setLoading(true)

// //       const userData = {
// //           email: email,
// //           password: password
// //         }
      
// //         try {
// //           const response = await axios.post(
// //             `${import.meta.env.VITE_BASE_URL}/users/login`,
// //             userData,
// //             { withCredentials: true }
// //           )

// //           if (response.status === 200) {
// //             const data = response.data
// //             setUser(data.user)
// //             localStorage.setItem('token', data.token)
// //             navigate('/home')
// //           }
// //         } catch (error) {
// //           console.log('Server Error Response:', error.response?.data)
// //           setError(error.response?.data?.message || 'Login failed. Please try again.')
// //         } finally {
// //           setLoading(false)
// //         }

// //        setEmail('')
// //        setPassword('')
// //    }

// //   return (
// //     <div className='p-7 h-screen flex flex-col justify-between' >
// //       <div>
// //         <img className='w-16 mb-10' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png"></img>
// //       <form  onSubmit={ (e)=>{
       
// //         submitHandler(e)

// //       } }>
// //         <h3 className='text-lg font-medium mb-2'>what's your email</h3>
// //         <input required value={email} 
// //         onChange={(e)=>{setEmail(e.target.value)}  }
// //         className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
// //          type="email" placeholder='example@gmail.com'
// //           ></input>
// //         <h3 className='text-lg font-medium mb-2'>Enter your Password</h3>
// //         <input required  className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
// //          value={password}
// //          onChange={(e)=>{setPassword(e.target.value)}}
// //          type='password' placeholder='password'
// //          disabled={loading}
// //         ></input>

// //         {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

// //         <button
// //           disabled={loading}
// //           className='bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base disabled:opacity-50 disabled:cursor-not-allowed'
// //         >
// //           {loading ? 'Logging in...' : 'Login'}
// //         </button>
// //       </form>

// //               <p className='text-center'> New here?  <Link to='/signup' className='text-blue-500'>Create new Account</Link></p>
      
// //       </div>
// //       <div>
// //         <Link  to='/captain-login'
       
// //         className='bg-[#3aa769] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base ' >
// //           Sign in as Captain</Link>
// //       </div>

// //     </div>
// //   )
// // }

// // export default UserLogin


// import React, { useState, useContext } from 'react'
// import { Link } from 'react-router-dom'
// import { UserDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const UserLogin = () => {
//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ userData, setUserData ] = useState({})

//   const { user, setUser } = useContext(UserDataContext)
//   const navigate = useNavigate()



//   const submitHandler = async (e) => {
//     e.preventDefault();

//     const userData = {
//       email: email,
//       password: password
//     }
//  try {
//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

//     if (response.status === 200) {
//       const data = response.data
//       setUser(data.user)
//       localStorage.setItem('token', data.token)
//       navigate('/home')
//     }
//   } catch (err) {
//     console.error('Login error response:', err.response?.data)
//     // setError(err.response?.data?.message || 'Login failed. Please try again.')
//   }


//     setEmail('')
//     setPassword('')
//   }

//   return (
//     <div className='p-7 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

//         <form onSubmit={(e) => {
//           submitHandler(e)
//         }}>
//           <h3 className='text-lg font-medium mb-2'>What's your email</h3>
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

//           <button
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//           >Login</button>

//         </form>
//         <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
//       </div>
//       <div>
//         <Link
//           to='/captain-login'
//           className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//         >Sign in as Captain</Link>
//       </div>
//     </div>
//   )
// }

// export default UserLogin