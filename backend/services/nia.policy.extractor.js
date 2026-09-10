import { extractCustomerId, extractEmail, extractEndDate, extractPolicyName, extractPolicyNumber, extractPremiumAmount, extractStartDate } from "../helpers/nia.policy.data.extractor.js";

// console.log("text of this pdf are: ", text)

export const niaPolicyData = (text) => {

    const policyData = {
        policyNumber: extractPolicyNumber(text),
        policyName: extractPolicyName(text),
        // policyPlan: extractPolicyPlan(text),
        premiumAmount: extractPremiumAmount(text),
        email: extractEmail(text),
        customerId: extractCustomerId(text),
        startDate: extractStartDate(text),
        endData: extractEndDate(text) 
    };

    console.log(policyData);    
    return policyData
}

