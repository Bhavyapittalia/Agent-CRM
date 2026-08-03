import mongoose from "mongoose";

const cronSchema = new mongoose.Schema({

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