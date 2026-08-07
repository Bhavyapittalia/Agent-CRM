import React from 'react'
import { Card, CardContent } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useNavigate } from 'react-router-dom';


const RemainderTable = ({ upcomingFilter, filteredRemainders, setUpcomingFilter }) => { 

    const navigate = useNavigate()
    
    return (

        //UPCOMING REMAINDER TABLE CARD
        <Card className="border-t-4 border-t-blue-600 rounded-lg overflow-hidden ring-0 shadow-sm  w-full flex-1" >
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
                            <TableHead className='flex  justify-between items-center'> Client Name </TableHead>
                            <TableHead className="">Next Payment Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>

                <ScrollArea className="h-[260px]">
                    <Table>
                        <TableBody >
                            {filteredRemainders.map((item) => (
                                <TableRow key={item._id} className="border-y-blue-200 cursor-pointer hover:bg-blue-200" onClick={() => navigate(`/clients/policy/more-info/${item.clientId}/${item.policyId}`)}>
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
        </Card >
    )
}

export default RemainderTable
