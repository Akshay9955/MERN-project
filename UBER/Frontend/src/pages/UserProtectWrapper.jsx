import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                // console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
            })
    }, [ token, navigate, setUser ])

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-center'>
                    <div className='mb-4'>Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper