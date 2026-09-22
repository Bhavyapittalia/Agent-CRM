import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
});

// creating the queue name  "pdf-prosseing"
export const pdfQueue = new Queue("pdf-processing", { connection });