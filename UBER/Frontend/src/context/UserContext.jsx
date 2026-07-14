// import React, { createContext, useState } from 'react'

// export const UserDataContext = createContext()

// const UserContext = ({ children }) => {
//      const [user, setUser] = useState({
//         email: '',
//         fullName: {
//             firstName: '',
//             lastName: ''
//         }
//      })
//      const [isLoading, setIsLoading] = useState(false)
//      const [error, setError] = useState(null)

//      const updateUser = (userData) => {
//         setUser(userData)
//      }

//   return (
//     <UserDataContext.Provider value={{ user, setUser, isLoading, setIsLoading, error, setError, updateUser }}>
//         {children}
//     </UserDataContext.Provider>
//   )
// }

// export default UserContext



import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()


const UserContext = ({ children }) => {

    const [ user, setUser ] = useState({
        email: '',
        fullName: {
            firstName: '',
            lastName: ''
        }
    })

    return (
        <div>
            <UserDataContext.Provider value={{ user, setUser }}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext