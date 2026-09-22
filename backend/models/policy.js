import mongoose from "mongoose";

const policyDetail = new mongoose.Schema({

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
        default: "2026-04-08",
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
        default: 30, // 30 days for non-monthly | 15 days for monthly
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

export const Policy = mongoose.model("Policy", policyDetail)