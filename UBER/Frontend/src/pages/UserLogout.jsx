import React, { useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const UserLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } catch (err) {
                // console.error('Logout error:', err)
            } finally {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }
        
        logout()
    }, [token, navigate])

  return (
    <div className='flex items-center justify-center h-screen'>
        <div>Logging out...</div>
    </div>
  )
}

export default UserLogout
