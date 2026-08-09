import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { checkStatus } from '@/utils/check.status'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@base-ui/react'
import { useNavigate } from 'react-router-dom'

const AllPolicies = ({policies, filteredClient}) => {

    const navigate = useNavigate()
    return (
        <div>
            <Card className="border-t-4 border-t-blue-600 shadow-sm rounded-lg overflow-hidden ring-0 mt-5">
                <CardContent className='p-0 mt-[-16px]'>

                    {policies.length === 0 ? (
                        <div className="py-12 text-center text-sm text-slate-500">
                            No policies
                        </div>
                    ) : (


                        // {/* table layout */}
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-blue-100">

                                    <TableHead className="w-[5%] text-center">No.</TableHead>
                                    <TableHead className="w-[15%] text-center"> Client Name </TableHead>
                                    <TableHead className="w-[15%] text-center">Policy Number</TableHead>
                                    <TableHead className="w-[15%] text-center">Policy Name</TableHead>
                                    <TableHead className="w-[15%] text-center">Premium</TableHead>
                                    <TableHead className="w-[15%] text-center">Next Payment Date</TableHead>
                                    <TableHead className="w-[15%] text-center">Action</TableHead>


                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredClient.map((Policy, index) => (

                                    <TableRow key={Policy._id}>

                                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium text-center">{Policy.clientId.name}</TableCell>
                                        <TableCell className="font-medium text-center">{Policy.policyNumber}</TableCell>
                                        <TableCell className="font-medium text-center">{Policy.policyName}</TableCell>
                                        <TableCell className="font-medium text-center">{Policy.policyAmount.toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="font-medium text-center">{new Date(Policy.nextPaymentDate).toDateString()}</TableCell>
                                        <TableCell className="font-medium text-center">
                                            <div className="flex justify-evenly gap-2">

                                                <Button
                                                    // passing 2 id's to handle the "back" btn 
                                                    onClick={() => navigate(`/clients/policy/more-info/${Policy._id}`)}
                                                    className="bg-blue-100 hover:bg-blue-200 h-8 w-9 p-2.5 rounded-md"
                                                >
                                                    <Eye className="h-4 w-4 " />
                                                </Button>

                                                <Button
                                                    onClick={() => handleDelete(Policy._id)}
                                                    className="bg-red-100 hover:bg-red-200  h-8 w-9 p-2.5 rounded-md"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}


                </CardContent>
            </Card>
        </div>
    )
}

export default AllPolicies
