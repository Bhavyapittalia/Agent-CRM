interface QueueStructure  {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

export let apiQueue: QueueStructure[] = []

export const queueProcess = (error: unknown, newToken: string | null): void => {
    apiQueue.forEach((apiPromise) => {
        if (error) {
            return apiPromise.reject(error)
        } 
        else if (newToken) {
            return apiPromise.resolve(newToken)
        }
    })

    apiQueue.length = 0
}