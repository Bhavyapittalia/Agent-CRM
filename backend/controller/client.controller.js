import express from 'express'
import mongoose from 'mongoose'
import { Client } from '../models/client.js'

export const addClient = async (req, res) => {

    try {

        console.log("clients data entered by users are: ", req.body)
        console.log("agentId in the client creating API is: ", req.agent.agentId)

        // here req.agent means we have already passed an "agent" from loginAgent route 
        // so we can access it by "agentId: req.agent.agentId" and passing it to the agentId that we created in clientSchema

        const client = await Client.create({...req.body, agentId: req.agent.agentId})
        
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

export const getClients =  async (req, res) => {
    
    console.log("agent Id in the getClient api is: ", req.agent.agentId)
    try {
        const clients = await Client.find({ agentId: req.agent.agentId })

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
        const clients = await Client.findByIdAndUpdate(req.params.clientId, req.body, {new: true})

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

    const client = await Client.find({agentId: req.agent.agentId, name: { $regex: search, $options: "i" }})
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
        const clients = await Client.findOne({ _id: req.params.clientId ,  agentId: req.agent.agentId})

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