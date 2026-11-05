import { Client } from "../models/client.js"
import type { ClientStructure } from "../models/client.js"
// import { Agent } from "../models/agent.sT"
import { Policy } from "../models/policy.js"
import { Cron } from "../models/cronDetails.js"
import { jobStatus } from "../models/job.status.js"
import type { Request, Response } from "express"
import { AppError } from "../utils/appError.js"

const todayDate = new Date()

const sevenDaysLater = new Date()
sevenDaysLater.setDate(todayDate.getDate() + 6)


export const dashboardSummery = async (req: Request, res: Response) => {

    // finding total clients of one agent
    const totalClients = await Client.countDocuments({ agentId: req.agent.agentId })

    // finding total policies of one agent with their details
    const clients = await Client.find({ agentId: req.agent.agentId }, "_id")

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

        if (!cron.policiesDetail) {
            throw new AppError(400, "Not found policies detail")
        }

        const filteredPolicies = cron.policiesDetail.filter((policy) => {
            return policy.agentId?.toString() === req.agent.agentId
        })

        console.log("filtered Policies is: ", filteredPolicies)

        return {
            // now in policiesDetail we are storing only this req.agent.agentId policies and cron data and others agent's policy and cron data is removed   
            policiesDetail: filteredPolicies
        }

    })
    console.log("filtered Cron is: ", filteredCron)

    return res.status(200).json({
        success: true,
        totalClients,
        totalPolicies,
        dueToday,
        dueThisWeek,
        filteredCron
    })
}

export const upcomingRemainder = async (req: Request, res: Response) => {

    const todayDate = new Date()

    const sevenDaysLater = new Date()
    sevenDaysLater.setDate(todayDate.getDate() + 6)


    console.log("Logged Agent ID:", req.agent.agentId);
    // finding the details of all the policies which have due in this week
    const todayPolicies = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } })
        .populate<{ clientId: ClientStructure | null }>("clientId")
        .sort({ nextPaymentDate: 1 })

    // console.log("details of all the policies which have due in this week: ", todayPolicies)


    const policyInfo = todayPolicies.flatMap((policy) => {

        if (!policy.clientId) {
            return []
        }

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


export const getDashboardCardPolicies = async (req: Request, res: Response) => {
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

    throw new AppError(404, "wrong filtering")

}

export const pendingTask = async (req: Request, res: Response) => {

    // here populating is done to fetch the PDF name from the other schema to show in UI
    const pending = await jobStatus.find({ agentId: req.agent.agentId, verification: "pending" }).populate("fileId")
    console.log("pending task are: ", pending)

    return res.status(200).json({
        success: true,
        pending: pending
    })
}



export const pendingTaskResult = async (req: Request, res: Response) => {

    const { id, jobId } = req.params;

    const job = await jobStatus.findOne({ _id: jobId, agentId: req.agent.agentId });

    if (!job) {
        throw new AppError(400, "job id not found")
    }

    console.log("job found was: ", job)

    return res.status(200).json({
        success: true,
        jobId: job._id,
        pdfId: job.fileId,
        result: job.result
    });
};


export const deleteTask = async (req: Request, res: Response) => {
    const { jobId } = req.params

    const task = await jobStatus.findByIdAndDelete({ _id: jobId })
    console.log("deleted task from the jobStatus table is: ", task)

    return res.status(200).json({
        success: true
    })
}