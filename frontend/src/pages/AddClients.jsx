import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddClients = () => {

    const [client, setClient] = useState({})


    const navigate = useNavigate()

    const handleChange = (e) => {
        setClient((prevDetails) => ({
            ...prevDetails,
            [e.target.name]: e.target.value
        }))
    }

    const addClient = async (e) => {

        e.preventDefault()

        try {   
            const response = await api.post("http://localhost:3000/client/add-client", { name: client.name, whatsappNumber: client.phone, email: client.email, dateOfBirth: client.dob  })

            toast.success("Client added successfully");

            navigate("/clients")
            console.log("added client details are: ", response.data)
        }
        catch (error) {
            console.log("error occurred: ", error.response)
            console.log("error occurred: ", error.response.data)
            console.log("error occurred: ", error.message)
        }
    }

return (

        <div className="min-h-screen bg-slate-100 px-6 py-8">

            <div className="max-w-[35%] mx-auto">
                <Card className="border-t-4 border-t-blue-600 shadow-sm ring-0">

                    <CardContent className="pt-6">

                        <p className="text-2xl font-semibold mb-1 text-black">Add New Client</p>
                        <div className="mt-2 h-px w-full bg-blue-100"></div>

                        <form onSubmit={addClient}className="space-y-5 max-h-[500px]">

                            <div>

                                <label className="text-sm font-medium text-slate-500 flex mt-10"> Client Name </label>

                                <Input name="name" onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500" />

                            </div>

                            <div className=' '>

                                <label className="text-sm font-medium text-slate-500 flex mt-5"> Email </label>

                                <Input type="email" name="email" onChange={handleChange}  required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500" />

                            </div>


                            <div>

                                <label  className="text-sm font-medium text-slate-500 flex mt-5"> WhatsApp Number </label>

                                <Input type="tel" name="phone" onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500"
                                />

                            </div>

                            <div>

                                <label className="text-sm font-medium text-slate-500 flex mt-5"> Date of Birth </label>

                                <Input type="date" name="dob"  onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500" />

                            </div>

                            <div className="flex justify-end gap-3 pt-2">

                                <Button type="button" onClick={() => navigate("/clients")} > Cancel
                                </Button>

                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" > Add 
                                </Button>

                            </div>

                        </form>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}

export default AddClients



