import multer, { type FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import type { Request } from "express";
import { AppError } from "../utils/appError.js";

// storing PDF into our laptop folder route using "diskStorage"
const storage = multer.diskStorage({

    // giving it our destination to store the PDF's
    destination: (req, file, cb) => {

        // creating the folder now using "mkdirSync"
        fs.mkdirSync(
            String(process.env.FILE_UPLOAD_PATH),
            {
                // it's also create the parent folder if there are not in exists        
                recursive: true
            }
        );


        // "cb" is the callback which tells multer now where to save the PDF's 
        // because till now multer knows our path for saving the PDF's
        cb(null, String(process.env.FILE_UPLOAD_PATH));
    },


    // till now our multer know where to store our all PDF's 
    // Now we are deciding File names
    filename: (req, file, cb) => {

        // used to remove white spaces and adding "_" instade of that whitespace
        const cleanName = file.originalname.replace(/\s+/g, "_");

        // now telling the "Multer" save uploaded file with this new file name
        cb(null, cleanName);
    }
});

// main work of this function is the only accept the "PDF's" not any .zip, .img etc 
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) :void => {

    if (file.mimetype !== "application/pdf") {
        return cb(new AppError(400, "only PDF are allowed"));
    }

    cb(null, true);
};

// this is the middleware will be used in the route 
export const pdfUpload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });