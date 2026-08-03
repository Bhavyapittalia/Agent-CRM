import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Client } from '../models/client.js'

export const checkToken = (req, res, next) => {
    try {

        // this will given by the client when they are using application
        const token = req.headers.authorization

        if (!token) {
            return res.status(404).json({
                success: false,
                error: "Token is not present"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // we are getting an "agentId" form the token where we have sign the token and send agentId with it
        // we actually store the "agentId" in the PAYLOAD of the token
        console.log("Agent ID is: ", decoded.agentId)

        // so now actually we are storing the "agentId" in the "req.agent"
        // NOW WE ARE ABLE to use "req.agent.agentId" 
        // we can use everywhere where we have "checkToken" middlware is used 
        req.agent = decoded

        next()

    }
    catch (error) {
        return res.status(404).json({
            success: false,
            error: "Invalid Token"
        })
    }
}


// creating this middleware because during any operation related any  /:id in API
// it will protect to change data in the DB if the "agent is not containing that client"
// for ex: if with any /:id an agent tries to change another agent client details then this middleware will protect that 
export const checkClientOwnership = async (req, res, next) => {

    try {
        const client = await Client.findById(req.params.clientId)

        console.log("client in middlware is: ", client)
        console.log("agentId in check owner is: ", req.agent.agentId)
        console.log("client Id in the middlware is: ", client._id)   
    
        if (client.agentId.toString() !== req.agent.agentId) {
            return res.status(404).json({
                success: false,
                error: "UnAuthorized"
            })
        }
    
        req.client = client
        next()
    }   
    catch (error) {
        return res.status(504).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}
