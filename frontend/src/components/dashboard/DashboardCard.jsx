import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '@base-ui/react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2Icon, CalendarClock, CalendarDays, CalendarHeart, CalendarSearch, File, FileText, User } from 'lucide-react'

const DashboardCard = ({ label, value, onClick }) => {

    return (

        <div className="flex h-32">
            <Card
                key={label}
                className="border-t-4 border-t-blue-600 shadow-sm rounded-lg ring-0 w-full flex flex-col justify-between items-center p-2"
            >

                <CardContent className="flex flex-col items-center text-center mt-1">
                    {/* Icon */}
                    {label === "Total Clients" ? ( <User className="h-6 w-6 text-blue-600 mb-1" /> ) : label === "Total Policies" ? ( <FileText className="h-6 w-6 text-blue-600 mb-1" /> ) : label === "Due Today" ? ( <CalendarClock className="h-6 w-6 text-blue-600 mb-1" /> ) : ( <CalendarDays className="h-6 w-6 text-blue-600 mb-1" /> )}

                    <p className="text-xs text-slate-500">{label}</p>

                    <span className="text-lg font-semibold text-slate-900">
                        {value ?? "0"}
                    </span>
                <Button
                    onClick={onClick}
                    className="text-xs text-blue-500 font-semibold flex justify-center p-0 ring-0 mt-3"
                >
                    View
                </Button>
                </CardContent>

            </Card>
        </div>


    )
}

export default DashboardCard
