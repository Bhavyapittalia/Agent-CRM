import mongoose from "mongoose";

// creating this schema to store the all the PDF selected by the agent 
// we can also store that PDF path in controller as well but not a scalable approrach as any breakdown into req or sever will not work

export const pdfFileSchema = new mongoose.Schema({
    originalName: {
        type: String
    },

    fileName: {
        type: String
    },

    filePath: {
        type: String
    },

    status: {
        type: String,
        enum: ["uploaded", "processing", "completed", "failed"],
        default: "uploaded"
    }
},
    {
        timestamps: true
    }
)


export const pdfFile = mongoose.model("pdfFile", pdfFileSchema) 