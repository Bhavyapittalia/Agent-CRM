import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { record } from 'zod';

const AddClients = () => {

    const [client, setClient] = useState({})

    const [isExtracting, setIsExtracting] = useState(false);

    const [pdfId, setPdfId] = useState(null)
    const [importId, setImportId] = useState(null)
    const [extractJobId, setExtractJobId] = useState(null)
    const [monthlyRecords, setMonthlyRecords] = useState([])


    const navigate = useNavigate()

    const handleChange = (e) => {
        setClient((prevDetails) => ({
            ...prevDetails,
            [e.target.name]: e.target.value
        }))
    }

    const addClient = async (e) => {

        e.preventDefault()

        try {
            const response = await api.post("http://localhost:3000/client/add-client", { name: client.name, whatsappNumber: client.phone, email: client.email, dateOfBirth: client.dob })

            toast.success("Client added successfully");

            navigate("/clients")
            console.log("added client details are: ", response.data)
        }
        catch (error) {
            console.log("error occurred: ", error.response)
            console.log("error occurred: ", error.response.data)
            console.log("error occurred: ", error.message)
        }
    }



    const uploadPdf = async (selectedFile) => {
        try {
            if (!selectedFile) {
                return
            }

            console.log("selected monthly PDF: ", selectedFile)

            const formData = new FormData()

            formData.append("monthlyPdf", selectedFile)

            const response = await api.post("/client/monthly-import", formData)

            console.log("monthly upload response: ", response.data)

            setPdfId(response.data.pdfId)
            setImportId(response.data.importId)

            toast.success("Monthly PDF uploaded successfully")

        } catch (error) {
            console.log("monthly PDF upload error: ", error)
            toast.error("Failed to upload monthly PDF")
        }
    }

    const extractPdfData = async () => {
        try {
            console.log("pdf id is: ", pdfId)
            console.log("import id is: ", importId)

            if (!pdfId || !importId) {
                toast.error("Please upload PDF first")
                return
            }

            toast.success("PDF extraction started")

            const response = await api.post("/client/monthly-import/extract-pdf", { pdfId: pdfId, importId: importId })

            console.log("monthly extract response: ", response.data)

            setExtractJobId(response.data.jobId)
            setIsExtracting(true)

        } catch (error) {
            console.log("PDF extraction error:", error)
            toast.error("Failed to start PDF extraction")
        }
    }


    const checkPdfStatus = async () => {
        try {
            const response = await api.get(`/client/monthly-import/status/${pdfId}`)
            console.log("pdf status run successfully!")

            console.log("monthly status response: ", response.data)

            const { status } = response.data

            if (status === "completed") {

                const resultResponse = await api.get(`/client/monthly-import/result/${pdfId}`)

                console.log("monthly PDF result: ", resultResponse.data)

                const result = resultResponse.data.result

                setMonthlyRecords(result)

                toast.success("Monthly PDF extracted successfully")

                return true
            }

            if (status === "failed") {
                toast.error("Monthly PDF extraction failed")
                return true
            }

            return false

        } catch (error) {
            console.log("monthly status error: ", error)
            return true
        }
    }


    const handleRecordChange = (index, field, value) => {
        setMonthlyRecords((prevRecords) =>
            prevRecords.map((record, i) =>
                i === index
                    ? {
                        ...record,
                        [field]: value
                    }
                    : record
            )
        )
    }


    useEffect(() => {

        if (!pdfId || !isExtracting) {
            return
        }

        let interval

        const startPolling = async () => {

            const finished = await checkPdfStatus()

            if (finished) {
                setIsExtracting(false)
                clearInterval(interval)
            }
        }

        interval = setInterval(startPolling, 2000)

        return () => {
            clearInterval(interval)
        }

    }, [pdfId, isExtracting])


    return (

        <div className="min-h-screen bg-slate-100 px-6 py-8">

            <div className="max-w-5xl mx-auto">
                <Card className="border-t-4 border-t-blue-600 shadow-sm ring-0 rounded-2xl">

                    <CardContent className="pt-0">

                        <p className="text-2xl font-semibold mb-1 text-black"> Add New Client </p>
                        <div className="mt-2 h-px w-full bg-blue-100"></div>

                        <form onSubmit={addClient} className="space-y-5 max-h-[500px] overflow-y-auto border ">

                            <div className="rounded-xl border border-blue-200 bg-blue-50/50">

                                <label className="text-sm font-medium text-black">
                                    Upload Monthly PDF
                                </label>

                                <div className="flex items-center gap-3 mt-2">

                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => uploadPdf(e.target.files[0])}
                                        className="bg-white h-9 w-60 ml-0"
                                    />

                                    <Button
                                        type="button"
                                        onClick={extractPdfData}
                                        disabled={isExtracting || !pdfId}
                                        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap h-9"
                                    >

                                        {isExtracting ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                Extracting...
                                            </div>
                                        ) : (
                                            "Extract Details"
                                        )}

                                    </Button>

                                </div>

                                {monthlyRecords.map((record, index) => (
                                    <tr key={index}>
                                        <td className="border border-slate-300 p-2">
                                            {index + 1}
                                        </td>

                                        <td className="border border-slate-300 p-2">
                                            <Input
                                                value={record.clientName || ""}
                                                onChange={(e) =>
                                                    handleRecordChange(
                                                        index,
                                                        "clientName",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-w-[180px]"
                                            />
                                        </td>

                                        <td className="border border-slate-300 p-2">
                                            <Input
                                                value={record.policyNumber || ""}
                                                onChange={(e) =>
                                                    handleRecordChange(
                                                        index,
                                                        "policyNumber",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-w-[200px]"
                                            />
                                        </td>

                                        <td className="border border-slate-300 p-2">
                                            <Input
                                                value={record.policyName || ""}
                                                onChange={(e) =>
                                                    handleRecordChange(
                                                        index,
                                                        "policyName",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-w-[120px]"
                                            />
                                        </td>

                                        <td className="border border-slate-300 p-2">
                                            <Input
                                                value={record.premiumAmount || ""}
                                                onChange={(e) =>
                                                    handleRecordChange(
                                                        index,
                                                        "premiumAmount",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-w-[120px]"
                                            />
                                        </td>

                                        <td className="border border-slate-300 p-2">
                                            <Input
                                                value={record.startDate || ""}
                                                onChange={(e) =>
                                                    handleRecordChange(
                                                        index,
                                                        "startDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-w-[120px]"
                                            />
                                        </td>

                                        <td className="border border-slate-300 p-2">
                                            <Input
                                                value={record.endDate || ""}
                                                onChange={(e) =>
                                                    handleRecordChange(
                                                        index,
                                                        "endDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="min-w-[120px]"
                                            />
                                        </td>
                                    </tr>
                                ))}


                            </div>

                            <div>

                                <label className="text-sm font-medium text-slate-500 flex mt-10"> Client Name </label>

                                <Input name="name" onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500" />

                            </div>

                            <div className=' '>

                                <label className="text-sm font-medium text-slate-500 flex mt-5"> Email </label>

                                <Input type="email" name="email" onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500" />

                            </div>


                            <div>

                                <label className="text-sm font-medium text-slate-500 flex mt-5"> WhatsApp Number </label>

                                <Input type="tel" name="phone" onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500"
                                />

                            </div>

                            <div>

                                <label className="text-sm font-medium text-slate-500 flex mt-5"> Date of Birth </label>

                                <Input type="date" name="dob" onChange={handleChange} required className="mt-2 h-10 rounded-xl  focus-visible:ring-0 border border-blue-200 focus:border-blue-500" />

                            </div>

                            <div className="flex justify-end gap-3 pt-2">

                                <Button type="button" onClick={() => navigate("/clients")} > Cancel
                                </Button>

                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" > Add
                                </Button>

                            </div>

                        </form>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}

export default AddClients



