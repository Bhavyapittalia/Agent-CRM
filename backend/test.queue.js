import { Redis } from "ioredis";
import { pdfQueue } from "./queue/pdf.queue.js";


const connection = new Redis({ host: "localhost", port: 6379 });

const job = pdfQueue.add("test-queue", {
    pdfId: "12345",
    message: "Hello"
})

console.log("job added to the queue", job)

await pdfQueue.close()

// process.exit(0)