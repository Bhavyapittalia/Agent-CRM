import type { Request, Response } from "express";
import { Agent } from "../models/agent.js";
import { AgentRegisterSchema, AgentLoginSchema } from "../zodValidation/agent.zod.js";
import jwt from "jsonwebtoken";
import { jwtToken } from "../helpers/jwt.token.js";
import { getEnv } from "../helpers/env.js";
import { ALLENVS } from "../config/env.config.js";
import { AppError } from "../utils/appError.js";

export const registerAgent = async (req: Request, res: Response) => {
    console.log("request body is: ", req.body);

    const parsedBody = AgentRegisterSchema.parse(req.body);

    console.log("parsed body is runned: ", parsedBody);

    const agent = await Agent.create(parsedBody);

    console.log("agent is created runned");
    console.log("agents are: ", agent);

    return res.status(202).json({
        success: true,
        agent
    });
};


export const loginAgent = async (req: Request, res: Response) => {
    console.log("Login email and password are: ", req.body);

    const parsedBody = AgentLoginSchema.parse(req.body);

    console.log("email is: ", parsedBody.email);

    const agent = await Agent.findOne({
        email: parsedBody.email
    });

    if (!agent) {
        throw new AppError(401, "email is invalid")
    }

    if (agent.password != req.body.password) {
        throw new AppError(401, "Invalid Password")
    }


    const accessToken = jwtToken(
        agent._id.toString(),
        // this file is made because in TS we can't directly access the env files variable
        // because TS will count as a string | undefined 
        ALLENVS.accessSecret,
        Number(ALLENVS.accessExpiry)
    );

    const refreshToken = jwtToken(
        agent._id.toString(),
        ALLENVS.refreshSecret,
        Number(ALLENVS.refreshExpiry)
    );

    return res.status(200).json({
        succuess: true,
        accessToken,
        refreshToken
    });

}


export const refreshAccessToken = async (req: Request, res: Response) => {

    console.log("refresh API...");
    console.log("refresh", req.body);

    const { refreshToken } = req.body;

    console.log("refresh token is: ", refreshToken);

    if (!refreshToken) {
        throw new AppError(400, "Token not given")
    }

    console.log("decoding...");

    // const decoded = jwt.verify(
    //     refreshToken,
    //     process.env.JWT_REFRESH_SECRET as string
    // ) as { agentId: string };

    const decoded = jwt.verify(
        refreshToken,
        ALLENVS.refreshSecret
    )

    if (typeof decoded === "string" || typeof decoded.agentId !== "string") {
        throw new AppError(400, "Invalid Token")
    }

    console.log("decoded value is: ", decoded);

    const accessToken = jwtToken(
        decoded.agentId,
        getEnv("JWT_SECRET"),
        Number(getEnv("ACCESS_TOKEN_EXPIRY_TIME"))
    );

    return res.status(202).json({
        success: true,
        accessToken
    });

} 