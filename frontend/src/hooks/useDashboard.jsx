import api from '@/api/axios';
import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const useDashboard = () => {

  const [summery, setSummery] = useState({})

  const [thisWeekRemainder, setThisWeekRemainder] = useState([])

  const [alert, setAlert] = useState([])

  const getSummery = async () => {

    try {
      const response = await api.get("/dashboard/summery")

      const upcomingRemainder = await api.get("/dashboard/upcoming-remainder")

      setThisWeekRemainder(upcomingRemainder.data.policyInfo)

      setSummery(response.data)

      // as policies data is inside res.data.lastCron.policiesData
      // that wise we need to do first flatMap and then map to access the policiesData
      const alerts = response.data.filteredCron.flatMap((cron) =>
        cron.policiesDetail.map((policy) => ({
          clientName: policy.clientName, // clientname is added afterwards in cronSchema.policiesDetail 
          amount: policy.amount,
          dueDate: policy.dueDate,
          alertedOn: policy.alertedOn,
          policyName: policy.policyName
        }))
      );

      setAlert(alerts);


      console.log("LAST alert history is: ", alerts)

      console.log("summery is: ", response.data)

      console.log("Upcoming Remainder are: ", upcomingRemainder.data)

      const data = response.data

      console.log("type of data in dashboard is: ", typeof data)
    }
    catch (error) {
      console.log("error occured", error.response)
      console.log("error occured", error.message)
      console.log("error occured", error.response.data)
    }
  }


  useEffect(() => {
    getSummery()
  }, [])

  return {
    summery, thisWeekRemainder, alert
  }
}

export default useDashboard
