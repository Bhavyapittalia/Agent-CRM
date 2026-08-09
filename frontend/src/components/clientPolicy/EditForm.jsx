import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Input } from '@base-ui/react'
import { Button } from "@/components/ui/button"

import { Plus, FileText, Eye, Pencil, Trash2 } from 'lucide-react'
import { checkStatus } from '@/utils/check.status'

const EditForm = ({client, handleChange, updateClient}) => {
    return (
        // <div>
            <Card className="border-t-4 border-t-blue-600 shadow-sm rounded-lg overflow-hidden ring-0 max-w-[60%] ml-40">
                <CardHeader>
                    <CardTitle>{client.name} Information</CardTitle>
                    <div className="mt-2 h-px w-full bg-gray-300"></div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col">
                            <p className="text-sm text-slate-500">Client Name</p>
                            <Input
                                type="text"
                                name="name"
                                value={client.name}
                                onChange={handleChange}
                                required
                                className="mt-1 h-10 max-w-[40%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-sm text-slate-500">Email</p>
                            <Input
                                type="email"
                                name="email"
                                value={client.email}
                                onChange={handleChange}
                                required
                                className="mt-1 h-10 max-w-[60%] ml-15 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-sm text-slate-500">Phone Number</p>
                            <Input
                                type="text"
                                name="whatsappNumber"
                                value={client.whatsappNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 h-10 max-w-[40%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-sm text-slate-500">Date of Birth</p>
                            <Input
                                type="date"
                                name="dateOfBirth"
                                value={client.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="mt-1 h-10 max-w-[50%] ml-18 text-center flex justify-evenly rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                            />
                        </div>

                    </div>
                </CardContent>
                <div className="flex justify-center">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white max-w-[28%]"
                        onClick={updateClient}
                    >
                        <FileText className="h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </Card>
        // </div>
    )
}

export default EditForm
