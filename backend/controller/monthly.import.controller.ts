import path from 'path'
import { pdfFile } from '../models/pdf.file.js'
import { MonthlyData } from '../models/sheet.js'
import { jobStatus } from '../models/job.status.js'
import { pdfQueue } from '../queue/pdf.queue.js'
import type { Request, Response } from "express";
import { AppError } from '../utils/appError.js'
import { ALLENVS } from '../config/env.config.js'


// here TS needs to know that "req & res" are of express
export const uploadMonthlyPdf = async (req: Request, res: Response) => {

    console.log("Sheet PDF is: ", req.file)
    console.log("agentId: ", req.agent.agentId)

    if (!req.file) {
        throw new AppError(404, "Select File")
    }

    // creating the relative path to store in the DB
    const relativePath = path.relative(ALLENVS.relativePath, req.file.path).replace(/\\/g, "/")

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


export const extractMonthlyPdf = async (req: Request, res: Response) => {

    const { pdfId, importId } = req.body

    // finding the PDF using the ID provided by frontend
    const file = await pdfFile.findById(pdfId)
    console.log("founded PDF for extraction is: ", file)

    if (!file) {
        throw new AppError(400, "PDF not found")
    }

    // condition is checked in TS becuase TS says that there might be a chance that filepath not found
    if (!file.filePath) {
        throw new AppError(400, "File path not found")
    }

    const monthData = await MonthlyData.findById(importId)


    // here mongoDB findOne can return document if found else null
    if (!monthData) {
        throw new AppError(400, "monthly data not found")
    }

    // creating JOB status
    const jobCreation = await jobStatus.create({ agentId: req.agent.agentId, fileId: pdfId, status: "queued" })

    // getting the file path to give it in the Queue
    const filePath = path.join(ALLENVS.relativePath, file.filePath).replace(/\\/g, "/")

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



export const getMonthlyPdfStatus = async (req: Request, res: Response) => {

    const fileId = req.params.pdfId

    if (!fileId) {
        throw new AppError(400, "File not found")
    }

    const status = await jobStatus.findOne({ fileId: fileId })
    if (!status) {
        throw new AppError(400, "status not found")
    }

    console.log("monthly status is: ", status)

    return res.status(200).json({
        success: true,
        status: status.status
    })
}


export const getMonthlyPdfResult = async (req: Request, res: Response) => {
    const { pdfId } = req.params

    if (!pdfId) {
        throw new AppError(400, "PDF ID not found")
    }

    console.log("monthly check API is running and file ID is: ", pdfId)

    const status = await jobStatus.findOne({ fileId: pdfId })
    if (!status) {
        throw new AppError(400, "status not found")
    }

    console.log("final result is: ", status)

    if (status.status !== "completed") {
        throw new AppError(404, "pdf extraction is not completed")
    }

    return res.status(200).json({
        success: true,
        result: status.result,
        status: status.status,
        jobId: status._id
    })
}