import api from '@/api/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/utils/use.debounce'
import Sidebar from '@/components/sidebar/Sidebar'
import AllPolicies from '@/components/filterPolicy/AllPoliciesTable'

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

        <div className='flex'>
            <Sidebar />

            <div className="flex-1 min-h-screen bg-gray-50 px-6 py-8 ">
                <div className="max-w-6xl mx-auto">

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


                    {/* list of all policies compoenet */}
                    <AllPolicies 
                    policies={policies}
                    filteredClient={filteredClient}
                    />

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
        </div>
    )
}

export default PolicyList
