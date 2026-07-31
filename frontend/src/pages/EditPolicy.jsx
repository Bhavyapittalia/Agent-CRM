import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@base-ui/react'
import { Button } from "@/components/ui/button";

import { toast } from 'sonner'

const EditPolicy = () => {
  const [policy, setPolicy] = useState({
    policyNumber: "",
    policyName: "",
    policyAmount: "",
    paymentMode: "",
    nextPaymentDate: "",
  })

  const { clientId, id } = useParams()
  console.log("policy id is: ", id)

  const navigate = useNavigate()

  const getPolicyData = async () => {

    const response = await api.get(`/policy/more-info/${id}`)

    setPolicy(response.data.policy)
  }

  useEffect(() => {
    getPolicyData()
  }, [])

  const updatePolicy = async (e) => {

    e.preventDefault()
    console.log("request is sent!")

    const response = await api.put(`/policy/more-info/${id}/edit`, { policyNumber: policy.policyNumber, policyName: policy.policyName, policyAmount: policy.policyAmount, paymentMode: policy.paymentMode, nextPaymentDate: policy.nextPaymentDate })

    toast.success("Policy Updated Sucessfully!")

    console.log("Updated policy:", policy)
  }

  const handleChange = (e) => {

    setPolicy((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value

    }))
  }

  return (

    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="max-w-[35%] mx-auto">
        <Card className="border-t-4 border-t-blue-600 shadow-sm ring-0 rounded-2xl">
          <CardContent className="pt-6">
            <p className="text-2xl font-semibold mb-1 text-black">
              Edit Policy
            </p>

            <div className="mt-2 h-px w-full bg-blue-100"></div>

            <form onSubmit={updatePolicy} className="space-y-5 max-h-[600px]">
              {/* Policy Number */}
              <div>
                <label className="text-sm font-medium text-slate-500 flex mt-10">
                  Policy Number
                </label>

                <Input
                  type="text"
                  name="policyNumber"
                  value={policy.policyNumber}
                  onChange={handleChange}
                  required
                  className="mt-2 h-10 w-full rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0"
                />
              </div>

              {/* Policy Name */}
              <div>
                <label className="text-sm font-medium text-slate-500 flex mt-5">
                  Policy Name
                </label>

                <Input
                  type="text"
                  name="policyName"
                  value={policy.policyName}
                  onChange={handleChange}
                  required
                  className="mt-2 h-10 w-full rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0"
                />
              </div>

              {/* Policy Amount */}
              <div>
                <label className="text-sm font-medium text-slate-500 flex mt-5">
                  Policy Amount
                </label>

                <Input
                  type="number"
                  name="policyAmount"
                  value={policy.policyAmount}
                  onChange={handleChange}
                  required
                  className="mt-2 h-10 w-full rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0"
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-sm font-medium text-slate-500 flex mt-5">
                  Payment Mode
                </label>

                <select
                  name="paymentMode"
                  value={policy.paymentMode}
                  onChange={handleChange}
                  required
                  className="mt-2 h-10 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Payment Duration</option>
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half-Yearly</option>
                </select>
              </div>

              {/* Next Payment Date */}
              <div>
                <label className="text-sm font-medium text-slate-500 flex mt-5">
                  Next Payment Date
                </label>

                <Input
                  type="date"
                  name="nextPaymentDate"
                  value={policy.nextPaymentDate}
                  onChange={handleChange}
                  required
                  className="mt-2 h-10 w-full rounded-xl border border-blue-200 focus:border-blue-500 focus-visible:ring-0"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/clients/policy/more-info/${clientId}/${id}`)}
                >
                  Cancel
                </Button>

                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/clients/policy/more-info/${clientId}/${id}`)}>
                  Update
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}

export default EditPolicy





