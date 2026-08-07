import React from 'react'
import { Card, CardContent } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';


const AlertTable = ({alert}) => {

    return (
        <Card className="border-t-4 border-t-blue-600 rounded-lg overflow-hidden ring-0 shadow-sm w-full flex-1">
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
    )
}

export default AlertTable
