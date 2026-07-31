import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Policy"
    },

    paidDate: {
        type: Date
    },

    amountPaid: {
        type: Number
    },

}, { timestamps: true })

export const paymentHistory = mongoose.model("paymentHistory", paymentSchema)