import { Policy } from "../models/policy.js";
import { Cron } from "../models/cronDetails.js";
import fs from 'fs'
import path from "path";
import { pdfFile } from "../models/pdf.file.js";
import { jobStatus } from "../models/job.status.js";
import { pdfQueue } from "../queue/pdf.queue.js";
import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { ALLENVS } from "../config/env.config.js";
import type { ClientStructure } from "../models/client.js";

// this is becuase we want only "name" field from the ClientStructure
// because TS will not understand from only "populate" query so we have to explicity define the type here 
type ClientName = Pick<ClientStructure, "name">;


export const addPolicy = async (req: Request, res: Response) => {

    // here req.params.clientId -> means we are getting the clientId from the "URL PARAMETER"
    // we have created the clientId in the route "/policy/add-policy/:clientId"<---
    // so  clientId:  req.params.clientId
    //        ^                         ^
    //        |-> is created in schema  |--> and this clientId is created in route 

    console.log("add policy is running... and policy data is: ", req.body)

    const pdfId = req.body.pdfId
    console.log("pdf id in backend is: ", pdfId)

    const policy = await Policy.create({ ...req.body, clientId: req.params.clientId, agentId: req.agent.agentId })

    const updatingStatus = await jobStatus.findOneAndUpdate({ fileId: pdfId }, { verification: 'completed' }, { new: true })

    return res.status(202).json({
        success: true,
        policy
    })

}

export const getPolicy = async (req: Request, res: Response) => {

    const policy = await Policy.find({ agentId: req.agent.agentId, clientId: req.params.clientId }).sort({ nextPaymentDate: -1 }).populate("clientId", "name")

    console.log("policies are: ", policy)

    if (!policy) {
        throw new AppError(404, "Invalid Client Id")
    }

    return res.status(202).json({
        success: true,
        policy
    })
}


export const policyMoreInfo = async (req: Request, res: Response) => {

    // if we populate "clientId" we can have access now to the "agentId" as well
    const policy = await Policy.findOne({ _id: req.params.policyId, agentId: req.agent.agentId })
        .populate<{ clientId: ClientName | null }>("clientId", "name agentId")

    if (!policy) {
        throw new AppError(404, "policy not found")
    }

    return res.status(202).json({
        success: true,
        policy
    })

}


export const editPolicy = async (req: Request, res: Response) => {

    console.log("updated policy data is: ", req.body)
    // we also need to populate the clientId as we are passing the client details as well to "access the client name" 
    // as we only want to fetch only the clientID and it's client name so we use projection .populate("", "")
    const policy = await Policy.findByIdAndUpdate(req.params.policyId, req.body, { new: true }).populate("clientId", "name")

    return res.status(202).json({
        success: true,
        policy
    })
}



const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const searchPolicy = async (req: Request, res: Response): Promise<void> => {
    const name = typeof req.query.name === "string" ? req.query.name : "";
    const type = req.query.type;

    let dateRange: { $gte: Date; $lte: Date } | undefined;

    if (type === "due-today") {

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        dateRange = { $gte: start, $lte: end };

    } else if (type === "due-this-week") {
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 6);
        dateRange = { $gte: today, $lte: sevenDaysLater };
    }

    const policies = await Policy
        .find({ agentId: req.agent.agentId, ...(dateRange && { nextPaymentDate: dateRange }) })
        .populate<{ clientId: ClientName | null }>({ path: "clientId", select: "name" });

    const pattern = new RegExp(escapeRegex(name), "i");

    const filteredClient = policies.filter(
        (policy) => policy.clientId !== null && pattern.test(policy.clientId.name)
    );

    res.status(202).json({ success: true, filteredClient });
};



export const sendAlert = async (req: Request, res: Response) => {
    const policy = await Policy.findOne({ agentId: req.agent.agentId, _id: req.params.policyId })
    .populate<{clientId: ClientStructure }>("clientId")

    if (!policy) {
        throw new AppError(404, "Not Found")
    }

    const time = new Date()

    const alert = await Cron.create({
        startDate: time,
        endDate: time,
        status: "completed",
        policiesDetail: [
            {
                policyId: policy._id,
                policyName: policy.policyName,
                amount: policy.policyAmount,
                clientName: policy.clientId.name,
                dueDate: policy.nextPaymentDate,
                alertedOn: time,
                agentId: policy.agentId
            }
        ]
    })

    return res.status(202).json({
        success: true,
        alert
    })
}


// delete policy API
export const deletePolicy = async (req: Request, res: Response) => {

    const { policyId } = req.params
    console.log("delete policy API got this ID: ", policyId)

    const policy = await Policy.findByIdAndDelete({ _id: policyId })
    console.log("delted policy is: ", policy)

    return res.status(200).json({
        success: true
    })

}



// export const uploadPolicyPdf = async (req, res) => {

//     try {

//         console.log("PDF file is: ", req.file)

//         if (!req.file) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Pdf Not found"
//             })
//         }

//         const policy = await Policy.findOne({ agentId: req.agent.agentId, _id: req.params.policyId })

//         if (!policy) {

//             // deleting uploaded file if policy is not found
//             // it means suppose someone call like this : /upload/random123/policy.pdf
//             // then "random123" is not found and "policy.pdf" is deleted 
//             if (req.file.path) {
//                 fs.unlinkSync(req.file.path)
//             }

//             return res.status(404).json({
//                 success: false,
//                 error: "Policy not found"
//             })
//         }

//         // now will not store our complete "Drive C path"
//         // instade we will just store the relative path 
//         const relativePath = path.relative(String(process.env.RELATIVE_PATH), req.file.path).replace(/\\/g, "/")
//         console.log("relative path is: ", relativePath)

//         // adding pdf information into DB
//         policy.documents.push({
//             fileName: req.file.originalname,
//             filePath: relativePath
//         })

//         await policy.save()

//         return res.status(202).json({
//             success: true,
//             message: "Pdf uploaded successfully",
//             document: policy.documents[policy.documents.length - 1]
//         })
//     }
//     catch (error) {
//         return res.status(504).json({
//             success: false,
//             error: error.message,
//             stack: error.stack
//         })
//     }
// }


export const uploadPolicyPdf = async (req: Request, res: Response) => {

    console.log("PDF file is: ", req.file)

    if (!req.file) {
        throw new AppError(401, "PDF not found")
    }

    // now will not store our complete "Drive C path"
    // instade we will just store the relative path 
    const relativePath = path.relative(ALLENVS.relativePath, req.file.path).replace(/\\/g, "/")

    // storing the PDF information into the DB 
    const pdfDetails = await pdfFile.create({ filePath: relativePath, originalName: req.file.originalname, fileName: req.file.fieldname })
    console.log("relative path is: ", relativePath)

    return res.status(200).json({
        success: true,
        pdfId: pdfDetails._id
    })

}


export const extractPdf = async (req: Request, res: Response) => {

    const { pdfId, clientId } = req.body
    console.log("Pdf id in backend is: ", req.body.pdfId)

    const pdf = await pdfFile.findById({ _id: req.body.pdfId })
    console.log("PDF found is: ", pdf)

    if (!pdf) {
        throw new AppError(404, "PDF not found")
    }

    // creating and inserting the fileId in jobStatus schema
    const jobCreation = await jobStatus.create({ agentId: req.agent.agentId, clientId: clientId, fileId: pdf._id, status: "queued" })

    if (typeof pdf.filePath !== "string") {
        throw new AppError(404, "filepath is not found")
    }

    // getting file path
    const filePath = path.join(ALLENVS.relativePath, pdf.filePath).replace(/\\/g, "/")
    console.log("filePat is: ", filePath)

    // adding PDF extraction JOB into Queue
    const job = await pdfQueue.add('pdf-processing', {
        type: "nia-policy",
        pdfId: pdf._id,
        filePath: filePath
    })

    // const currentStatus = await jobStatus.findOne({fileId: fileId})
    // console.log("job status is: ", currentStatus)
    return res.status(200).json({
        success: true,
        jobId: jobCreation._id
    })

}


export const getPdfStatus = async (req: Request, res: Response) => {
    console.log("check status API is running.........")

    const fileId = req.params.pdfId
    console.log("check status API is running... and file id is: ", fileId)

    const status = await jobStatus.findOne({ fileId: fileId })
    if (!status) {
        throw new AppError(404, "status not found")
    }

    return res.status(200).json({
        success: true,
        status: status.status
    })
}

export const getPdfResult = async (req: Request, res: Response) => {

    const { pdfId } = req.params

    const status = await jobStatus.findOne({ fileId: pdfId })
    if (!status) {
        throw new AppError(404, "status not found")
    }

    if (status.status != "completed") {
        throw new AppError(404, "Pdf extraction is not completed yet")
    }

    return res.status(202).json({
        success: true,
        status: status.status,
        result: status.result,
        jobId: status._id
    })
}


export const viewPdf = async (req: Request<{agentId: string, documentId: string, policyId: string}>, res: Response) => {

    const policy = await Policy.findOne({ agentId: req.agent.agentId, _id: req.params.policyId })

    if (!policy) {
        throw new AppError(404, "policy not found")
    }

    console.log("finding Documents")
    const document = policy.documents.id(req.params.documentId)
    console.log("Documents founded")

    if (!document) {
        throw new AppError(404, "document not found")
    }

    console.log("document Path is: ", document.filePath)

    const fullPath = path.join(ALLENVS.relativePath, document.filePath)

    if (!fs.existsSync(fullPath)) {
        throw new AppError(404, "PDF not found")
    }

    // telling browser that response you are going to recive is PDF
    res.setHeader("Content-Type", "application/pdf")

    res.sendFile(path.resolve(fullPath))

}
