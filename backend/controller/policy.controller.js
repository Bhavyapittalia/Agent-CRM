import mongoose from "mongoose";
import express from "express"
import { Policy } from "../models/policy.js";
import { Client } from "../models/client.js";


export const addPolicy = async (req, res) => {

    // here req.params.clientId -> means we are getting the clientId from the "URL PARAMETER"
    // we have created the clientId in the route "/policy/add-policy/:clientId"<---
    // so  clientId:  req.params.clientId
    //        ^                         ^
    //        |-> is created in schema  |--> and this clientId is created in route 

    const policy = await Policy.create({ ...req.body, clientId: req.params.clientId, agentId: req.agent.agentId })

    console.log("policy client and his id is: ", policy)

    return res.status(202).json({
        success: true,
        policy
    })

    return res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
    })
}

export const getPolicy = async (req, res) => {

    // console.log("getPolicy API is running....")
    console.log("client id is: ", req.params.clientId)
    // console.log("agent id is: ", req.agent.agentId)
    const policy = await Policy.find({ agentId: req.agent.agentId, clientId: req.params.clientId }).sort({nextPaymentDate: -1})

    console.log("policies are: ", policy)
    // console.log("I AM IN get policy AND REQ.. IS: ", req.params.clientId)

    if (!policy) {
        return res.status(404).json({
            success: false,
            error: "Invalid Client Id"
        })
    }

    return res.status(202).json({
        success: true,
        policy
    })

    return res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack
    })
}

export const policyMoreInfo = async (req, res) => {

    try {

        // if we populate "clientId" we can have access now to the "agentId" as well
        const policy = await Policy.findById(req.params.policyId).populate("clientId", "name agentId")

        console.log("loggedIn Agent: ", req.agent.agentId)
        console.log("Policy AgentId is: ", policy.clientId.agentId)

        if (req.agent.agentId == policy.clientId.agentId) {
            console.log("strict equality is avoided")

            console.log(`policy detail of this  ID ${req.params.policyId} is: `, policy)
            console.log("policy clientId is: ", policy.clientId)

            return res.status(202).json({
                success: true,
                policy
            })

        }

        return res.status(404).json({
            success: false,
            error: "Invalid credentials"
        })


    }
    catch (error) {

        return res.status(504).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}

export const editPolicy = async (req, res) => {

    console.log("updated policy data is: ", req.body)

    try {

        // we also need to populate the clientId as we are passing the client details as well to "access the client name" 
        // as we only want to fetch only the clientID and it's client name so we use projection .populate("", "")
        const policy = await Policy.findByIdAndUpdate(req.params.policyId, req.body, { new: true }).populate("clientId", "name")

        return res.status(202).json({
            success: true,
            policy
        })
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }

}


export const searchPolicy = async (req, res) => {

    console.log("search API is running....")
    try {
        const search = req.query.name
        const select = req.query.type
        console.log("search data is: ", search)
        console.log("selected search is: ", select)

        if (select === "due-today") {
            // finding the total policies which have "Due today" 
            const startDate = new Date()
            startDate.setHours(0, 0, 0, 0)

            const endDate = new Date()
            endDate.setHours(23, 59, 59, 999)

            const client = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: startDate, $lte: endDate } }).populate({ path: "clientId", select: "name" })

            const filteredClient = client.filter(policy => new RegExp(search, "i").test(policy.clientId.name))
            console.log("filtered clients found are: ", filteredClient)

            return res.status(202).json({
                success: true,
                filteredClient
            })
        }

        if (select === "due-this-week") {

            const todayDate = new Date()

            const sevenDaysLater = new Date()
            sevenDaysLater.setDate(todayDate.getDate() + 6)

            const client = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } }).populate({ path: "clientId", select: "name" })

            const filteredClient = client.filter(policy => new RegExp(search, "i").test(policy.clientId.name))
            console.log("filtered clients found are: ", filteredClient)

            return res.status(202).json({
                success: true,
                filteredClient
            })
        }

        const client = await Policy.find({ agentId: req.agent.agentId }).populate({ path: "clientId", select: "name" })

        const filteredClient = client.filter(policy => new RegExp(search, "i").test(policy.clientId.name))
        console.log("filtered clients found are: ", filteredClient)

        return res.status(202).json({
            success: true,
            filteredClient
        })


        
        if (client.length == 0) {
            return res.status(404).json({
                success: false,
                error: "No client found!"
            })
        }

    }
    catch (error) {
        return res.status(504).json({
            success: false,
            error: "something went wrong!"
        })
    }
}