import type { ChildProcess } from "node:child_process"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface workerEntry {
    process: ChildProcess
    busy: boolean
}

const jobQueue = [
    {
        name: "A",
        age: 20
    },

    {
        name: "B",
        age: 30
    },

    {
        name: "C",
        age: 20
    },

    {
        name: "D",
        age: 40
    }, 

    {
        name: "E",
        age: 10
    },
    
    {
        name: "F",
        age: 30
    }
]

const workers: workerEntry[] = []

const maxWorkers = 4

// giveJobs()

function giveJobs() {

    for (const worker of workers) {

        if (!worker.busy && jobQueue.length > 0) {

            const job = jobQueue.shift()
            worker.busy = true
            worker.send(job)

        }
    }
}


export function initWorkers() {

    for (let i = 0; i < maxWorkers; i++) {
        const workerPath = path.join(__dirname, "../backend/workers/worker.js")


        const child = fork(workerPath)                                             
        child.busy = false

        child.on("message", (msg) => {
            console.log("worker finished: ", msg)
            child.busy = false

            giveJobs()
        })
        workers.push(child)
    }

    giveJobs()
}

initWorkers()