// import React, { useContext ,  useEffect, useState } from "react"
// import { CaptainDataContext } from '../context/CaptainContext'
// import { useNavigate } from "react-router-dom"






// const CaptainProtectWrapper = ({children}) => {

//  const token = localStorage.getItem('token')
//   const navigate = useNavigate()
// const {captain, setcaptain} = useContext(CaptainDataContext)
// const [isLoding, setIsloading] = useState(CaptainDataContext)


//   useEffect(()=>{
//     if(!token){
//       navigate('/captain-login')
//     }
//   },[token])

//   axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
//     header:{
//       Authorization:`Bearer ${token}`
//     }
//   }).then(response=>{
//     if(response.status===200){
//       seyCaptain(response.data.captain)
//       setIsloading(false)
//     }
//   }).catch(err =>{
//     localStorage.removeItem('token')
//     navigate('/captain-login')
//   })


// if(isLoading){
//   return(
//     <div>Loading...</div>
//   )
// }


//   return (
//     <>
//       {children}
//     </>
//   )
// }

// export default CaptainProtectWrapper


// import React, { useContext, useEffect, useState } from 'react'
// // import { CaptainDataContext } from '../context/CaptainContext'

// import { CaptainDataContext } from '../context/CaptainContext'


// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const CaptainProtectWrapper = ({
//     children
// }) => {

//     const token = localStorage.getItem('token')
//     const navigate = useNavigate()
//     const { captain, setCaptain } = useContext(CaptainDataContext)
//     const [ isLoading, setIsLoading ] = useState(true)




//     useEffect(() => {
//         if (!token) {
//             navigate('/captain-login')
//         }

//         axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }).then(response => {
//             if (response.status === 200) {
//                 setCaptain(response.data.captain)
//                 setIsLoading(false)
//             }
//         })
//             .catch(err => {

//                 localStorage.removeItem('token')
//                 navigate('/captain-login')
//             })
//     }, [ token ])

    

//     if (isLoading) {
//         return (
//             <div>Loading...</div>
//         )
//     }



//     return (
//         <>
//             {children}
//         </>
//     )
// }

// export default CaptainProtectWrapper


import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
                setIsLoading(false)
            }
        }).catch(err => {
            console.error("Auth Error:", err)
            localStorage.removeItem('token')
            navigate('/captain-login')
        })
    }, [ token, navigate, setCaptain ])

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">Loading...</div>
        )
    }

    return (
        <>{children}</>
    )
}

export default CaptainProtectWrapper
