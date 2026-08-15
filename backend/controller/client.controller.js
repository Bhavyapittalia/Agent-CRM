import express from 'express'
import mongoose from 'mongoose'
import { Client } from '../models/client.js'

export const addClient = async (req, res) => {

    try {

        console.log("clients data entered by users are: ", req.body)
        console.log("agentId in the client creating API is: ", req.agent.agentId)

        // here req.agent means we have already passed an "agent" from loginAgent route 
        // so we can access it by "agentId: req.agent.agentId" and passing it to the agentId that we created in clientSchema

        const client = await Client.create({ ...req.body, agentId: req.agent.agentId })

        console.log("client detail are: ", client)

        return res.status(201).json({
            success: true,
            client
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}

export const getClients = async (req, res) => {

    console.log("agent Id in the getClient api is: ", req.agent.agentId)
    try {
        const clients = await Client.find({ agentId: req.agent.agentId }).sort({ pinned: -1 })

        console.log("this id clients are: ", clients)

        return res.status(200).json({
            success: true,
            clients
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}


export const updateClient = async (req, res) => {

    console.log("updated client data is: ", req.body)
    console.log("agentId in the updateClient API is: ", req.agent.agentId)

    try {
        const clients = await Client.findByIdAndUpdate(req.params.clientId, req.body, { new: true })

        if (!clients) {
            return res.status(404).json({
                success: false,
                error: "Invalid Client Id"
            })
        }

        console.log("updated client data is: ", clients)

        return res.status(202).json({
            success: true,
            clients
        })
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            error: error.message
        })
    }
}

export const searchClient = async (req, res) => {
    // console.log("search query is: ", req.query)

    const search = req.query.name
    console.log("search data is: ", search)

    console.log("unknown api is running...")

    const client = await Client.find({ agentId: req.agent.agentId, name: { $regex: search, $options: "i" } }).sort({ pinned: -1 })
    console.log("client is: ", client)

    // const client = await Client.find({agentId: req.agent.agentId})
    // const filterClient = client.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

    // console.log("filterClient are: ", filterClient)
    if (client.length == 0) {
        return res.status(404).json({
            success: false,
            error: "No client Found"
        })
    }

    return res.status(202).json({
        success: true,
        client
    })
}


export const getClientById = async (req, res) => {
    console.log("client ID is this: ", req.params.clientId)

    try {

        // we use "findOne" because we want to find with both "_id" and "agentId" for validation
        const clients = await Client.findOne({ _id: req.params.clientId, agentId: req.agent.agentId })

        if (!clients) {
            return res.status(404).json({
                success: false,
                error: "Invalid Client Id"
            })
        }

        console.log("client details are: ", clients)

        return res.status(202).json({
            success: true,
            clients
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


export const pinnedClient = async (req, res) => {

    try {
        // we use "findOne" because we want to find with both "_id" and "agentId" for validation
        const clients = await Client.findById({ _id: req.params.clientId, agentId: req.agent.agentId })

        if (!clients) {
            return res.status(404).json({
                success: false,
                error: "No client found"
            })
        }

        if (clients.pinned) {
            console.log("If condition is running...")

            clients.pinned = false

            console.log("client is set to false...", clients.pinned)
            await clients.save()
            console.log("client is SAVED to false...")

            return res.status(202).json({
                success: true,
                clients
            })

        }

        clients.pinned = true

        await clients.save()
        console.log("client is saved to TRUE")
        console.log("client pinned status is: ", clients)

        console.log("updated client is: ", clients)

        return res.status(202).json({
            success: true,
            clients
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


export const getUpcomingPremium = async (req, res) => {
    console.log("upcoming premium API is running....")
    try {

        const today = new Date()

        // how this aggregation pipeline getting all clients policies
        // suppose we have 2 clients and each have 2 policies
        // then if we want to do this is in JS we will do something like
        // for (const client of clients) 
        //     for (const policy of policies)
        // FOR "Mongo" WE DO in "LOOKUP".. we are storing first the current client id and then scanning all it's policies 
        // after scanning we moved towards another client all policies scanning process 
        const upcomingPremiums = await Client.aggregate([
            {
                $match: {
                    agentId: new mongoose.Types.ObjectId(req.agent.agentId)
                }
            },

            {
                // lookup means mongo tell that go to the another collection and find related documents
                $lookup: {
                    // now looking at the policies collection from client collection
                    from: "policies",

                    // variable "let" is created because now we are going to looup at the policies collection
                    // but there we want this client collection "client._id" for comparision 
                    // so we store that client id into clientId
                    // for ex: In js   for (const client of clients)
                    //                     const clientId = client._id  
                    //                     for (const polict of policies)
                    let: { clientId: "$_id" },

                    // now after we reach all clients policies then we don't want every policies here
                    // so for "finding the latest upcoming policy" we need one more pipeline here
                    // in this pipeline we will use match to figure out our required policies
                    pipeline: [
                        {
                            $match: {

                                // "expr" is needed because we want "policies" from "policies collection" which clientId should be equal to the "client collection" clientId
                                // as we are checking here equality of "policies.clientId = client.clientId" means here policies collection is the forign collection that wise we needed the "$expr"
                                $expr: {
                                    $and: [
                                        {
                                            // here "$clientId" is from policy document and "$$clientId" is the variable that we created
                                            $eq: ["$clientId", "$$clientId"]
                                        },

                                        // {
                                        //     $eq: ["$policyStatus", "Active"]
                                        // },
                                        {
                                            $gte: ["$nextPaymentDate", today]
                                        }
                                    ]
                                }
                            }
                        },

                        {
                            $sort: {
                                nextPaymentDate: 1
                            }
                        },

                        {
                            $limit: 1
                        },

                        {
                            // this will return the data into array even if there is only one document
                            $project: {
                                _id: 0,
                                nextPaymentDate: 1,
                                policyName: 1,
                                policyAmount: 1
                            }
                        }
                    ],

                    as: "upcomingPolicy"
                },
            },
            { 
                // so from the array of "upcomingPolicy" we want only [0]th index data
                // so by accessing the 0th index we got data into "objects" from array
                $project: {
                    _id: 0,
                    clientId: "$_id",
                    upcomingPolicy: {
                        $arrayElemAt: ["$upcomingPolicy", 0]
                    }
                }
            }
        ]) 

        const policyMap = {}

        upcomingPremiums.forEach((client) => {
            policyMap[client.clientId] = client.upcomingPolicy
        })

        return res.status(202).json({
            success: true,
            // upcomingPremiums
            upcomingPremiums: policyMap
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}