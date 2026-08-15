import React from 'react'
import { Card, CardContent } from '../ui/card'
import { PhoneIncoming, Pin, PinIcon, PinOffIcon } from 'lucide-react'
import api from '@/api/axios'
import { useNavigate } from 'react-router-dom'

const ClientCards = ({ client, handlePinClient, clientUpcomingPolicy }) => {

    const navigate = useNavigate()

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {client.map((Client) => {

                // as our data is in like this way: -
                // 6a6df8e4be098dea23e29a58: {policyName: 'accident  policy', policyAmount: 52000}
                // 6a6df8f6be098dea23e29a59: {policyName: 'accident special policy', policyAmount: 232500}
                
                // so to access data we can access through the client id's like clientUpcomingPolicy[6a6df8e4be098dea23e29a58] 
                const upcomingPolicies = clientUpcomingPolicy[Client._id]

                return (

                    <Card
                        key={Client._id}
                        className="ring-0  border-t-3 border-t-blue-600  w-[100%] h-28 mt-2 shadow ml-2 overflow-hidden p-0 "
                        onClick={() => navigate(`/clients/policy/${Client._id}`)}

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

                                    <div className="mt-1">
                                        <p className="text-[10px] font-medium text-slate-400">
                                            Upcoming Premium
                                        </p>

                                        <div className="flex items-center gap-2 mt-0.5 justify-evenly">
                                            <p className="text-[11px] font-semibold text-slate-600">
                                                {new Date(upcomingPolicies?.nextPaymentDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </p>

                                            <p className="text-[11px] text-slate-400 truncate">
                                                {upcomingPolicies?.policyName}
                                            </p>
                                        </div>

                                        <p className="text-[11px] font-semibold text-blue-600">
                                            ₹{upcomingPolicies?.policyAmount}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </CardContent>

                    </Card>

                )
            })}
        </div>
    )
}

export default ClientCards
