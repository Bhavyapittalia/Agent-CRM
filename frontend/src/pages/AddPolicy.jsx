import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { formatDate } from '@/utils/format.date'

const AddPolicy = () => {

    const [policy, setPolicy] = useState({
        policyNumber: "",
        policyName: "",
        premiumAmount: "",
        paymentMode: "",
        nextPaymentDate: "",
        lastPaymentDate: "",
        email: "",
        customerId: ""
    });

    const [pdfId, setPdfId] = useState(null)
    const [pdfFile, setPdfFile] = useState(null)
    const [extractJobId, setExtractJobId] = useState(null)

    const [isExtracting, setIsExtracting] = useState(false);

    const { id } = useParams()
    const { jobId } = useParams()

    console.log("clinet id is: ", id)
    console.log("jobid is: ", jobId)

    const navigate = useNavigate()

    const handleChange = (e) => {

        setPolicy((prevDetails) => ({
            ...prevDetails,
            [e.target.name]: e.target.value
        }))

    }

    const addPolicy = async (e) => {

        e.preventDefault()

        try {
            console.log("add policy function is running...")
            console.log("job id in add policy is: ", jobId)
            const response = await api.post(`/policy/add-policy/${id}`, { policyNumber: policy.policyNumber, policyName: policy.policyName, policyAmount: policy.premiumAmount, nextPaymentDate: policy.nextPaymentDate, lastPremiumPaidDate: policy.lastPaymentDate, jobId: extractJobId, pdfId: pdfId })

            toast.success("Policy Added Successfully")
            console.log("policy entered data is: ", policy)
        }
        catch (error) {
            console.log("error is: ", error.response)
            console.log("error is: ", error.response.data)
            console.log("error is: ", error.message)
        }
    }



    // this function for uploading pdf
    const uploadPdf = async (selectedFile) => {

        try {
            console.log("it's running.........")
            setPdfFile(selectedFile)

            const formData = new FormData()

            // directly using the argument here as the setPdfFile State is not updated yet 
            formData.append("policyPdf", selectedFile)

            // upload PDF API
            const response = await api.post("/policy/upload-policy", formData)

            // getting that stored pdfId into the frontend back
            setPdfId(response.data.pdfId)

        }
        catch (error) {
            toast.error("Fail")
        }
    }

    console.log("setpolicy is: ", pdfId)

    // this function is for extracting pdf data
    const extractPdfData = async () => {
        try {
            console.log("and the pdf id is: ", pdfId)

            toast.success("PDF extraction start")

            // extract PDF DATA API
            const response = await api.post('/policy/extract-policy', { pdfId: pdfId, clientId: id })
            setIsExtracting(true);
            setExtractJobId(response.data.jobId)

            console.log("/extract-policy response is: ", response)


        } catch (error) {
            console.log("PDF extraction error:", error)
            toast.error("Failed to extract policy details")
        }
    }

    console.log("JOB ID IS: ", jobId)

    const checkPdfStatus = async () => {
        try {

            // check status of pdf API
            const response = await api.get(`/policy/status/${pdfId}`)
            console.log("response of status API is: ", response.data)

            const { status } = response.data

            if (status === "completed") {

                // get pdf result on status "complete" API
                const resultResponse = await api.get(`/policy/result/${pdfId}`)

                const result = resultResponse.data.result

                console.log("PDF result is: ", resultResponse.data)

                if (result.message === "Invalid PDF") {
                    toast.error("Invalid Pdf")
                    setIsExtracting(false)
                    return
                }

                setPolicy((prev) => ({
                    ...prev,
                    policyNumber: result.policyNumber,
                    policyName: result.policyName,
                    premiumAmount: result.premiumAmount,
                    email: result.email,
                    customerId: result.customerId,
                    nextPaymentDate: formatDate(result.nextPaymentDate),
                    lastPaymentDate: formatDate(result.startDate)
                }))

                toast.success("Policy details extracted successfully");

                return true;
            }

            if (status === "failed") {
                toast.error(error || "PDF extraction failed");
                return true;
            }

            return false

        }
        catch (error) {
            console.log(error)
            return true
        }
    }

    console.log("POLICY DATA IS: ", policy)


    // this function is for showing up the pending task for PDF
    const getPendingPdf = async () => {

        try {
            console.log("job id is: ", jobId)
            console.log("get pending is runnning...")

            const responseResult = await api.get(`/dashboard/pending-task-result/${id}/${jobId}`)
            console.log("pending task PDF data is: ", responseResult.data)

            const response = responseResult.data.result

            setPolicy((prev) => ({
                ...prev,
                policyNumber: response.policyNumber,
                policyName: response.policyName,
                premiumAmount: response.premiumAmount,
                email: response.email,
                customerId: response.customerId,
                nextPaymentDate: formatDate(response.nextPaymentDate),
                lastPaymentDate: formatDate(response.startDate)
            }))
            toast.success("pending PDF")
        }
        catch (error) {
            console.log("error in pending task", error)
        }

    }

    useEffect(() => {
        getPendingPdf()
    }, [])



    useEffect(() => {

        if (!pdfId || !isExtracting) {
            return;
        }

        let interval;

        const startPolling = async () => {

            const finished = await checkPdfStatus();

            if (finished) {
                setIsExtracting(false);
                clearInterval(interval);
            }
        };

        interval = setInterval(startPolling, 2000);

        return () => {
            clearInterval(interval);
        };

    }, [pdfId, isExtracting]);


    return (

        <div className="min-h-screen  px-6 py-8">
            <div className="max-w-3xl mx-auto">
                <Card className="border-t-4 border-t-blue-600 shadow-sm ring-0 rounded-2xl">
                    <CardContent className="pt-0">
                        <p className="text-xl font-semibold  text-black">
                            Add Policy
                        </p>

                        <div className="mt-2 h-px w-full bg-blue-100"></div>

                        <form onSubmit={addPolicy} className="space-y-6">

                            {/* PDF Upload */}
                            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 mt-1">
                                <label className="text-sm font-medium text-black">
                                    Upload Policy PDF
                                </label>

                                <div className="flex items-center gap-3 mt-2">
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => uploadPdf(e.target.files[0])}
                                        className="bg-white h-9 w-60 ml-50"
                                    />

                                    <Button
                                        type="button"
                                        onClick={extractPdfData}
                                        disabled={isExtracting}
                                        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap h-9"
                                    >
                                        {isExtracting ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Extracting...
                                            </div>
                                        ) : (
                                            "Extract Details"
                                        )}
                                    </Button>
                                </div>
                            </div>


                            {/* Policy Number - Center */}
                            <div className="flex justify-center">
                                <div className="w-full max-w-sm">
                                    <label className="text-sm font-medium text-black">
                                        Policy Number
                                    </label>

                                    <Input
                                        type="text"
                                        name="policyNumber"
                                        value={policy.policyNumber}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 text-center"
                                    />
                                </div>
                            </div>


                            {/* Other Fields */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5">

                                {/* Customer ID */}
                                <div>
                                    <label className="text-sm font-medium text-black">
                                        Customer ID
                                    </label>

                                    <Input
                                        type="text"
                                        name="customerId"
                                        value={policy.customerId}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 text-center"
                                    />
                                </div>


                                {/* Email */}
                                <div>
                                    <label className="text-sm font-medium text-black">
                                        Email
                                    </label>

                                    <Input
                                        type="email"
                                        name="email"
                                        value={policy.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 text-center"
                                    />
                                </div>


                                {/* Policy Name */}
                                <div>
                                    <label className="text-sm font-medium text-black">
                                        Policy Name
                                    </label>

                                    <Input
                                        type="text"
                                        name="policyName"
                                        value={policy.policyName}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 text-center"
                                    />
                                </div>


                                {/* Premium Amount */}
                                <div>
                                    <label className="text-sm font-medium text-black">
                                        Premium Amount
                                    </label>

                                    <Input
                                        type="number"
                                        name="premiumAmount"
                                        value={policy.premiumAmount}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 text-center"
                                    />
                                </div>


                                {/* Last Payment Date */}
                                <div>
                                    <label className="text-sm font-medium text-black">
                                        Last Payment Date
                                    </label>

                                    <Input
                                        type="date"
                                        name="lastPaymentDate"
                                        value={policy.lastPaymentDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 "
                                    />
                                </div>


                                {/* Next Payment Date */}
                                <div>
                                    <label className="text-sm font-medium text-black">
                                        Next Payment Date
                                    </label>

                                    <Input
                                        type="date"
                                        name="nextPaymentDate"
                                        value={policy.nextPaymentDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-9 rounded-xl border-blue-400 focus:border-blue-500 focus-visible:ring-0 "
                                    />
                                </div>

                            </div>


                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(`/clients/policy/${id}`)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Add Policy
                                </Button>

                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddPolicy
