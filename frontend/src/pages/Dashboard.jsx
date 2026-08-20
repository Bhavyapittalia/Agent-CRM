import api from '../api/axios.js'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Button } from "@/components/ui/button"

import DashboardCard from '@/components/dashboard/DashboardCard.jsx'
import RemainderTable from '@/components/dashboard/RemainderTable.jsx'
import AlertTable from '@/components/dashboard/AlertTable.jsx'
import Sidebar from '@/components/sidebar/Sidebar.jsx'
import PremiumChart from '@/components/dashboard/PremiumChart.jsx'


const Dashboard = () => {

    const [summery, setSummery] = useState({})

    const [thisWeekRemainder, setThisWeekRemainder] = useState([])

    const [alert, setAlert] = useState([])

    const [upcomingFilter, setUpcomingFilter] = useState(7);

    const [premiumData, setPremiumData] = useState([])

    const navigate = useNavigate()

    const getSummery = async () => {

        try {

            const [response, upcomingRemainder, premiumData] = await Promise.all([
                api.get("/dashboard/summery"),
                api.get("/dashboard/upcoming-remainder"),
                api.get("/dashboard/analytics"),
            ])

            // const response = await api.get("/dashboard/summery")

            // const upcomingRemainder = await  api.get("/dashboard/upcoming-remainder")

            // const premiumData = await api.get("/dashboard/analytics")

            // monthly expected premium data
            setPremiumData(premiumData.data.formattedData)

            // this week remainder data
            setThisWeekRemainder(upcomingRemainder.data.policyInfo)

            // cards summery data
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


    return (
        <div className="flex min-h-screen max-w-[1400px]">

            {/* Sidebar */}
            <Sidebar />


            {/* Dashboard */}
            <div className="flex-1 ml-45  bg-gray-50 px-6 py-8">
                <div className="">
                    <div className="flex items-center justify-center mb-6">
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
        </div>
    );

}

export default Dashboard