import { type NextFunction, type Request, type Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Client } from '../models/client.js'
import { ALLENVS } from '../config/env.config.js'
import { AppError } from '../utils/appError.js'

export const checkToken = (req: Request, res: Response, next: NextFunction) => {          

    console.log("check token is also running...")
    // this will given by the client when they are using application
    const token = req.headers.authorization
    
    if (!token) {
        throw new AppError(404, "Token is not present")
    }
    
    console.log("token is: ", typeof token)
    console.log("access secret is: ", typeof ALLENVS.accessSecret)
    
    const decoded = jwt.verify(token, ALLENVS.accessSecret)

    if (typeof decoded === "string" || typeof decoded.agentId !== "string") {
        throw new AppError(404, "invalid token")
    }

    // we are getting an "agentId" form the token where we have sign the token and send agentId with it
    // we actually store the "agentId" in the PAYLOAD of the token
    console.log("Agent ID is: ", decoded.agentId)
    console.log("decoded stored this: ", decoded)

    // so now actually we are storing the "agentId" in the "req.agent"
    // NOW WE ARE ABLE to use "req.agent.agentId" 
    // we can use everywhere where we have "checkToken" middlware is used 
    req.agent = { agentId: decoded.agentId }

    next()

}


// creating this middleware because during any operation related any  /:id in API
// it will protect to change data in the DB if the "agent is not containing that client"
// for ex: if with any /:id an agent tries to change another agent client details then this middleware will protect that 
export const checkClientOwnership = async (req: Request, res: Response, next: NextFunction) => {

    const client = await Client.findById(req.params.clientId)

    if (!client) {
        throw new AppError(404, "Client not found")
    }

    console.log("client in middlware is: ", client)
    console.log("agentId in check owner is: ", req.agent.agentId)
    console.log("client Id in the middlware is: ", client._id)

    if (client.agentId.toString() !== req.agent.agentId) {
        throw new AppError(404, "UnAuthorized")
    }

    req.clientId = client
    next()
}  
