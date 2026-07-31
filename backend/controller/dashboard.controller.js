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

    // finding total policies of one agent
    const clients = await Client.find({ agentId: req.agent.agentId }, "_id")
    console.log("all the clients Id's  are: ", clients)

    // const clientIds = clients.map( (client) => client._id)
    // console.log(clientIds)

    const totalPolicies = await Policy.countDocuments({
        clientId: {
            $in: clients
        }
    })

    // finding the total policies which have "Due today" 
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    console.log("start TIME is: ", startDate)

    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)

    console.log("end TIME is: ", endDate)

    const dueToday = await Policy.countDocuments({ nextPaymentDate: { $gte: startDate, $lte: endDate } })
    console.log("How many policies are there whose dues are today? : ", dueToday)


    // finding total policies which have "Due This Week" 

    const dueThisWeek = await Policy.countDocuments({ nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } })
    console.log("total policies due this week are: ", dueThisWeek)

    // finding the lastest cron execution
    const lastCron = await Cron.find({ createdAt: { $gte: startDate, $lte: endDate } }, {_id: 0, createdAt: 1, policiesDetail: 1}).sort({ createdAt: -1 })
    console.log("last cron created at: ", lastCron)


    return res.status(200).json({
        success: true,
        totalClients,
        totalPolicies,
        dueToday,
        dueThisWeek,
        lastCron
    })
}

export const upcomingRemainder = async (req, res) => {
    // finding the details of all the policies which have due today
    const todayPolicies = await Policy.find({ nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } }).populate("clientId").sort({ nextPaymentDate: 1 })

    // console.log("details of all the policies which have due in this week: ", todayPolicies)

    const policyInfo = todayPolicies.map((policy) => {
        return {
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
