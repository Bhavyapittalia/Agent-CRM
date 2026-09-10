// // this file is for running the nodeJs child process which will run as a seprate nodejs process

// import { parsePdfText } from "../helpers/pdf.parse.js"
// import { niaPolicyData } from "../services/nia.policy.extractor.js"

// // when parent create child.send("hello") they are sending something to child
// // when child recive "hello" and work on it and send the result as process.send("hello world")
// // and this communication is done through IPC 
// process.on("message", async (job) => {
//     console.log("Child recevied the Job", job)

//     try {
//         // parsing the PDF
//         const text = await parsePdfText(job.filePath)
    
//         const policyData = niaPolicyData(text)
//         console.log("policy data is: ", policyData)
    
//         process.send({
//             type: "completed",
//             jobId: job.jobId,
//             policyData: policyData
//         })
//     }
//     catch (error) {
//         process.send({
//             type: "failed",
//             jobId: job.jobId
//         })
//     }
// }) 









//        testing the code 


import { Worker } from "bullmq";
import IORedis from "ioredis";

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

        // PDF extraction will come here
    },
    {
        connection,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

console.log("PDF Worker started...");