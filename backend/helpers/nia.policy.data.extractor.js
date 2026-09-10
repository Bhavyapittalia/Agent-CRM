export const extractPolicyNumber = (text) => {
    const match = text.match(/Policy No[^\d]*(\d+)/);
    return match[1]
}

export const extractPolicyName = (text) => {
    const match = text.match(/New India.*?Policy/i);
    return match[0] 
};

// export const extractPolicyPlan = (text) => {
//     const match = text.match(/POLICY PLAN\s+([A-Z]+)/);
//     return  match[1] 
// }

export const extractPremiumAmount = (text) => {

    const amount = text.match(/has paid [`₹]?\s*(\d{4,})/i);

    if (amount) {
        return amount[1];
    }
}

export const extractEmail = (text) => {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    return match[0] 
}

export const extractCustomerId = (text) => {
    const match = text.match(/Customer ID\s+([A-Z0-9]+)/);
    return match[1]
}

export const extractStartDate = (text) => {
    const match = text.match(/Policy\s+Period\s+From\s*:\s*(\d{2}\/\d{2}\/\d{4})/);

    return match[1] 
}

export const extractEndDate = (text) => {
    const match = text.match(/Policy\s+Period\s+From\s*:\s*\d{2}\/\d{2}\/\d{4}[\s\S]*?\n?\s*To\s*:\s*(\d{2}\/\d{2}\/\d{4})/);

    return  match[1] 
}