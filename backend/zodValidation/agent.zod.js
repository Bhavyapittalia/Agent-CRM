import express from 'express'
import * as z from 'zod'


// creating "ZOD schema" help us to validate the data coming from our client

// "ZOD schema" validation can also help us to avoid for creating a "mongooes schema"
//  if the data coming from our client side is invalid  
// because "mongoose schema will only be created "if data is valid"
export const AgentRegisterSchema = z.object({
    name: z.string().min(3, "name must be of 3 charecter"),
    email: z.string(),
    password: z.string()
})

export const AgentLoginSchema = z.object({
    email: z.string(),
    password: z.string()
})