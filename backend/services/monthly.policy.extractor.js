import { extractClientNames, extractEndDates, extractPolicyNames, extractPolicyNumbers, extractPremiumAmounts, extractStartDates } from "../helpers/monthly.data.extractor.js";
export const monthlyPolicyData = (text) => {
    const clientNames = extractClientNames(text);
    const policyNumbers = extractPolicyNumbers(text);
    const policyNames = extractPolicyNames(policyNumbers);
    const premiumAmounts = extractPremiumAmounts(text);
    const startDates = extractStartDates(text);
    const endDates = extractEndDates(text);
    const records = [];
    // converting all the data from the extraction into proper format for each client
    for (let i = 0; i < policyNumbers.length; i++) {
        records.push({
            clientName: clientNames[i] || "",
            policyNumber: policyNumbers[i] || "",
            policyName: policyNames[i] || "",
            premiumAmount: premiumAmounts[i] || "",
            startDate: startDates[i] || "",
            endDate: endDates[i] || ""
        });
    }
    return records;
};
//# sourceMappingURL=monthly.policy.extractor.js.map