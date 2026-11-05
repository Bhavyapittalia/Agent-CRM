// this file just tell us that "HOW SHOULD MULTER WILL RECEIVE AND WILL SAVE THE PDF'S"

// multer is the middleware which will used to take the "Files" and make it readable to the backend by converting the multipart/form-data
import multer, { type FileFilterCallback } from 'multer'

// "path" is used to build safe filesystem paths 
// for example: if path is: /documents/policy then we want to add /policyId at there path.join will hel us
import path from 'path'

// "fs" module provide to intereact with our files and folder in the laptop
// with "fs" we can create folder, read file, write file etc.. 
import fs from 'fs'
import { AppError } from '../utils/appError.js'
import type { Request } from 'express'
import { ALLENVS } from '../config/env.config.js'

// const uploadPath = String(process.env.FILE_UPLOAD_PATH)

// storing PDF into our laptop folder route using "diskStorage"
const storage = multer.diskStorage({

    // giving it our destination to store the PDF's 
    destination: (req, file, cb) => {

        if (typeof req.params.policyId !== "string") {
            throw new AppError(400, "policyId must be a string")
        }

        const policyFolder = path.join(
            // joining "policyId" with the our main folder path to store the pdf's there
            String(process.env.FILE_UPLOAD_PATH),
            req.params.policyId
        )
        console.log("file path now is: ", String(process.env.FILE_UPLOAD_PATH))

        console.log("policy Folder is: ", policyFolder)

        fs.mkdirSync(

            // creating the folder now using "mkdirSync"
            policyFolder,
            {
                // it's also create the parent folder if there are not in exists
                recursive: true
            }
        )

        // "cb" is the callback which tells multer now where to save the PDF's 
        // because till now multer knows our path for saving the PDF's
        cb(null, policyFolder)
    },

    // till now our multer know where to store our all PDF's 
    // Now we are deciding File names
    filename: (req, file, cb) => {
        // used to remove white spaces and adding "_" instade of that whitespace
        const cleanPdfName = file.originalname.replace(/\s+/g, "_")

        // now telling the "Multer" save uploaded file with this new file name
        cb(null, cleanPdfName)
        
    }
    // after this we have now "destination" and "filename" for the PDF's to store 
    // suppose destination is: c://documents/policy/61235abc
    // and     fileName is: lic_policy_123.pdf
    // then final file will be: c://docs/policy/6123abc/Lic_policy...
})

// main work of this function is the only accept the "PDF's" not any .zip, .img etc 
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

    console.log("pdf is: ", file)

    console.log("file path is: ", ALLENVS.fileUploadPath)
    if (file.mimetype !== "application/pdf") {
        return cb(new AppError(400, "Only PDF are required"))
    }

    cb(null, true)
}

// this is the middleware will be used in the route 
export const uploadPdf = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
