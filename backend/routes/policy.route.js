import express from 'express'
import { checkClientOwnership, checkToken } from '../middleware/agent.auth.js'
import { addPolicy, editPolicy,  extractPdf,  getPolicy, policyMoreInfo, searchPolicy, sendAlert, uploadPolicyPdf, viewPdf } from '../controller/policy.controller.js' 

import { uploadPdf } from '../middleware/upload.js'
import { pdfUpload } from '../middleware/pdf.upload.js'

const policy_router = express.Router()

policy_router.post('/add-policy/:clientId', checkToken, checkClientOwnership, addPolicy)

policy_router.get('/:clientId', checkToken, checkClientOwnership, getPolicy)

policy_router.get("/more-info/:policyId", checkToken, policyMoreInfo)

policy_router.patch("/more-info/:policyId/edit", checkToken, editPolicy)

policy_router.get("/filter/client", checkToken, searchPolicy)

policy_router.get("/send-alert/:policyId", checkToken, sendAlert)


// pdf data
// policy_router.post('/upload-pdf/:policyId', checkToken, uploadPdf.single("pdf"), uploadPolicyPdf)
// policy_router.get('/view-pdf/:policyId/:documentId', checkToken, viewPdf)

// this API is for getting the PDF and the storing the PDF into local disk and using controller storing info in DB and passing PDF.id 
policy_router.post('/upload-policy', checkToken, pdfUpload.single("policyPdf"), uploadPolicyPdf)

policy_router.post('/extract-policy', checkToken, extractPdf)

export default policy_router