import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError.js";
import { ZodError } from "zod";
// import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    // error which we will throw ourselves 
    if (err instanceof AppError) {

        res.status(err.statusCode).json({
            success: false,
            err: err.message
        })

        return
    }

    // zod validation failed
    if (err instanceof ZodError) {

        res.status(400).json({
            success: false,
            error: "Invalid Input"
        })

        return
    }

    // jwt error handling

    // if (err instanceof TokenExpiredError) {
    //     res.status(400).json({
    //         success: false,
    //         error: "token exipred"
    //     })
    //     return
    // }

    // if (err instanceof JsonWebTokenError) {
    //     res.status(400).json({
    //         success: false,
    //         error: "invalid token provided"
    //     })
    //     return
    // }


    res.status(500).json({
        success: false,
        error: "Internel sesrver error"
    })
}