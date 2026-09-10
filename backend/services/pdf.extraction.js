// import { fork } from "child_process"
// import path from "path";
// import { fileURLToPath } from "url";
// import { jobStatus } from "../models/job.status.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const jobQueue = []

// const workers = []

// const maxWorkers = 4



// // export const startExtractionJob = async (jobId, filePath) => {
    
// //     console.log("filename is: ", __filename)
// //     console.log("dirname is: ", __dirname)
// //     console.log("jobId is: ", jobId)
// //     console.log("file path is: ", filePath)
    
// //     // as jobqueue is an array
// //     jobQueue.push({ jobId, filePath })
    
// //     console.log("queue is: ", jobQueue)
    
// //     // await jobStatus.findByIdAndUpdate(jobId, { status: "processing", startedAt: new Date() })
// //     return new Promise((resolve, reject) => {
// //         const workerPath = path.join(__dirname, "../workers/pdf.worker.js")
// //         console.log("worker path is: ", workerPath)

// //         const giveJobs = () => {

// //             for (const worker of workers) {

// //                 if (!worker.busy && jobQueue.length > 0) {

// //                     const job = jobQueue.shift()
// //                     worker.busy = true
// //                     worker.send(job)

// //                 }
// //             }
// //         }


// //         const initJobs = () => {
// //             for (let i = 0; i < maxWorkers; i++) {

// //                 const child = fork(workerPath)
// //                 child.busy = false  

// //                 child.on("message", async (msg) => {
// //                     console.log("worker finished: ", msg)
// //                     child.busy = false

// //                     if (msg.type === "completed") {
// //                         await jobStatus.findByIdAndUpdate(msg.jobId, { status: "completed", result: msg.policyData, endAt: new Date() })

// //                         console.log("child process ended", msg.policyData)
// //                         resolve(msg.policyData)
// //                     }
                    
// //                     giveJobs()
// //                 })
// //                 workers.push(child)
                
                
// //                 child.on("error", (error) => {
// //                     console.error("Child process error:", error);
// //                 });
                
// //                 child.on("exit", (code) => {
// //                     console.log("Child process exited with code:", code);
// //                 });
// //             }

// //             giveJobs()
// //         }
        
        
// //         initJobs()
// //     })

// // }


// export const startExtractionJob = async (jobId, filePath) => {
//   jobQueue.push({ jobId, filePath });
//   console.log("queue is: ", jobQueue);

//   return new Promise((resolve, reject) => {
//     const workerPath = path.join(__dirname, "../workers/pdf.worker.js");

//     const giveJobs = () => {
//       for (const worker of workers) {
//         if (!worker.busy && jobQueue.length > 0) {
//           const job = jobQueue.shift();
//           worker.busy = true;
//           worker.send(job);
//         }
//       }
//     };

//     const initJobs = () => {
//       for (let i = 0; i < maxWorkers; i++) {
//         const child = fork(workerPath);
//         child.busy = false;

//         child.on("message", async (msg) => {
//           console.log("worker finished: ", msg);
//           child.busy = false;

//           if (msg.type === "completed") {
//             await jobStatus.findByIdAndUpdate(msg.jobId, {
//               status: "completed",
//               result: msg.policyData,
//               endAt: new Date(),
//             });
//             resolve(msg.policyData);
//           }

//           if (msg.type === "failed") {
//             await jobStatus.findByIdAndUpdate(msg.jobId, {
//               status: "failed",
//               endAt: new Date(),
//             });
//             reject(new Error("Job failed"));
//           }

//           giveJobs(); // try next job
//         });

//         child.on("error", (error) => {
//           console.error("Child process error:", error);
//         });

//         child.on("exit", (code) => {
//           console.log("Child process exited with code:", code);
//         });

//         workers.push(child);
//       }

//       giveJobs();
//     };

//     initJobs();
//   });
// };





import { fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { jobStatus } from "../models/job.status.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workers = [];
const jobQueue = [];

const maxWorkers = 4;

export const initWorkers = () => {
  const workerPath = path.join(
    __dirname,
    "../workers/pdf.worker.js"
  );

  for (let i = 0; i < maxWorkers; i++) {

    const child = fork(workerPath);

    child.busy = false;

    child.on("message", async (msg) => {

      child.busy = false;

      try {

        if (msg.type === "completed") {

          await jobStatus.findByIdAndUpdate(
            msg.jobId,
            {
              status: "completed",
              result: msg.policyData,
              endAt: new Date(),
            }
          );
        }

        if (msg.type === "failed") {

          await jobStatus.findByIdAndUpdate(
            msg.jobId,
            {
              status: "failed",
              endAt: new Date(),
            }
          );
        }

      } catch (err) {
        console.log(err);
      }

      assignJobs();
    });

    child.on("error", (err) => {
      console.log(err);
      child.busy = false;
    });

    workers.push(child);
  }

  console.log(`${maxWorkers} workers started`);
};

export const addJob = (job) => {

  jobQueue.push(job);

  console.log(
    "Job added. Queue size:",
    jobQueue.length
  );

  assignJobs();
};

const assignJobs = () => {

  for (const worker of workers) {

    if (!worker.busy && jobQueue.length > 0) {

      const job = jobQueue.shift();

      worker.busy = true;

      worker.send(job);

      console.log(
        `Job ${job.jobId} assigned`
      );
    }
  }
};