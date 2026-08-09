import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true,
    },

    profilePhoto: {
        type: String,
        default: null,
    },

    whatsappNumber: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{9,14}$/, 'Enter a valid number with country code'],
    },

    pinned: {
        type: Boolean,
        default: false
    },

    alternateNumber: {
        type: String,
        trim: true,
    },


    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },

    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
    },

    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    },

})

export const Client = mongoose.model("Client", clientSchema)