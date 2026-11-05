import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null,
});

// creating the queue name  "pdf-prosseing"
export const pdfQueue = new Queue("pdf-processing", { connection });