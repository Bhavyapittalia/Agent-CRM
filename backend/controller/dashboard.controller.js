import { Client } from "../models/client.js"
import { Agent } from "../models/agent.js"
import { Policy } from "../models/policy.js"
import { Cron } from "../models/cronDetails.js"

const todayDate = new Date()

const sevenDaysLater = new Date()
sevenDaysLater.setDate(todayDate.getDate() + 6)


export const dashboardSummery = async (req, res) => {

    // finding total clients of one agent
    const totalClients = await Client.countDocuments({ agentId: req.agent.agentId })

    // finding total policies of one agent with their details
    const clients = await Client.find({ agentId: req.agent.agentId }, "_id")
    console.log("all the clients Id's  are: ", clients)

    // const totalPolicies = await Policy.countDocuments({
    //     clientId: {
    //         $in: clients
    //     }
    // })

    const totalPolicies = await Policy.countDocuments({
        agentId: req.agent.agentId
    })

    // finding the total policies which have "Due today" 
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    const dueToday = await Policy.countDocuments({ agentId: req.agent.agentId, nextPaymentDate: { $gte: startDate, $lte: endDate } })

    
    // finding total policies which have "Due This Week" 
    const dueThisWeek = await Policy.countDocuments({ agentId: req.agent.agentId, nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } })


    // finding the lastest last one day cron execution
    const lastOneDayCron = await Cron.find({ createdAt: { $gte: startDate, $lte: endDate } }, { _id: 0, createdAt: 1, policiesDetail: 1 }).sort({ createdAt: -1 })


    // filtering out the policies by comparing with the policy.agentId == req.agent.agentId
    const filteredCron = lastOneDayCron.map((cron) => {

        const filteredPolicies = cron.policiesDetail.filter((policy) => {
            return policy.agentId == req.agent.agentId
        })

        return {
            // now in policiesDetail we are storing only this req.agent.agentId policies and cron data and others agent's policy and cron data is removed   
            policiesDetail: filteredPolicies
        }
        
    })

    console.log("last cron created at: ", lastOneDayCron)

    return res.status(200).json({
        success: true,
        totalClients,
        totalPolicies,
        dueToday,
        dueThisWeek,
        filteredCron
    })
}

export const upcomingRemainder = async (req, res) => {

    console.log("Logged Agent ID:", req.agent.agentId);
    // finding the details of all the policies which have due in this week
    const todayPolicies = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } }).populate("clientId").sort({ nextPaymentDate: 1 })
    console.log("todayPolicies data are: ", todayPolicies)

    // console.log("details of all the policies which have due in this week: ", todayPolicies)

    const policyInfo = todayPolicies.map((policy) => {
        return {
            policyId: policy._id,
            clientId: policy.clientId._id,
            clientName: policy.clientId.name,
            email: policy.clientId.email,
            policyNumber: policy.policyNumber,
            policyName: policy.policyName,
            Amount: policy.policyAmount,
            nextPaymentDate: policy.nextPaymentDate
        }
    })

    return res.status(200).json({
        success: true,
        policyInfo
    })
}


export const getDashboardCardPolicies = async (req, res) => {
    const search = req.query.search

    if (search === "due-today") {
        // finding the total policies which have "Due today" 
        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)

        const endDate = new Date()
        endDate.setHours(23, 59, 59, 999)

        const todayPoliciesData = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: startDate, $lte: endDate } }).populate("clientId", "name")

        return res.status(202).json({
            success: true,
            search,
            todayPoliciesData
        })
    }

    if (search === "due-this-week") {

        const thisWeekPoliciesData = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } }).populate("clientId", "name")

        return res.status(202).json({
            success: true,
            thisWeekPoliciesData
        })
    }

    if (search === "total-policies") {

        const detailsOfAllPolicies = await Policy.find({ agentId: req.agent.agentId }).populate("clientId", "name")

        console.log("details of all policies is: ", detailsOfAllPolicies)

        return res.status(202).json({
            success: true,
            detailsOfAllPolicies
        })
    }

    return res.status(404).json({
        success: false,
        error: "wrong filtering"
    })

}
