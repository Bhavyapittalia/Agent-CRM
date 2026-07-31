import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true
    },

    whatsappNumber: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{9,14}$/, 'Enter a valid number with country code'],
    },

    profilePhoto: {
        type: String,
        default: null,
    },

    agentCode: {
        type: String,
        unique: true,
        trim: true, // Unique LIC-assigned agent code
    },

    branch: {
        type: String,
        trim: true, // LIC branch name/code
    },

    role: {
        type: String,
        enum: ['agent', 'admin'],
        default: 'agent',
    },


    clients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
        },
    ],
})

export const Agent = mongoose.model("Agent", agentSchema)