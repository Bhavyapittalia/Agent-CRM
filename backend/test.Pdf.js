import { extractPdfText } from "./helpers/pdf.parse.js";
import { niaPolicyData } from "../backend/services/nia.policy.extractor.js";

const path = "file:///C:/Users/baps/OneDrive/Documents/Policies/Individual/DOC-20251203-WA0038..pdf"

const text = await extractPdfText(path)

const policyData = niaPolicyData(text)
console.log("NIA data is: ", policyData)