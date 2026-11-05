import express from 'express'
import mongoose from 'mongoose'
import { Client } from '../models/client.js'
import type { Request, Response } from "express";
import { AppError } from '../utils/appError.js';

export const addClient = async (req: Request, res: Response) => {

    console.log("clients data entered by users are: ", req.body)
    console.log("agentId in the client creating API is: ", req.agent.agentId)

    // here req.agent means we have already passed an "agent" from loginAgent route 
    // so we can access it by "agentId: req.agent.agentId" and passing it to the agentId that we created in clientSchema
    const client = await Client.create({ ...req.body, agentId: req.agent.agentId })

    if (!client) {
        throw new AppError(400, "Unable to create client")
    }

    console.log("client detail are: ", client)  

    return res.status(201).json({
        success: true,
        client
    })
}

export const getClients = async (req: Request, res: Response) => {

    console.log("agent Id in the getClient api is: ", req.agent.agentId)

    const clients = await Client.find({ agentId: req.agent.agentId }).sort({ pinned: -1 })

    if (!clients) {
        throw new AppError(400, "not able to get clients")
    }

    console.log("this id clients are: ", clients)

    return res.status(200).json({
        success: true,
        clients
    })
}


export const updateClient = async (req: Request, res: Response) => {

    console.log("updated client data is: ", req.body)
    console.log("agentId in the updateClient API is: ", req.agent.agentId)

    const clients = await Client.findByIdAndUpdate(req.params.clientId, req.body, { new: true })

    if (!clients) {
        throw new AppError(400, "Invalid client ID")
    }

    console.log("updated client data is: ", clients)

    return res.status(202).json({
        success: true,
        clients
    })
}


export const searchClient = async (req: Request, res: Response) => {
    // console.log("search query is: ", req.query)

    const search = req.query.name

    if (typeof search !== "string") {
        throw new AppError(400, "undefined search value")
    }

    console.log("search data is: ", search)
    console.log("unknown api is running...")

    const client = await Client.find({ agentId: req.agent.agentId, name: { $regex: search, $options: "i" } }).sort({ pinned: -1 })
    console.log("client is: ", client)

    // const client = await Client.find({agentId: req.agent.agentId})
    // const filterClient = client.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

    // console.log("filterClient are: ", filterClient)
    if (client.length == 0) {
        throw new AppError(404, "no client found")
    }

    return res.status(202).json({
        success: true,
        client
    })
}


export const getClientById = async (req: Request, res: Response) => {

    const client = await Client.findOne({ _id: req.params.clientId, agentId: req.agent.agentId })

    if (!client) {
        throw new AppError(404, "Invalid Client ID yeaahh")
    }

    return res.status(202).json({
        success: true,
        clients: client
    })

}


export const pinnedClient = async (req: Request, res: Response) => {

    // we use "findOne" because we want to find with both "_id" and "agentId" for validation
    const clients = await Client.findById({ _id: req.params.clientId, agentId: req.agent.agentId })


    if (!clients) {
        throw new AppError(404, "No client Found")
    }

    if (clients.pinned) {
        clients.pinned = false

        await clients.save()

        return res.status(202).json({
            success: true,
            clients
        })

    }

    clients.pinned = true

    await clients.save()

    console.log("updated client is: ", clients)

    return res.status(202).json({
        success: true,
        clients
    })
}



export const getUpcomingPremium = async (req: Request, res: Response) => {
    console.log("upcoming premium API is running....")

    const today = new Date()


    interface UpcomingPremiumRow {
        clientId: mongoose.Types.ObjectId;
        upcomingPolicy?: {
            nextPaymentDate: Date;
            policyName: string;
            policyAmount: number;
        };
    }

    // how this aggregation pipeline getting all clients policies
    // suppose we have 2 clients and each have 2 policies
    // then if we want to do this is in JS we will do something like
    // for (const client of clients) 
    //     for (const policy of policies)
    // FOR "Mongo" WE DO in "LOOKUP".. we are storing first the current client id and then scanning all it's policies 
    // after scanning we moved towards another client all policies scanning process 
    const upcomingPremiums = await Client.aggregate<UpcomingPremiumRow>([
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

    const policyMap: Record<string, UpcomingPremiumRow["upcomingPolicy"]> = {}

    for (const row of upcomingPremiums) {
        policyMap[row.clientId.toString()] = row.upcomingPolicy
    }

    return res.status(202).json({
        success: true,
        // upcomingPremiums
        upcomingPremiums: policyMap
    })
}