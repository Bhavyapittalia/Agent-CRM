import { useEffect } from "react"
import { createContext, useState } from "react"

// by making the CONTEXT we are storing the user Login information ONCE and let every componet use it as a authentication
// otherwise we need to use localStorage.getItem() in every component

export const AuthContext = createContext()


// creating the AuthProvider in which we will store all the information
export const AuthProvider = ({ children }) => {

    const  [isAuthenticated, setisAuthenticated] = useState(false)
    const [token, setToken] = useState(localStorage.getItem("token"))

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setisAuthenticated(true)
        }
    }, [])

    const login = (token) => {
        localStorage.setItem("token", token)
        setisAuthenticated(true)
        setToken(token)    
    }

    const logout = () => {
        localStorage.removeItem("token")
        setisAuthenticated(false)
    }

    return (

        // here value="" <- is the data that we wanted to share with every component
        <AuthContext.Provider value={{ isAuthenticated , login, logout, token}}>
            {children}
        </AuthContext.Provider>
    )

}