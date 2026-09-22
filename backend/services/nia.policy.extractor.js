import { extractCustomerId, extractEmail, extractEndDate, extractPolicyName, extractPolicyNumber, extractPremiumAmount, extractStartDate } from "../helpers/nia.policy.data.extractor.js";

// console.log("text of this pdf are: ", text)

export const niaPolicyData = (text) => {

    try {
        console.log("extraction started")
        const policyData = {
            policyNumber: extractPolicyNumber(text),
            policyName: extractPolicyName(text),
            // policyPlan: extractPolicyPlan(text),
            premiumAmount: extractPremiumAmount(text),
            email: extractEmail(text),
            customerId: extractCustomerId(text),
            startDate: extractStartDate(text),
            nextPaymentDate: extractEndDate(text) 
        };
        
        console.log("log is working")
        console.log(policyData);    
        return policyData
        
    }
    catch (error) {
        console.log("extraction failed")
        return new Error("Invalid PDF")
    }

}

