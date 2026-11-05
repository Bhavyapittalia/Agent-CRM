import type { Types } from "mongoose";
import type { Document } from "mongoose";
import mongoose from "mongoose";

export interface JobStatusStructure extends Document {
    agentId: Types.ObjectId
    clientId?: Types.ObjectId
    fileId?: Types.ObjectId
    filePath?: string
    status?: "queued" | "processing" | "completed" | "failed"
    verification?: "pending" | "completed"
    result?: mongoose.Schema.Types.Mixed
    startedAt?: Date
    endAt?: Date
}

export const ExtractJobStatus = new mongoose.Schema<JobStatusStructure>({

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