import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Login = () => {

    const navigate = useNavigate()

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setUser((prevDetails) => ({
            ...prevDetails,
            [e.target.name]: e.target.value
        }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post("/agent/login", {
                name: user.username,
                email: user.email,
                password: user.password
            })

            localStorage.setItem("accessToken", response.data.accessToken)
            localStorage.setItem("refreshToken", response.data.refreshToken)
            navigate("/dashboard")
        }
        catch (error) {
            console.log("something went wrong!: ", error.response)
            console.log(error.message)
            console.log(error.response.data)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 border-none">
            <Card className="w-full max-w-[240px] ring-0 border-t-3  border-blue-600 shadow-sm py-0 pt-0 overflow-hidden">

                <CardHeader className="pt-5  pb-2">
                    <CardTitle className="text-lg font-bold text-slate-900">
                        Agent CRM
                    </CardTitle>

                    {/* this is the breakline */}
                    <div className="mt-2 h-px w-full bg-blue-100"></div>
                    
                </CardHeader>

                <CardContent className="pb-5">
                    <form onSubmit={handleLogin} className="grid gap-3" autoComplete="off">

                        <div className="grid gap-1">
                            <Label htmlFor="email" className="text-xs text-slate-500">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                onChange={handleChange}
                                autoComplete="off"
                                className=" h-8 text-sm  border border-gray-300 hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-blue-500 "
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="password" className="text-xs text-slate-500">
                                Password
                            </Label>

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    onChange={handleChange}
                                    className=" h-8 text-sm  border border-gray-300 hover:border-blue-600 focus:border-blue-800 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                        </div>

                        <Button
                            type="submit"
                            className="w-full h-9 mt-2 bg-blue-500 hover:bg-blue-700 text-sm"
                        >
                            Login
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login