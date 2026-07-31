import api from '../api/axios.js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ScrollArea,
    ScrollBar
} from "@/components/ui/scroll-area"
import { FileText } from 'lucide-react'

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
            const alerts = response.data.lastCron.flatMap((cron) =>
                cron.policiesDetail.map((policy) => ({
                    clientName: policy.clientName, // clientname is added afterwards in cronSchema.policiesDetail 
                    amount: policy.amount,
                    dueDate: policy.dueDate,
                    alertedOn: cron.createdAt,
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
        },
        {
            label: "Total Policies",
            value: summery.totalPolicies,
        },
        {
            label: "Due Today",
            value: summery.dueToday,
        },
        {
            label: "Due This Week",
            value: summery.dueThisWeek
        }
    ]

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
        <div className="min-h-screen bg-slate-100 px-6 py-8 w-[100%]">
            <div className="max-w-5xl mx-auto">

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
                    {stats.map(({ label, value }) => (
                        <Card
                            key={label}
                            className="border-t-4 border-t-blue-600 shadow-sm rounded-lg ring-0 w-full"
                        >
                            <CardContent className="pt-5 pb-5">
                                <p className="text-xs text-slate-500 mb-1"> {label} </p>
                                <p className="text-2xl font-semibold text-slate-900"> {value ?? "0"} </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>


                <div className="mt-6 flex flex-col lg:flex-row gap-6">

                    <Card className="border-t-4 border-t-blue-600 rounded-lg overflow-hidden ring-0 shadow-sm  w-full lg:w-[410px]">
                        <CardContent className="">

                            <div className="p-1 border-b ">
                                <h3 className="text-xl font-semibold text-center ">
                                    Upcoming Reminders
                                </h3>

                                <select
                                    value={upcomingFilter}
                                    onChange={(e) => setUpcomingFilter(Number(e.target.value))}
                                    className="h-9 rounded-lg border border-blue-200 bg-white px-3 text-sm outline-none"
                                >
                                    <option value={7}>In 7 days</option>
                                    <option value={3}>In 3 days</option>
                                    <option value={1}>In 1 day</option>
                                </select>
                            </div>

                            <Table className="">
                                <TableHeader>
                                    <TableRow className="bg-blue-100 border-blue-200">
                                        <TableHead className='flex  justify-between items-center'>Client Name</TableHead>
                                        <TableHead className="">Next Payment Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>

                            <ScrollArea className="h-[260px]">
                                <Table>
                                    <TableBody >
                                        {filteredRemainders.map((item) => (
                                            <TableRow key={item._id} className="border-y-blue-200">
                                                <TableCell className="text-left">{item.clientName}</TableCell>
                                                <TableCell className=""> {new Date(item.nextPaymentDate).toLocaleDateString()} </TableCell>
                                                <TableCell className="text-right"> ₹ {item.Amount.toLocaleString("en-IN")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <ScrollBar orientation="vertical" />
                            </ScrollArea>

                        </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-blue-600 rounded-lg overflow-hidden ring-0 shadow-sm w-full lg:w-[540px]">
                        <CardContent className="">

                            <div className="p-1 border-b ">
                                <h3 className="text-xl font-semibold text-center ">
                                    Recent Alerts
                                </h3>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-100 border-blue-200">
                                        <TableHead className='text-left'>Client Name</TableHead>
                                        <TableHead className="text-left">Due Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Last Alerted On</TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>

                            <ScrollArea className="h-[260px]">
                                <Table>
                                    <TableBody>
                                        {alert.map((item) => (
                                            <TableRow key={item._id}>

                                                <TableCell className='text-left'>{item.clientName}</TableCell>

                                                <TableCell className='text-right'>
                                                    {new Date(item.dueDate).toLocaleDateString()}
                                                </TableCell>

                                                <TableCell className='text-right'>
                                                    ₹ {item.amount.toLocaleString("en-IN")}
                                                </TableCell>

                                                <TableCell className='text-right'>
                                                    {new Date(item.alertedOn).toDateString()}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <ScrollBar orientation="vertical" />
                            </ScrollArea>

                        </CardContent>
                    </Card>

                </div>

            </div >
        </div >
    )
}

export default Dashboard