import { useContext, useEffect } from "react"
import { createContext, useState } from "react"

// by making the CONTEXT we are storing the user Login information ONCE and let every componet use it as a authentication
// otherwise we need to use localStorage.getItem() in every component

export const AuthContext = createContext()


// creating the AuthProvider in which we will store all the information
export const AuthProvider = ({ children }) => {

    const  [isAuthenticated, setisAuthenticated] = useState(false)
    // const [accessToken, setAccessToken] = useState(localStorage.getItem("token"))

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")

        if (accessToken) {
            setisAuthenticated(true)
        }
    }, [])

    const login = () => {
        setisAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setisAuthenticated(false)
    }

    return (

        // here value="" <- is the data that we wanted to share with every component
        <AuthContext.Provider value={{ isAuthenticated , login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}