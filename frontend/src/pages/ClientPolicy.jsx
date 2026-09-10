import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { formatDate } from '@/utils/format.date.jsx'
import ClientPoliciesTable from '@/components/clientPolicy/policyTable'
import EditForm from '@/components/clientPolicy/EditForm'

const ClientPolicy = () => {

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

        try {
            const response = await api.get(`/policy/${id}`)
            setpolicies(response.data.policy)
            
            // client Information
            const clientInfo = await api.get(`/client/${id}`)
            setClient({ ...clientInfo.data.clients, dateOfBirth: formatDate(clientInfo.data.clients.dateOfBirth) })

        }
        catch (error) {
            console.log("error: ", error.message)
        }
    }

    // sending alert to the client manually
    const sentAlert = async (policyId) => {
        console.log("sent alert is running after click")

        try {
            await api.get(`/policy/send-alert/${policyId}`)
            toast.success("alert sent successfully")
        }
        catch (error) {
            console.log(error)
        }
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

                    <EditForm 
                    client={client}
                    handleChange={handleChange}
                    updateClient={updateClient}
                    />


                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5'>
                    <h3 className="text-xl font-semibold text-slate-900">
                        {client.name} Policies
                    </h3>
                    </div>

                    {/* client all policies table */}
                    <ClientPoliciesTable 
                    policies={policies}
                    sentAlert={sentAlert}
                    id={id}
                    />

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

export default ClientPolicy
