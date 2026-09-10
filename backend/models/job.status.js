import mongoose from "mongoose";

export const ExtractJobStatus = new mongoose.Schema({

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