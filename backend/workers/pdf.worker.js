import { Worker } from "bullmq";
import IORedis from "ioredis";
import { jobStatus } from "../models/job.status.js";
import { parsePdfText } from "../helpers/pdf.parse.js";
import { niaPolicyData } from "../services/nia.policy.extractor.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { MonthlyData } from "../models/sheet.js";
import { monthlyPolicyData } from "../services/monthly.policy.extractor.js";

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

        const { type, pdfId, filePath, importId } = job.data
        try {

            if (type === "nia-policy") {
                const second = Math.floor(Math.random() * 5000) + 2000
                console.log(second)
                // getting the PDF.ID AND FILE_PATH

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

            if (type === "monthly-import") {

                console.log("monthly pdf extraction is started")

                // marking the monthlyData and the JobStatus to the "processing" as the job is under way
                await MonthlyData.findByIdAndUpdate(importId, { status: "processing" })
                await jobStatus.findOneAndUpdate(
                    { fileId: pdfId },
                    { status: "processing" }
                )

                console.log("file path is: ", filePath)
                const text = await parsePdfText(filePath)

                const monthlyRecords = monthlyPolicyData(text)

                // marking the monthlyData status to "completed" and also inserting all clients data into DB
                await MonthlyData.findByIdAndUpdate(importId, { record: monthlyRecords, status: "completed", totalClient: monthlyRecords.length })
                await jobStatus.findOneAndUpdate(
                    { fileId: pdfId },
                    {
                        status: "completed",
                        result: monthlyRecords
                    }
                )


                console.log("MONTHLY RECORDS:")
                console.log(monthlyRecords)

                return monthlyRecords
            }
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