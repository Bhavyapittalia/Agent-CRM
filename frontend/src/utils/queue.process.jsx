export let apiQueue = []

export const queueProcess = (error, newToken) => {
    apiQueue.forEach((apiPromise) => {
        if (error) {
            return apiPromise.reject(error)
        } 
        return apiPromise.resolve(newToken)
    })

    apiQueue.length = 0
}