import path from 'path'
import { pdfFile } from '../models/pdf.file.js'
import { MonthlyData } from '../models/sheet.js'
import { jobStatus } from '../models/job.status.js'
import { pdfQueue } from '../queue/pdf.queue.js'
import fs from "fs";

export const uploadMonthlyPdf = async (req, res) => {

    try {
        console.log("Sheet PDF is: ", req.file)
        console.log("agentId: ", req.agent.agentId)

        if (!req.file) {
            return res.status(404).json({
                success: false,
                error: "select File"
            })
        }

        // creating the relative path to store in the DB
        const relativePath = path.relative(String(process.env.RELATIVE_PATH), req.file.path).replace(/\\/g, "/")

        // storing the PDF into pdf file DB
        const pdfInfo = await pdfFile.create({ filePath: relativePath, originalName: req.file.originalname, fileName: req.file.filename })
        console.log("PDF file stored is: ", pdfInfo)

        const monthlyPdfData = await MonthlyData.create({ agentId: req.agent.agentId, fileId: pdfInfo._id, status: "queued" })
        console.log("monthly recored created: ", monthlyPdfData)

        return res.status(200).json({
            success: true,
            message: "PDF uploaded successfully",
            pdfId: pdfInfo._id,
            importId: monthlyPdfData._id
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

}

export const extractMonthlyPdf = async (req, res) => {

    try {
        const { pdfId, importId } = req.body
    
        // finding the PDF using the ID provided by frontend
        const file = await pdfFile.findById(pdfId)
        console.log("founded PDF for extraction is: ", file)
    
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "PDF not found",
                error: error.message
            })
        }
    
        const monthData = await MonthlyData.findById(importId)
    
        // creating JOB status
        const jobCreation = await jobStatus.create({ agentId: req.agent.agentId, fileId: pdfId, status: "queued" })
    
        // getting the file path to give it in the Queue
        const filePath = path.join(String(process.env.RELATIVE_PATH), file.filePath).replace(/\\/g, "/")
    
        // adding PDF extraction JOB into Queue
        const job = await pdfQueue.add('pdf-processing', {
            type: "monthly-import",
            pdfId: file._id,
            filePath: filePath,
            importId: monthData._id
        })
    
        return res.status(200).json({
            success: true,
            jobId: jobCreation._id,
            importId: monthData._id
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const getMonthlyPdfStatus = async (req, res) => {
    try {
        const fileId = req.params.pdfId
        
        const status = await jobStatus.findOne({fileId: fileId})
        console.log("monthly status is: ", status)
        
        return res.status(200).json({
            success: true,
            status: status.status
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const getMonthlyPdfResult = async (req, res) => {
    try {
        const {pdfId} = req.params
        console.log("monthly check API is running and file ID is: ", pdfId)
        
        const status = await jobStatus.findOne({fileId: pdfId})
        console.log("final result is: ", status)

        if (status.status !== "completed") {
            return res.status(404).json({
                success: false,
                status: status.status,
                error: "pdf extraction is not completed"
            })
        }

        return res.status(200).json({
            success: true,
            result: status.result,
            status: status.status,
            jobId: status._id
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