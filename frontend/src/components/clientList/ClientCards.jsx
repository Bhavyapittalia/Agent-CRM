import React from 'react'
import { Card, CardContent } from '../ui/card'
import { PhoneIncoming, Pin, PinIcon, PinOffIcon } from 'lucide-react'
import api from '@/api/axios'
import { useNavigate } from 'react-router-dom'

const ClientCards = ({ client, handlePinClient }) => {

    const navigate = useNavigate()

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {client.map((Client) => (

                <Card
                    key={Client._id}
                    className="ring-0  border-t-3 border-t-blue-600  w-[100%] h-32 mt-2 shadow ml-2 overflow-hidden p-0 "
                >

                    <CardContent className="p-0 flex flex-col h-full relative">

                        <div className='flex flex-1'>

                            {/* image part */}
                            <div className='w-24 rounded-r-md bg-slate-200 flex justify-center items-center font-bold text-blue-600 text-2xl'>
                                {Client.name.charAt(0).toUpperCase()}
                            </div>


                            {/* client information */}

                            <div className=' w-[75%] px-0 py-0 mt-5'>

                                <button
                                    onClick={() => handlePinClient(Client._id)}
                                    className={`absolute top-2 right-2 text-xs mt-2 ${Client.pinned ? "text-blue-600" : "text-slate-400"} `}
                                >

                                    <Pin size={16} fill={Client.pinned ? "currentColor" : "none"} />

                                </button>

                                <div className='flex-1'>
                                    <p className="text-sm font-bold text-slate-900">
                                        {Client.name}
                                    </p>

                                    <p className="text-xs  text-slate-500 ">
                                        {Client.email}
                                    </p>
                                </div>


                                <div className='flex-1'>
                                    <button className='text-xs text-blue-300 hover:cursor-pointer mt-5 ml-24 hover:text-blue-600 ' onClick={() => navigate(`/clients/policy/${Client._id}`)}>
                                        View Client →
                                    </button>
                                </div>

                            </div>

                        </div>


                        {/* bottom options */}
                        <div className='h-8 border-t flex text-xs'>

                            <button className='w-[34%] text-red-500 font-semibold rounded-r-md hover:bg-red-50 border-r'>
                                {/* <Trash2  /> */}
                                Delete
                            </button>

                            <button onClick={() => navigate(`/clients/add-clients`)} className=' w-[60%] text-blue-600 hover:bg-blue-50 font-semibold' >
                                Add Policy
                            </button>
                        </div>



                    </CardContent>

                </Card>
            ))}
        </div>
    )
}

export default ClientCards
