import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()


  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')

    // Validate inputs on frontend
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!password) {
      setError('Please enter your password')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const captainData = {
      email: email.trim().toLowerCase(),
      password: password
    }

    console.log('Captain login attempt:', { email: captainData.email, passwordLength: captainData.password.length })

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainData,
        { withCredentials: true }
      )

      if (response.status === 200) {
        const data = response.data
        console.log("Full Captain Data:", data.captain);
        console.log('Captain login successful')
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        setEmail('')
        setPassword('')
        navigate('/captain-home')
      }
    } catch (err) {
      console.error('Captain login error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      })
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }

  }
 

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://freelogopng.com/images/all_img/1659761100uber-logo-png.png" alt="Uber Logo"></img>
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>Captain email</h3>
          <input
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            disabled={loading}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
            type="email"
            placeholder='example@gmail.com'
          ></input>
          <h3 className='text-lg font-medium mb-2'>Enter your Password</h3>
          <input
            required
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base disabled:opacity-50'
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            disabled={loading}
            type='password'
            placeholder='password'
          ></input>

          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <button
            disabled={loading}
            className='bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-500'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link
          to='/login'
          className='bg-[#3aa769] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base'
        >
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainLogin
