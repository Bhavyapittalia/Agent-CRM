import { Worker } from "bullmq";
import IORedis from "ioredis";
import { jobStatus } from "../models/job.status.js";
import { parsePdfText } from "../helpers/pdf.parse.js";
import { niaPolicyData } from "../services/nia.policy.extractor.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

await connectDB();

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
});


const worker = new Worker(
    "pdf-processing",
    async (job) => {
        console.log("Processing job:", job.id);
        console.log("Job data:", job.data);
        
        try {
            
            const second = Math.floor(Math.random() * 5000) + 2000
            console.log(second)
            // getting the PDF.ID AND FILE_PATH
            const { pdfId, filePath } = job.data

            // updatting the shcema to the processing
            await jobStatus.findOneAndUpdate({ fileId: pdfId }, { status: 'processing' })

            await new Promise((res) => setTimeout(res, second))

            // extracting the text from the PDF
            const text = await parsePdfText(filePath)

            // extracting the information from the parsed text
            const policyData = niaPolicyData(text)
            console.log("extracted policy data is: ", policyData)

            // again updating the DB to the 'complete' status after extracted information
            // and also putting the "policyData" into DB
            await jobStatus.findOneAndUpdate({ fileId: pdfId }, { status: 'completed', result: policyData })

            return policyData
        }
        catch (error) {
            console.log("error occured IN WORKER")

            // updating the status DB to 'failed'
            await jobStatus.findOneAndUpdate({ fileId: pdfId }, { status: 'failed' })
        }

    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

console.log("PDF Worker started...");