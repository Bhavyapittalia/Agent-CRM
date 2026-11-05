import mongoose, { Document, Types } from "mongoose";

interface IDocument {
    fileName: string
    filePath: string
    uploadedAt: Date
}


export interface PolicyStructure extends Document {
    policyNumber: string;
    policyName: string;
    policyAmount: number;
    paymentMode?: "monthly" | "quarterly" | "half-yearly" | "yearly"
    premiumPaymentType?: string
    nextPaymentDate: Date
    lastRemainderDate?: Date
    policyStartDate: Date
    policyMaturityDate?: Date
    lastPremiumPaidDate: Date
    currentStatus?: boolean
    dueAmount?: number
    policyTerm?: number
    premiumPayingTerm?: number
    gracePeriodDays?: number
    planType?: "Endowment" | "Term" | "ULIP" | "Money Back" | "Pension" | "Whole Life" | "Pther"
    policyStatus?: "Active" | "Lapsed" | "Matured" | "Surrendered" | "Claimed" | "Paid-up"
    policyVarient?: string
    policyInssuranceType?: string
    documents: Types.DocumentArray<IDocument>

    jobId: Types.ObjectId
    clientId: Types.ObjectId
    agentId: Types.ObjectId
}

const policyDetail = new mongoose.Schema<PolicyStructure>({

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobStatus"
    },

    policyNumber: {
        type: String,
        requried: true
    },

    policyName: {
        type: String,
        requried: true
    },

    policyAmount: {
        type: Number,
        required: true
    },

    paymentMode: {
        type: String,
        enum: [
            "monthly",
            "quarterly",
            "half-yearly",
            "yearly"
        ],
        default: "yearly",
    },

    premiumPaymentType: {
        type: String,
        enum: ['regular', 'single']
    },

    nextPaymentDate: {
        type: Date,
        // default: "2026-04-08",
        required: true
    },

    lastRemainderDate: {
        type: Date
    },

    policyStartDate: {
        type: Date,
    },

    policyMaturityDate: {
        type: Date,
    },

    lastPremiumPaidDate: {
        type: Date,
        default: null,
    },

    gracePeriodDays: {
        type: Number,
        default: 30, 
    },

    currentStatus: {
        type: Boolean,
        isPaid: true,
    },

    dueAmount: {
        type: Number
    },

    planType: {
        type: String,
        enum: ['Endowment', 'Term', 'ULIP', 'Money Back', 'Pension', 'Whole Life', 'Other'],
        default: 'Other',
    },

    policyTerm: {
        type: Number, // total policy term in years
    },

    premiumPayingTerm: {
        type: Number, // years for which premium is to be paid
    },

    policyStatus: {
        type: String,
        enum: ['Active', 'Lapsed', 'Matured', 'Surrendered', 'Claimed', 'Paid-Up'],
        default: 'Active',
    },

    policyVarient: {
        type: String,
        enum: ['Basic', 'Elite', 'Uplift', 'Other'],
        default: 'Other'
    },

    policyInssuranceType: {
        type: String,
        enum: ['Fresh', 'Renewal'],
        default: 'Fresh'
    },

    documents: [
        {
            fileName: {
                type: String
            },

            filePath: {
                type: String
            },

            uploadedAt: {
                type: Date,
                default: Date.now 
            }
        },
    ],

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },

    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
    }

})

export const Policy = mongoose.model<PolicyStructure>("Policy", policyDetail)