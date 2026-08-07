import api from '../api/axios.js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from "@/components/ui/button"

import DashboardCard from '@/components/dashboard/DashboardCard.jsx'
import RemainderTable from '@/components/dashboard/RemainderTable.jsx'
import AlertTable from '@/components/dashboard/AlertTable.jsx'


const Dashboard = () => {

    const [summery, setSummery] = useState({})

    const [thisWeekRemainder, setThisWeekRemainder] = useState([])

    const [alert, setAlert] = useState([])

    const [upcomingFilter, setUpcomingFilter] = useState(7);

    const navigate = useNavigate()

    const getSummery = async () => {

        try {
            const response = await api.get("/dashboard/summery")

            const upcomingRemainder = await api.get("/dashboard/upcoming-remainder")

            setThisWeekRemainder(upcomingRemainder.data.policyInfo)

            setSummery(response.data)

            // as policies data is inside res.data.lastCron.policiesData
            // that wise we need to do first flatMap and then map to access the policiesData
            const alerts = response.data.filteredCron.flatMap((cron) =>
                cron.policiesDetail.map((policy) => ({
                    clientName: policy.clientName, // clientname is added afterwards in cronSchema.policiesDetail 
                    amount: policy.amount,
                    dueDate: policy.dueDate,
                    alertedOn: policy.alertedOn,
                    policyName: policy.policyName
                }))
            );

            setAlert(alerts);


            console.log("LAST alert history is: ", alerts)

            console.log("summery is: ", response.data)

            console.log("Upcoming Remainder are: ", upcomingRemainder.data)

            const data = response.data

            console.log("type of data in dashboard is: ", typeof data)
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

    // for upcoming remainder date filter
    const filteredRemainders = thisWeekRemainder.filter((item) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(item.nextPaymentDate);
        dueDate.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        console.log("diff is: ", diffDays)

        // it will return either "true" or "false" 
        // if policy satisfy condition means "true" then it will get store inside "filterRemainder" else not  
        return diffDays >= 0 && diffDays <= upcomingFilter;
    });
    console.log("filtered data is: ", filteredRemainders)

    return (
        <div className="min-h-screen bg-slate-100 px-6 py-8 w-full">
            <div className="max-w-7xl  mx-auto w-full">

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">
                        Dashboard
                    </h3>
                    <Button
                        onClick={() => navigate("/clients")}
                        className="h-9 bg-blue-600 hover:bg-blue-700 text-sm text-white"
                    >
                        View Clients
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map(( item ) => (
                        <DashboardCard 
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        onClick={item.action}
                        />
                    ))}
                </div>


                <div className="mt-6 flex flex-col lg:flex-row gap-6">

                    {/* Upcoming remainder table */}
                    <RemainderTable 
                    filteredRemainders = {filteredRemainders}
                    upcomingFilter = {upcomingFilter}
                    setUpcomingFilter = {setUpcomingFilter}
                    />

                    
                    {/* recent alert table card */}
                    <AlertTable 
                    alert = {alert}
                    />

                </div>

            </div >
        </div >
    )
}

export default Dashboard