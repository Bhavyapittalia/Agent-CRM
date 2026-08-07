import api from '@/api/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { checkStatus } from '@/utils/check.status'
import { Eye, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/utils/use.debounce'

const PolicyList = () => {

    const [policies, setPolicies] = useState([])

    const [searchParams] = useSearchParams()

    const navigate = useNavigate()

    const search = searchParams.get("search")

    // console.log("search data is: ", search)

    const [filteredClient, setFileteredClient] = useState([])

    const [searchItem, setSearchItem] = useState("")

    const getPolicies = async () => {
        const response = await api.get(`/dashboard/cardPolicies?search=${search}`)

        if (search === "total-policies") {
            setPolicies(response.data.detailsOfAllPolicies)
            setFileteredClient(response.data.detailsOfAllPolicies)
        }

        if (search === "due-today") {
            setPolicies(response.data.todayPoliciesData)
            setFileteredClient(response.data.todayPoliciesData)
        }

        if (search === "due-this-week") {
            setPolicies(response.data.thisWeekPoliciesData)
            setFileteredClient(response.data.thisWeekPoliciesData)
        }
    }
    console.log("response data for the search data is: ", policies)

    const debouncedSearch = useDebounce(searchItem, 500)

    useEffect(() => {
        handleSearch(debouncedSearch)
    }, [debouncedSearch]) // this means this effect will only run if any search changed after some MS passed

    const handleSearch = async (debouncedSearch) => {
        const response = await api.get(`/policy/filter/client?name=${debouncedSearch}&type=${search}`)
        console.log("clients are: ", response.data.filteredClient)
        setFileteredClient(response.data.filteredClient)
    }

    console.log("search FILTERED data is: ", filteredClient)

    useEffect(() => {
        getPolicies()
    }, [search])

    return (

        <div className="min-h-screen bg-slate-100 px-6 py-8 ">
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">
                        {search === "total-policies" ? "All Policies" : search === "due-today" ? "Due Today Policies" : "Due This Week Policies"}
                    </h3>
                </div>


                <h3 className="text-xl font-semibold text-slate-900">
                    <Input
                        type="text"
                        className='border border-blue-300 focus:border-blue-500 focus-visible:ring-0 max-w-[20%]'
                        // value={"hii"}
                        onChange={(e) => setSearchItem(e.target.value)}
                        placeholder="search Policy" />
                </h3>


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

                                        <TableHead className="w-[15%] text-center"> Client Name </TableHead>
                                        <TableHead className="w-[15%] text-center">Policy Number</TableHead>
                                        <TableHead className="w-[15%] text-center">Policy Name</TableHead>
                                        <TableHead className="w-[15%] text-center">Premium</TableHead>
                                        <TableHead className="w-[15%] text-center">Next Payment Date</TableHead>
                                        <TableHead className="w-[15%] text-center">Status</TableHead>
                                        <TableHead className="w-[15%] text-center">Action</TableHead>


                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredClient.map(Policy => (

                                        <TableRow key={Policy._id}>
                                            <TableCell className="font-medium text-center">{Policy.clientId.name}</TableCell>
                                            <TableCell className="font-medium text-center">{Policy.policyNumber}</TableCell>
                                            <TableCell className="font-medium text-center">{Policy.policyName}</TableCell>
                                            <TableCell className="font-medium text-center">{Policy.policyAmount.toLocaleString("en-IN")}</TableCell>
                                            <TableCell className="font-medium text-center">{new Date(Policy.nextPaymentDate).toDateString()}</TableCell>
                                            <TableCell className="font-medium text-center">
                                                {checkStatus(Policy.policyStatus)}
                                            </TableCell>
                                            <TableCell className="font-medium text-center">
                                                <div className="flex justify-evenly gap-2">

                                                    <Button
                                                        // passing 2 id's to handle the "back" btn 
                                                        onClick={() => navigate(`/clients/policy/more-info/${Policy._id}`)}
                                                        className="bg-blue-100 hover:bg-blue-200 w-full sm:w-auto"
                                                    >
                                                        <Eye className="h-4 w-4 " />
                                                    </Button>

                                                    <Button
                                                        onClick={() => handleDelete(Policy._id)}
                                                        className="bg-red-100 hover:bg-red-200 w-full sm:w-auto"
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

            <Button
                className='flex mt-5'
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
        </div>
    )
}

export default PolicyList
