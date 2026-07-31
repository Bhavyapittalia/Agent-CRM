import api from '@/api/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


const EditClient = () => {

    const [client, setClient] = useState({})

    const {id} = useParams()

    const navigate = useNavigate()

    const getClientData = async () => {

        const response = await api.get(`/client/${id}/edit-client`)
        console.log("response for updated data is: ", response.data)

        setClient(response.data)
    }

    useEffect(() => {
        getClientData()
    }, [])

    return (
        <div>
            Edit your client Here....
        </div>
    )
}

export default EditClient
