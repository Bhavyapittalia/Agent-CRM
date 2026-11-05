import mongoose, { Document, Types } from "mongoose";

interface IPolicyDetail {
    policyId?: Types.ObjectId
    policyName?: string
    amount?: number
    dueDate?: Date
    clientName?: string
    alertedOn?: Date
    agentId?: Types.ObjectId
}

export interface CronStructure extends Document {
    startDate?: Date
    endDate?: Date
    status?: "completed" | "pending"
    policiesDetail?: Types.DocumentArray<IPolicyDetail>
}

const cronSchema = new mongoose.Schema<CronStructure>({

    startDate: {
        type: Date
    },

    endDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ['completed', 'pending']
    },

    policiesDetail: [{

        policyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Policy"
        },

        policyName: {
            type: String
        },

        amount: {
            type: Number
        },

        dueDate: {
            type: Date
        },

        clientName: {
            type: String
        },

        alertedOn: {
            type: Date
        },

        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            // required: true
        },

    }],

    // agentId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Agent",
    //     // required: true
    // },

}, { timestamps: true })

export const Cron = mongoose.model("Cron", cronSchema)