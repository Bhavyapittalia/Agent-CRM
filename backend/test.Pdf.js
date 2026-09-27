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


// I have implemented that table and it's data is coming properly but the problem is that I still don't like that UI in the table format and also when I am changing into it's to modify data it's not working properly and also make another UI like "when agent extract PDF" if and PDF contains 20 clients data then user will verify each client data sepratly and after clicking next btn it will go to verify the next client data 