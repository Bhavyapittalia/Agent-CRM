// this is the schema made to store the information about uploaded sheets by agent 
// this will contains all the clients data with the total verified status and policies details

import type { Types } from "mongoose";
import mongoose, { Document, mongo } from "mongoose";

interface IRecord {
    clientName?: string
    policyNumber?: string
    policyName?: string
    premiumAmount?: string
    startDate?: Date
    endDate?: Date
    email?: string
    dob?: string
    verification?: "pending" | "verified" | "skipped"
    clientId?: Types.ObjectId
    policyId?: Types.ObjectId
}

interface monthlyImportStruture extends Document{
    agentId?: Types.ObjectId
    fileId?: Types.ObjectId
    month?: Date
    year?: Date
    status: "queued" | "processing" | "failed" | "completed"
    totalClients?: number
    verifiedClients?: number
    record?: IRecord
}

const monthlyImportSchema = new mongoose.Schema<monthlyImportStruture>({
    
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    },

    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pdfFile",
        requried: true
    },

    month: {
        type: String
    },

    year: {
        type: String
    },

    status: {
        type: String,
        enum: ["queued", "processing", "failed", "completed"],
        required: true
    },

    totalClients: {
        type: Number,
        default: 0
    },

    verifiedClients: {
        type: Number,
        default: 0
    },

    record: [{
        clientName: {
            type: String,
            default: ""
        },

        policyNumber: {
            type: String,
            default: ""
        },

        policyName: {
            type: String,
            default: ""
        }, 

        premiumAmount: {
            type: String,
            default: ""
        },

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
        },

        email: {
            type: String,
            default: ""
        },

        dob: {
            type: String
        },

        verification: {
            type: String,
            enum: ["pending", "verified", "skipped"]
        },

        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client"
        },

        policyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Policy"
        }
    }]
},{
    timestamps: true
})

export const MonthlyData = mongoose.model("monthlyData", monthlyImportSchema)
