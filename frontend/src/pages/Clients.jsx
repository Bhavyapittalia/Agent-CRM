import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Plus, FileText, Eye, Pencil, Trash2, Delete, DeleteIcon, LucideDelete, Pin } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/utils/use.debounce'
import Sidebar from '@/components/sidebar/Sidebar'
import ClientCards from '@/components/clientList/ClientCards'


const Clients = () => {
    console.log("clients page is loading....")

    // as data from the frontend is coming in the form of "Array" that wise we have to store in the []
    const [client, setClient] = useState([])

    // const [filteredClients, setFilteredClients] = useState([])

    const navigate = useNavigate()

    const getClients = async () => {
        try {
            const response = await api.get("/client")
            // as data is inside the clients 
            setClient(response.data.clients)
            // setFilteredClients(response.data.clients)

            const data = response.data.clients
            console.log("your clients are: ", response.data.clients)
            console.log("Is data is in a Array format?.. ", Array.isArray(data))
            console.log("client: ", client)
        }
        catch (error) {
            console.log("error is: ", error.response)
            console.log("error is: ", error.response.data)
            console.log("error is: ", error.message)
        }
    }

    const [searchItem, setSearchItem] = useState("")

    const debouncedSearchTerm = useDebounce(searchItem, 500)

    // This effect ONLY triggers when the debounced value finally changes
    useEffect(() => {
        handleSearch(debouncedSearchTerm)
    }, [debouncedSearchTerm])

    const handleSearch = async (searchValue) => {

        const response = await api.get(`/client/search?name=${searchValue}`)
        console.log("filtered client data is: ", response.data.client)
        setClient(response.data.client)

    }


    const handlePinClient = async (clientId) => {

        try {
            // this API right now is just updating the "pin" status in DB
            console.log("you clicked pin...")
            console.log("client id is: ", clientId)
            await api.put(`/client/${clientId}/pin`)
            console.log("API runned....")
            getClients()
        }
        catch (error) {
            console.log("error occured in pining: ", error.response)
            console.log("error occured in pining: ", error.response)
        }
    }


    useEffect(() => {
        getClients()
    }, [])


    return (
        <div className='flex'>
            <Sidebar />
            <div className="flex-1 min-h-screen bg-gray-50 px-3 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Your Clients
                        </h3>

                        <h3 className="text-xl font-semibold text-slate-900">
                            <Input
                                type="text"
                                className='border border-blue-300 focus:border-blue-500 focus-visible:ring-0'
                                value={searchItem}
                                onChange={(e) => setSearchItem(e.target.value)}
                                placeholder="search Clients" />
                        </h3>

                        <Button
                            onClick={() => navigate("/clients/add-clients")}
                            className="h-9 bg-blue-600 hover:bg-blue-700 text-sm text-white">
                            Add Clients
                        </Button>

                        {/* <AddClients
                        refreshClients={getClients}
                        /> */}
                    </div>

                    <div className='hidden md:block'>

                        {client.length === 0 ? (
                            <div className="py-12 text-center text-sm text-slate-500">
                                No clients added yet.
                            </div>
                        ) : (

                            // implementing the each client card
                            <ClientCards client={client} handlePinClient={handlePinClient}/>

                        )}

                        <div className='flex mt-5'>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(`/dashboard`)}
                            >
                                Back
                            </Button>
                        </div>
                    </div>

                    <div className="md:hidden space-y-4">

                        {client.map((Client) => (

                            <Card
                                key={Client._id}
                                className="border-t-4 border-t-blue-600 shadow-sm ring-0"
                            >

                                <CardContent className="p-4">

                                    <div className="mb-3">

                                        <p className="text-lg font-semibold">
                                            {Client.name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {Client.email}
                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {Client.whatsappNumber}
                                        </p>

                                    </div>

                                    <div className="grid grid-cols-3 gap-2">

                                        {/* View */}
                                        <Button
                                            className="bg-blue-100 hover:bg-blue-200 "
                                            onClick={() =>
                                                navigate(`/clients/policy/${Client._id}`)
                                            }
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>

                                        {/* Edit */}
                                        <Button
                                            className="bg-amber-100 hover:bg-amber-200 "
                                            onClick={() =>
                                                navigate(`/clients/edit/${Client._id}`)
                                            }
                                        >
                                            <Pencil className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>

                                        {/* Delete */}
                                        <Button
                                            className="bg-red-100 hover:bg-red-200 "
                                            onClick={() =>
                                                handleDelete(Client._id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>

                                    </div>

                                </CardContent>

                            </Card>

                        ))}

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Clients