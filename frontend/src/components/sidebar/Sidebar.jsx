import { Button } from '@base-ui/react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const Sidebar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const {logout} = useAuth()

    // creating object menu for the sidebar
    const menus = [

        {
            title: "Dashboard",
            src: "/dashboard",
        },

        {
            title: "Total Clients",
            src: "/clients",
        },

        {
            title: "Total Policies",
            src: "/clients/policies?search=total-policies",
        },

        // {
        //     title: "Logout",
        //     onclick: logout,
        //     src: "/login",
        //     gap: true
        // }   
    ]

    return (
        <div className={`${open ? "w-45" : "w-20"} bg-slate-100 max-h-[105%] fixed  top-0 p-5 pt-4 z-50 duration-300 border border-blue-100`}>
            <ul className="pt-6">
                <h2 className=''>
                    <div className='text-black font-bold'>
                        Menu
                    </div>
                    <div className="mt-8 h-px w-full bg-gray-400"></div>
                </h2>

                <div className='flex flex-col justify-center items-center mt-10'>
                    {menus.map((Menu, index) => {
                        const isActive = (location.pathname + location.search) === Menu.src;
                        // console.log("location path is: ", location.pathname)
                        // console.log("Menu path is: ", Menu.src)

                        return (
                            <li
                                key={index}
                                className={`flex rounded-md p-2 cursor-pointer text-sm items-center font-bold gap-x-4 
                                ${Menu.gap ? "mt-65 text-red-400 font-semibold hover:bg-red-200 hover:text-red-700" : "mt-2"} 
                                ${index === 0 ? "bg-light-white" : ""}
                                ${isActive ? "bg-blue-400 text-white" : "text-black hover:bg-blue-100 hover:text-black"}`}
                                onClick={() => navigate(Menu.src)}
                            >
                                <span className={`${!open ? "hidden" : ""} origin-left duration-200`}>
                                    {Menu.title}
                                </span>
                            </li>
                        )
                    })}

                    <button onClick={() => {
                        const logoutFunc = logout()
                        const route = navigate("/login")
                        return logoutFunc && route 
                        } } className='mt-70  text-red-400 font-semibold hover:bg-red-200 hover:text-red-700 p-2 rounded-md cursor-pointer '>
                        Logout 
                    </button> 
                </div>
            </ul>
        </div >
    )
}

export default Sidebar
