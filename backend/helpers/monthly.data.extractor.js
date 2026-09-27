export const extractClientNames = (text) => {

    const clientNames = []

    const matches = text.matchAll(/:\s*(?:Individual|Organizational)\s+(.+?)(?=\s+\d{2}-[A-Za-z]{3}-\d{4})/gs)

    for (const match of matches) {
        const clientName = match[1].replace(/\s+/g, " ").trim()
        clientNames.push(clientName)
    }

    return clientNames
}

export const extractPolicyNumbers = (text) => {

    const policyNumbers = []

    const matches = text.matchAll(
        /\b(210200(?:61|36|42)\d{12})\b\s*\r?\n\s*:/g
    )

    for (const match of matches) {

        policyNumbers.push(match[1])

    }

    return policyNumbers
}

export const extractPolicyNames = (policyNumbers) => {

    const policyNames = []

    for (const policyNumber of policyNumbers) {

        if (policyNumber.startsWith("21020061")) {

            const policyType = policyNumber.substring(10, 12)

            if (policyType === "95") {
                policyNames.push("Individual")
            }
            else if (policyType === "28") {
                policyNames.push("Floater")
            }
            else {
                policyNames.push("Other")
            }

        }
        else {
            policyNames.push("Other")
        }
    }

    return policyNames
}



export const extractPremiumAmounts = (text) => {

    const premiumAmounts = []

    const matches = text.matchAll(
        /\d{2}-[A-Za-z]{3}-\d{4}\s+\d{2}-[A-Za-z]{3}-\d{4}\s+\d{2}-[A-Za-z]{3}-\d{4}\s+(-?\d[\d,]*)/g
    )

    for (const match of matches) {

        premiumAmounts.push(match[1])

    }

    return premiumAmounts
}



export const extractStartDates = (text) => {

    const startDates = []

    const matches = text.matchAll(
        /(\d{2}-[A-Za-z]{3}-\d{4})\s+(\d{2}-[A-Za-z]{3}-\d{4})\s+(\d{2}-[A-Za-z]{3}-\d{4})/g
    )

    for (const match of matches) {

        startDates.push(match[2])

    }

    return startDates
}


export const extractEndDates = (text) => {

    const endDates = []

    const matches = text.matchAll(
        /(\d{2}-[A-Za-z]{3}-\d{4})\s+(\d{2}-[A-Za-z]{3}-\d{4})\s+(\d{2}-[A-Za-z]{3}-\d{4})/g
    )

    for (const match of matches) {

        endDates.push(match[3])

    }

    return endDates
}