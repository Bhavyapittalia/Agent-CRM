// import { extractPdfText } from "./helpers/pdf.parse.js";
// import { niaPolicyData } from "../backend/services/nia.policy.extractor.js";

// const path = "file:///C:/Users/baps/OneDrive/Documents/Policies/Individual/DOC-20251203-WA0038..pdf"

// const text = await extractPdfText(path)

// const policyData = niaPolicyData(text)
// console.log("NIA data is: ", policyData)


const kichen = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log("Your food is ready")
            res()
        }, 5000)
    })
}

const customer = async () => {
    console.log("Open App")
    console.log("order food")
    await kichen()
    console.log("customer Eat food")
}

const waiter = () => {
    console.log("customer: where is my food?... ")
    console.log("waiter: Your food is cooking right now sir")
}

customer()
waiter()