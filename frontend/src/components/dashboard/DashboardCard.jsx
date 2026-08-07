import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '@base-ui/react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2Icon, CalendarClock, CalendarDays, CalendarHeart, CalendarSearch, File, FileText, User } from 'lucide-react'

const DashboardCard = ({ label, value, onClick }) => {

    return (
        <Card
            key={label}
            className="border-t-4 border-t-blue-600 shadow-sm rounded-lg ring-0 w-full"
        >
            <CardContent className="pt-5">

                <p className="text-xs text-slate-500 mb-1"> 
                    {label === "Total Clients" ? <User className='flex justify-center items-center ml-22 mb-2'/> : label === "Total Policies" ? <FileText className='flex justify-center items-center ml-22 mb-2'/> : label === "Due Today" ? <CalendarClock className='flex justify-center items-center ml-22 mb-2'/> : <CalendarDays  className='flex justify-center items-center ml-22 mb-2'/> }
                    {label} </p>
                <p className="text-2xl font-semibold text-slate-900"> {value ?? "0"} </p>

            </CardContent>

            <Button
                onClick={onClick}
                className="text-xs text-blue-500 font-semibold flex  justify-center mb-0 p-0 ring-0"
            >
                View
            </Button>

        </Card>
    )
}

export default DashboardCard
