import { Policy } from "../models/policy.js";
import { Cron } from "../models/cronDetails.js";
import fs from 'fs'
import path from "path";
import { pdfFile } from "../models/pdf.file.js";
import { jobStatus } from "../models/job.status.js";
// import { startExtractionJob } from "../services/pdf.extraction.js";


export const addPolicy = async (req, res) => {

    // here req.params.clientId -> means we are getting the clientId from the "URL PARAMETER"
    // we have created the clientId in the route "/policy/add-policy/:clientId"<---
    // so  clientId:  req.params.clientId
    //        ^                         ^
    //        |-> is created in schema  |--> and this clientId is created in route 
    try {
        const policy = await Policy.create({ ...req.body, clientId: req.params.clientId, agentId: req.agent.agentId })

        console.log("policy client and his id is: ", policy)

        return res.status(202).json({
            success: true,
            policy
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }


}

export const getPolicy = async (req, res) => {

    try {
        console.log("client id is: ", req.params.clientId)
        // console.log("agent id is: ", req.agent.agentId)
        const policy = await Policy.find({ agentId: req.agent.agentId, clientId: req.params.clientId }).sort({ nextPaymentDate: -1 }).populate("clientId", "name")

        console.log("policies are: ", policy)
        // console.log("I AM IN get policy AND REQ.. IS: ", req.params.clientId)

        if (!policy) {
            return res.status(404).json({
                success: false,
                error: "Invalid Client Id"
            })
        }

        return res.status(202).json({
            success: true,
            policy
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        })
    }

}

export const policyMoreInfo = async (req, res) => {

    try {

        // if we populate "clientId" we can have access now to the "agentId" as well
        const policy = await Policy.findById(req.params.policyId).populate("clientId", "name agentId")

        console.log("loggedIn Agent: ", req.agent.agentId)
        console.log("Policy AgentId is: ", policy.clientId.agentId)

        if (req.agent.agentId == policy.clientId.agentId) {
            console.log("strict equality is avoided")

            console.log(`policy detail of this  ID ${req.params.policyId} is: `, policy)
            console.log("policy clientId is: ", policy.clientId)

            return res.status(202).json({
                success: true,
                policy
            })

        }

        return res.status(404).json({
            success: false,
            error: "Invalid credentials"
        })


    }
    catch (error) {

        return res.status(504).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}

export const editPolicy = async (req, res) => {

    console.log("updated policy data is: ", req.body)

    try {

        // we also need to populate the clientId as we are passing the client details as well to "access the client name" 
        // as we only want to fetch only the clientID and it's client name so we use projection .populate("", "")
        const policy = await Policy.findByIdAndUpdate(req.params.policyId, req.body, { new: true }).populate("clientId", "name")

        return res.status(202).json({
            success: true,
            policy
        })
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }

}


export const searchPolicy = async (req, res) => {

    console.log("search API is running....")
    try {
        const search = req.query.name
        const select = req.query.type
        console.log("search data is: ", search)
        console.log("selected search is: ", select)

        if (select === "due-today") {
            // finding the total policies which have "Due today" 
            const startDate = new Date()
            startDate.setHours(0, 0, 0, 0)

            const endDate = new Date()
            endDate.setHours(23, 59, 59, 999)

            const client = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: startDate, $lte: endDate } }).populate({ path: "clientId", select: "name" })

            const filteredClient = client.filter(policy => new RegExp(search, "i").test(policy.clientId.name))
            console.log("filtered clients found are: ", filteredClient)

            return res.status(202).json({
                success: true,
                filteredClient
            })
        }

        if (select === "due-this-week") {

            const todayDate = new Date()

            const sevenDaysLater = new Date()
            sevenDaysLater.setDate(todayDate.getDate() + 6)

            const client = await Policy.find({ agentId: req.agent.agentId, nextPaymentDate: { $gte: todayDate, $lte: sevenDaysLater } }).populate({ path: "clientId", select: "name" })

            const filteredClient = client.filter(policy => new RegExp(search, "i").test(policy.clientId.name))
            console.log("filtered clients found are: ", filteredClient)

            return res.status(202).json({
                success: true,
                filteredClient
            })
        }

        const client = await Policy.find({ agentId: req.agent.agentId }).populate({ path: "clientId", select: "name" })

        const filteredClient = client.filter(policy => new RegExp(search, "i").test(policy.clientId.name))
        console.log("filtered clients found are: ", filteredClient)

        return res.status(202).json({
            success: true,
            filteredClient
        })

    }
    catch (error) {
        return res.status(504).json({
            success: false,
            error: "something went wrong!"
        })
    }
}


export const sendAlert = async (req, res) => {
    const policy = await Policy.findOne({ agentId: req.agent.agentId, _id: req.params.policyId }).populate("clientId")

    if (!policy) {
        return res.status(404).json({
            success: false,
            error: "Not Found"
        })
    }

    const time = new Date()

    const alert = await Cron.create({
        startDate: time,
        endedDate: time,
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


export const uploadPolicyPdf = async (req, res) => {

    try {

        console.log("PDF file is: ", req.file)

        if (!req.file) {
            return res.status(401).json({
                success: false,
                error: "Pdf Not found"
            })
        }

        // now will not store our complete "Drive C path"
        // instade we will just store the relative path 
        const relativePath = path.relative(String(process.env.RELATIVE_PATH), req.file.path).replace(/\\/g, "/")

        // storing the PDF information into the DB 
        const pdfDetails = await pdfFile.create({ filePath: relativePath, originalName: req.file.originalname, fileName: req.file.fieldname })
        console.log("relative path is: ", relativePath)

        return res.status(200).json({
            success: true,
            pdfId: pdfDetails._id
        })

    }
    catch (error) {
        return res.status(504).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}


export const extractPdf = async (req, res) => {

    try {
        console.log("Pdf id in backend is: ", req.body.pdfId)
    
        const pdf = await pdfFile.findById({ _id: req.body.pdfId })
        console.log("PDF found is: ", pdf) 

        // inserting the fileId in jobStatus schema
        const extractionJob = await jobStatus.create({ fileId: pdf._id })
        console.log("job id: ", extractionJob)

        // getting file path
        const filePath = path.join(String(process.env.RELATIVE_PATH), pdf.filePath).replace(/\\/g, "/")
        console.log("filePat is: ", filePath)

        // await startExtractionJob(extractionJob._id.toString(), filePath)

        console.log("getted data")
        const getPolicyData = await jobStatus.findOne({fileId: req.body.pdfId})
        console.log("getted data", getPolicyData)
        
        const finalPolicyData = getPolicyData.result
        console.log("final policy data is: ", finalPolicyData)

        return res.status(200).json({
            success: true,
            jobId: extractionJob._id,
            filePath: extractionJob.filePath,
            policyData: finalPolicyData 
        })
    }
    catch (error) {
        return res.status(504).json({
            success: false,
            error: error.messsage,
            stack: error.stack
        })
    } 
}


export const viewPdf = async (req, res) => {

    try {

        const policy = await Policy.findOne({ agentId: req.agent.agentId, _id: req.params.policyId })

        if (!policy) {
            return res.status(404).json({
                success: false,
                error: error.message
            })
        }

        console.log("finding Documents")
        const document = policy.documents.id(req.params.documentId)
        console.log("Documents founded")

        if (!document) {
            return res.status(404).json({
                success: false,
                error: error.message
            })
        }

        console.log("document Path is: ", document.filePath)

        const fullPath = path.join(String(process.env.RELATIVE_PATH), document.filePath)

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({
                success: false,
                error: "PDF not found"
            })
        }

        // telling browser that response you are going to recive is PDF
        res.setHeader("Content-Type", "application/pdf")

        res.sendFile(path.resolve(fullPath))

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        })
    }
}


// export const extractPolicyPdf = async (req, res) => {

//     try {

//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please upload a PDF"
//             });
//         }

//         const filePath = req.file.path;

//         console.log("Uploaded PDF path:", filePath);

//         const text = await extractPdfText(filePath);

//         const policyData = niaPolicyData(text);

//         console.log("Extracted policy data:", policyData);

//         return res.status(200).json({
//             success: true,
//             policyData: policyData
//         });

//     } catch (error) {

//         console.error("Error extracting policy PDF:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to extract policy data from PDF"
//         });
//     }
// };