import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

import { checkStatus } from "@/utils/check.status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import { ArrowLeft, File, FileText, Pencil } from "lucide-react";
import { Input } from "@base-ui/react";
import { toast } from "sonner";
import { formatDate } from "@/utils/format.date";

const MorePolicyDetail = () => {
    const [policy, setPolicy] = useState({
        policyNumber: "",
        policyName: "",
        planType: "",
        policyStatus: "",
        policyAmount: "",
        paymentMode: "",
        premiumPaymentType: "",
        gracePeriodDays: "",
        nextPaymentDate: "",
        lastPremiumPaidDate: "",
        policyStartDate: "",
        policyMaturityDate: "",
        clientId: "",
    });


    const { clientId, id } = useParams();
    console.log("Policy Id is: ", id)
    console.log("client Id is: ", clientId)

    const navigate = useNavigate();

    const getMoreDetails = async () => {
        try {
            const response = await api.get(`/policy/more-info/${id}`);

            setPolicy({ ...response.data.policy, nextPaymentDate: formatDate(response.data.policy.nextPaymentDate), lastPremiumPaidDate: formatDate(response.data.policy.lastPremiumPaidDate), policyStartDate: formatDate(response.data.policy.policyStartDate), policyMaturityDate: formatDate(response.data.policy.policyMaturityDate) })

            console.log("before updated policy data: ", response.data.policy)

        } catch (error) {
            console.log(error.response.data);
            console.log(error.message);
        }
    };

    useEffect(() => {
        getMoreDetails();
    }, []);

    const updatePolicy = async () => {

        console.log("update policy function is running/.. ")

        try {
            const response = await api.patch(`/policy/more-info/${id}/edit`, { policyNumber: policy.policyNumber, policyName: policy.policyName, planType: policy.planType, policyStatus: policy.policyStatus,  nextPaymentDate: formatDate(policy.nextPaymentDate), lastPremiumPaidDate: formatDate(policy.lastPremiumPaidDate), policyStartDate: formatDate(policy.policyStartDate) })

            setPolicy({...response.data.policy, nextPaymentDate: formatDate(response.data.policy.nextPaymentDate), lastPremiumPaidDate: formatDate(response.data.policy.lastPremiumPaidDate), policyStartDate: formatDate(response.data.policy.policyStartDate), policyMaturityDate: formatDate(response.data.policy.policyMaturityDate) });
    
            console.log("updated policy details are: ", response.data.policy)
    
            toast.success("policy updated successfully")
        }
        catch (error) {
            console.log("error is: ", error.message)
            console.log("error is: ", error.response)
        }
    }

    const handleChange = (e) => {
        setPolicy((prev) => ({
            ...prev,
            // here e.target.name == name and e.target.value == "bhavya"
            //   "name" :    bhavya
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="min-h-screen bg-slate-100 px-6 py-8">

            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">
                       {policy.clientId.name}, {policy.policyName}
                    </h3>
                </div>

                <Card className="mt-6 border-t-4 border-t-blue-600 shadow-sm ring-0">

                    <CardHeader>
                        <CardTitle>
                            Basic Information
                        </CardTitle>

                        <div className="mt-2 h-px w-full bg-gray-300"></div>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="flex flex-col">
                                <p className="text-sm text-slate-500"> Policy Number </p>

                                <Input
                                    type="text"
                                    name="policyNumber"
                                    value={policy.policyNumber}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 h-10 max-w-[40%] ml-27 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                />
                            </div>

                            <div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Policy Name </p>

                                    <Input
                                        type="text"
                                        name="policyName"
                                        value={policy.policyName}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[60%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Plan Type </p>

                                    <select
                                        name="planType"
                                        value={policy.planType}
                                        onChange={handleChange}
                                        className="mt-1 h-10 max-w-[40%] ml-27 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    >
                                        <option value="">Select Plan </option>
                                        <option value="ULIP">ULIP</option>
                                        <option value="Endowment">Endowment</option>
                                        <option value="Term">Term</option>
                                        <option value="Pension">Pension</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Policy Status </p>

                                    <select
                                        name="policyStatus"
                                        value={policy.policyStatus}
                                        onChange={handleChange}
                                        className="mt-1 h-10 max-w-[60%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    >
                                        <option value="">Select status </option>
                                        <option value="Active">Active</option>
                                        <option value="Lapsed">Lapsed</option>
                                        <option value="Matured">Matured</option>
                                        <option value="Claimed">Claimed</option>
                                    </select>
                                </div>


                            </div>

                        </div>

                    </CardContent>

                </Card>

                <Card className="mt-6 border-t-4 border-t-blue-600 shadow-sm ring-0">

                    <CardHeader>

                        <CardTitle>
                            Payment Information
                        </CardTitle>

                        <div className="mt-2 h-px w-full bg-gray-300"></div>

                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Payment Mode </p>

                                    <select
                                        name="paymentMode"
                                        value={policy.paymentMode}
                                        onChange={handleChange}
                                        className="mt-1 h-10 max-w-[60%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    >
                                        <option value="">Select Mode </option>
                                        <option value="yearly">Yearly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quartly">Quartly</option>
                                        <option value="half-yearly">Half-yearly</option>
                                    </select>
                                </div>

                            </div>

                            <div className="">

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Policy Amount </p>

                                    <Input
                                        type="text"
                                        name="policyName"
                                        value={policy.policyAmount.toLocaleString("en-IN")}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    />
                                </div>


                            </div>
                            {/* <p className="font-semibold"> ₹ {policy.policyAmount.toLocaleString("en-IN")} </p> */}



                            <div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Payment Type </p>

                                    <select
                                        name="premiumPaymentType"
                                        value={policy.premiumPaymentType}
                                        onChange={handleChange}
                                        className="mt-1 h-10 max-w-[60%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    >
                                        <option value="">Select Mode </option>
                                        <option value="single">Single</option>
                                        <option value="regular">Regular</option>
                                    </select>
                                </div>

                            </div>

                            <div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500"> Grace Period </p>

                                    <Input
                                        type="text"
                                        name="gracePeriodDays"
                                        value={policy.gracePeriodDays}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-20 text-center rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none font-semibold"
                                    />
                                </div>

                            </div>

                        </div>

                    </CardContent>

                </Card>


                <Card className="mt-6 border-t-4 border-t-blue-600 shadow-sm ring-0">

                    <CardHeader>

                        <CardTitle>
                            Important Dates
                        </CardTitle>

                        <div className="mt-2 h-px w-full bg-gray-300"></div>

                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>

                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Next Payment Date</p>
                                    <Input
                                        type="date"
                                        name="nextPaymentDate"
                                        value={policy.nextPaymentDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-18 text-center flex justify-evenly rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                                    />
                                </div>

                            </div>

                            <div>
                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Last Paid Date</p>
                                    <Input
                                        type="date"
                                        name="lastPremiumPaidDate"
                                        value={policy.lastPremiumPaidDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-18 text-center flex justify-evenly rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                                    />
                                </div>

                            </div>

                            <div className="">


                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Policy Start Date</p>
                                    <Input
                                        type="date"
                                        name="policyStartDate"
                                        value={policy.policyStartDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-18 text-center flex justify-evenly rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-col">
                                    <p className="text-sm text-slate-500">Policy Maturity Date</p>
                                    <Input
                                        type="date"
                                        name="policyMaturityDate"
                                        value={policy.policyMaturityDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 h-10 max-w-[50%] ml-18 text-center flex justify-evenly rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0 font-semibold"
                                    />
                                </div>

                            </div>

                        </div>

                    </CardContent>

                </Card>


                <Separator className="my-8" />

                <div className="flex justify-items-start gap-150">

                    <Button
                        variant="outline"
                        // onClick={() => navigate(`/clients/policy/${clientId}`)}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={updatePolicy}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>

                </div>

            </div>

        </div>
    );
};

export default MorePolicyDetail;