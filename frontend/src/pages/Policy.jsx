import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'


import { Plus, FileText, Eye, Pencil, Trash2 } from 'lucide-react'
import { checkStatus } from '@/utils/check.status'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { Input } from '@base-ui/react'
import { toast } from 'sonner'
import { formatDate } from '@/utils/format.date.jsx'

const Policy = () => {

    const [policies, setpolicies] = useState([])
    const [client, setClient] = useState({
        name: "",
        email: "",
        whatsappNumber: "",
        dateOfBirth: ""
    })

    const { id } = useParams()
    console.log("ID is: ", id)

    const navigate = useNavigate()

    const getPolicies = async (e) => {

        const response = await api.get(`/policy/${id}`)
        setpolicies(response.data.policy)

        // client Information
        const clientInfo = await api.get(`/client/${id}`)

        setClient({ ...clientInfo.data.clients, dateOfBirth: formatDate(clientInfo.data.clients.dateOfBirth) })
        console.log("client data is: ", clientInfo.data.clients)

        console.log("this clients policies details are: ", response.data)
    }

    // updating client
    const updateClient = async (e) => {
        e.preventDefault()

        const response = await api.put(`/client/${id}/edit-client`, { name: client.name, email: client.email, whatsappNumber: client.whatsappNumber, dateOfBirth: client.dateOfBirth })

        toast.success("client updated successfully!")
        console.log("updated client data is: ", response.data)
    }

    const handleChange = (e) => {
        setClient((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        getPolicies()
    }, [])

    return (

        <div className='min-h-screen bg-slate-100 px-6 py-8'>
            <div className='max-w-5xl mx-auto'>

                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                    <h3 className="text-xl font-semibold text-slate-900">
                        {client.name} Details
                    </h3>

                    <Button
                        onClick={() => navigate(`/clients/policy/add-policy/${id}`)}
                        className="h-9 bg-blue-600 hover:bg-blue-700 text-sm text-white"
                    >
                        Add Policy
                    </Button>
                </div>

                <div className='hidden md:block'>

                    <Card className="border-t-4 border-t-blue-600 shadow-sm rounded-lg overflow-hidden ring-0 max-w-[60%] ml-40">
                        <CardHeader>
                            <CardTitle>{client.name} Information</CardTitle>
                            <div className="mt-2 h-px w-full bg-gray-300"></div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Client Name</p>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={client.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[40%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Email</p>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={client.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[60%] ml-15 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Phone Number</p>
                                    <Input
                                        type="text"
                                        name="whatsappNumber"
                                        value={client.whatsappNumber}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[40%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Date of Birth</p>
                                    <Input
                                        type="date"
                                        name="dateOfBirth"
                                        value={client.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-18 text-center flex justify-evenly rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                                    />
                                </div>

                            </div>
                        </CardContent>
                    <div className="flex justify-center">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white max-w-[28%]"
                            onClick={updateClient}
                        >
                            <FileText className="h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                    </Card>


                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5'>
                    <h3 className="text-xl font-semibold text-slate-900">
                        {client.name} Policies
                    </h3>
                    </div>


                    <Card className="border-t-4 border-t-blue-600 shadow-sm rounded-lg overflow-hidden ring-0 mt-5">
                        <CardContent className='p-0 mt-[-16px]'>

                            {policies.length === 0 ? (
                                <div className="py-12 text-center text-sm text-slate-500">
                                    No policies
                                </div>
                            ) : (


                                // {/* table layout */}
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-blue-100">

                                            <TableHead className="w-[15%] text-center">Policy Number</TableHead>
                                            <TableHead className="w-[15%] text-center">Policy Name</TableHead>
                                            <TableHead className="w-[15%] text-center">Premium</TableHead>
                                            <TableHead className="w-[15%] text-center">Next Payment Date</TableHead>
                                            <TableHead className="w-[15%] text-center">Status</TableHead>
                                            <TableHead className="w-[15%] text-center">Action</TableHead>


                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {policies.map(Policy => (
                                            <TableRow key={Policy._id}>
                                                <TableCell className="font-medium text-center">{Policy.policyNumber}</TableCell>
                                                <TableCell className="font-medium text-center">{Policy.policyName}</TableCell>
                                                <TableCell className="font-medium text-center">{Policy.policyAmount.toLocaleString("en-IN")}</TableCell>
                                                <TableCell className="font-medium text-center">{new Date(Policy.nextPaymentDate).toDateString()}</TableCell>
                                                <TableCell className="font-medium text-center">
                                                    {checkStatus(Policy.policyStatus)}
                                                </TableCell>
                                                <TableCell className="font-medium text-center">
                                                    <div className="flex justify-evenly gap-2">

                                                        <Button
                                                            // passing 2 id's to handle the "back" btn 
                                                            onClick={() => navigate(`/clients/policy/more-info/${id}/${Policy._id}`)}
                                                            className="bg-blue-100 hover:bg-blue-200 w-full sm:w-auto"
                                                        >
                                                            <Eye className="h-4 w-4 " />
                                                        </Button>

                                                        <Button
                                                            onClick={() => handleDelete(Policy._id)}
                                                            className="bg-red-100 hover:bg-red-200 w-full sm:w-auto"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                        </CardContent>
                    </Card>
                    <div className='flex mt-5'>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/clients`)}
                        >
                            Back
                        </Button>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Policy
