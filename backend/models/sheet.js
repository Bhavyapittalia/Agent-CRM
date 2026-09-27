// this is the schema made to store the information about uploaded sheets by agent 
// this will contains all the clients data with the total verified status and policies details

import mongoose, { mongo } from "mongoose";

const monthlyImportSchema = new mongoose.Schema({
    
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
