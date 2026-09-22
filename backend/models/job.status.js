import mongoose from "mongoose";

export const ExtractJobStatus = new mongoose.Schema({

    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    },

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
    },

    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pdfFile"
    },

    filePath: {
        type: String,
    },


    status: {
        type: String,
        enum: ["queued", "processing", "completed", "failed"],
        default: "queued"
    },

    verification: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },

    result: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    startedAt: {
        type: Date
    },

    endAt: {
        type: Date
    },

},
    {
        timestamps: true
    },
)

export const jobStatus = mongoose.model("jobStatus", ExtractJobStatus)