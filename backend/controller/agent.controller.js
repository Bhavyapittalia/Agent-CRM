import express from 'express'
import { Agent } from '../models/agent.js'
import mongoose from 'mongoose'
import { AgentRegisterSchema, AgentLoginSchema } from '../zodValidation/agent.zod.js'
import { ZodError } from 'zod'
import * as z from 'zod'
import jwt from 'jsonwebtoken'
import pkg from 'jsonwebtoken';

const { TokenExpiredError } = pkg

export const registerAgent = async (req, res) => {

    try {
        console.log("request body is: ", req.body)
        const parsedBody = AgentRegisterSchema.parse(req.body)
        console.log("parsed body is runned: ", parsedBody)

        const agent = await Agent.create(parsedBody)
        console.log("agent is created runned")

        console.log("agents are: ", agent)

        return res.status(202).json({
            success: true,
            agent
        })
    }
    catch (error) {

        if (error instanceof z.ZodError) {
            return res.status(400).send({
                success: false,
                error: "error is from user side",
                stack: error.stack
            })
        }

        return res.status(500).send({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}

export const loginAgent = async (req, res) => {
    try {
        console.log("Login email and password are: ", req.body)
        const parsedBody = AgentLoginSchema.parse(req.body)

        console.log("email is: ", parsedBody.email)
        const agent = await Agent.findOne({
            email: parsedBody.email
        })

        if (!agent) {
            return res.status(401).send({
                success: false,
                error: "email is invalid!"
            })
        }

        if (agent.password != req.body.password) {
            return res.status(401).json({
                success: false,
                error: "Invalid password"
            })
        }

        const accessToken = jwt.sign(
            {
                // will be useful when we need to assign client with agentId wise
                // here we are putting the agentId in the token PAYLOAD
                agentId: agent._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1m"
            }
        )

        const refreshToken = jwt.sign(
            {
                agentId: agent._id
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "10m"
            }
        )

        return res.status(200).json({
            succuess: true,
            accessToken,
            refreshToken
            // we can access now agentId with "req.agent.agentId"
            // but not actually this is doing everything go to the middlware decoded variable 
        })

        console.log("this agent id in the token is going: ", agent._id)


    }
    catch (error) {
        return res.status(500).send({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}


export const refreshAccessToken = async (req, res) => {
    try {

        console.log("refresh API...")
        console.log("refresh", req.body)
        const { refreshToken } = req.body
        console.log("refresh token is: ", refreshToken)

        if (!refreshToken) {
            return res.status(401).json({
                success: true,
                error: "Token Not given"
            })
        }

        console.log("decoding...")
        // console.log("key is: ", process.env.JWT_REFRESH_SECRET)
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        console.log("REFRESH IS STILL VALID!!!")
        console.log("decoded in refresh token contains: ", decoded)

        const accessToken = jwt.sign(
            {
                agentId: decoded.agentId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1m"
            }
        )

        return res.status(202).json({
            success: true,
            accessToken
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
