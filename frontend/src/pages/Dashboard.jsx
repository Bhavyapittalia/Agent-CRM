import api from '../api/axios.js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardCard from '@/components/dashboard/DashboardCard.jsx'
import RemainderTable from '@/components/dashboard/RemainderTable.jsx'
import AlertTable from '@/components/dashboard/AlertTable.jsx'
import Sidebar from '@/components/sidebar/Sidebar.jsx'
import PremiumChart from '@/components/dashboard/PremiumChart.jsx'
import { AlertCircle, Bell, Eye, Hourglass, HouseHeart, LucideHourglass, Trash, Upload, WaypointsIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx'
import { Button } from '@base-ui/react'


const Dashboard = () => {

    const [summery, setSummery] = useState({})

    const [thisWeekRemainder, setThisWeekRemainder] = useState([])

    const [alert, setAlert] = useState([])

    const [upcomingFilter, setUpcomingFilter] = useState(7);

    const [premiumData, setPremiumData] = useState([])

    const navigate = useNavigate()

    const getSummery = async () => {

        try {
            console.log("firing all the dashboard api")
            const [response, upcomingRemainder, premiumData] = await Promise.allSettled([
                api.get("/dashboard/summery"),
                api.get("/dashboard/upcoming-remainder"),
                api.get("/dashboard/analytics"),
            ])
            console.log("all the dashboard api are fired")


            if (premiumData.status === 'fulfilled' && premiumData.value) {
                console.log("api status is correct")
                setPremiumData(premiumData.value.data.formattedData);
            }

            if (response.status === 'fulfilled' && response.value) {
                setSummery(response.value.data)
            }

            if (upcomingRemainder.status === 'fulfilled' && upcomingRemainder.value) {
                console.log("second api status is also correct", upcomingRemainder.value.data.policyInfo)
                setThisWeekRemainder(upcomingRemainder.value.data.policyInfo)
            }

            // as policies data is inside res.data.lastCron.policiesData        
            // that wise we need to do first flatMap and then map to access the policiesData
            const alerts = response.value.data.filteredCron.flatMap((cron) =>
                cron.policiesDetail.map((policy) => ({
                    clientName: policy.clientName, // clientname is added afterwards in cronSchema.policiesDetail 
                    amount: policy.amount,
                    dueDate: policy.dueDate,
                    alertedOn: policy.alertedOn,
                    policyName: policy.policyName
                }))
            );

            setAlert(alerts);
        }
        catch (error) {
            console.log("error occured", error.response)
            console.log("error occured", error.message)
            console.log("error occured", error.response.data)
        }
    }


    useEffect(() => {
        getSummery()
    }, [])

    const stats = [
        {
            label: "Total Clients",
            value: summery.totalClients,
            action: () => navigate("/clients")
        },

        {
            label: "Total Policies",
            value: summery.totalPolicies,
            action: () => navigate("/clients/policies?search=total-policies")
        },

        {
            label: "Due Today",
            value: summery.dueToday,
            action: () => navigate("/clients/policies?search=due-today")
        },

        {
            label: "Due This Week",
            value: summery.dueThisWeek,
            action: () => navigate("/clients/policies?search=due-this-week")
        }
    ]

    const [pendingTask, setPendingTask] = useState([])
    const [showPendingPopup, setShowPendingPopup] = useState(false)

    const pending = async () => {
        const pendingWork = await api.get(`/dashboard/pending-task`)
        console.log("pending data:", pendingWork.data);

        const task = pendingWork.data.pending
        setPendingTask(task)

        const popup = sessionStorage.getItem("showPopup")

        if (task.length > 0 && !popup) {
            setShowPendingPopup(true)

            sessionStorage.setItem("showPopup", "true")
        }

    }

    const removePendingTask = async (jobId) => {

        await api.delete(`/dashboard/pending-task/${jobId}`)

        setPendingTask((prev) => {
            return (prev).filter((task) => {
                return task._id !== jobId
            })
        })
    }

    useEffect(() => {
        pending()
    }, [])

    console.log("pending task are: ", pendingTask)


    return (
        <div className="flex min-h-screen max-w-[1400px]">

            {/* Sidebar */}
            <Sidebar />


            {/* Dashboard */}
            <div className="flex-1 ml-45  bg-gray-50 px-6 py-8">
                <div className="">
                    <div className="flex items-center justify-center mb-6">
                    </div>

                    {/* testing of pending */}
                    <div className="flex justify-end mb-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full hover:bg-gray-100"
                            onClick={() => setShowPendingPopup(true)}
                        >
                            <Hourglass className="h-5 w-5 text-blue-700" />

                            {pendingTask.length > 0 && (
                                <span className="absolute -top-3 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                    {pendingTask.length}
                                </span>
                            )}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map((item) => (
                            <DashboardCard
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                onClick={item.action}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col lg:flex-row gap-6">
                        <RemainderTable
                            thisWeekRemainder={thisWeekRemainder}
                            upcomingFilter={upcomingFilter}
                            setUpcomingFilter={setUpcomingFilter}
                        />
                        <AlertTable alert={alert} />
                    </div>

                    <div className='mt-6'>
                        <PremiumChart data={premiumData} />
                    </div>
                </div>
            </div>


            {showPendingPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-5 py-4">

                            <div className='items-center ml-30'>
                                <h2 className="!text-black !font-xs">
                                    Pending Tasks
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {pendingTask.length} task waiting for verification
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPendingPopup(false)}
                                className="rounded-full"
                            >
                                ✕
                            </Button>

                        </div>


                        {/* Task List */}
                        <div className="max-h-80 overflow-y-auto p-4">

                            {pendingTask.length === 0 ? (

                                <div className="py-8 text-center text-sm text-gray-500">
                                    No pending tasks
                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {pendingTask.map((task) => (

                                        <div
                                            key={task._id}
                                            className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-3"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setShowPendingPopup(false)
                                                navigate(`/clients/policy/add-policy/${task.clientId}/${task._id}`)
                                            }}
                                        >

                                            {/* PDF information */}
                                            <div className="flex min-w-0 items-center gap-3">

                                                <Upload className="h-5 w-5 shrink-0 text-blue-600" />

                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-medium text-gray-800">
                                                        {task.fileId.originalName}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Buttons */}
                                            <div className="ml-3 flex shrink-0 gap-5">

                                                {/* Remove */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        removePendingTask(task._id, e)
                                                    }}
                                                >
                                                    <Trash className="h-5 w-5 text-red-600" /> 
                                                </Button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                </div>
            )}
        </div>
    );

}

export default Dashboard