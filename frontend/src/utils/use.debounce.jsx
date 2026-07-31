import { useEffect, useState } from "react"

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // Set up a timer to update our value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);

    // If the value changes again before the delay ends, 
    // this clears the old timer and starts a brand new one.
    return () => {
        clearTimeout(handler)
    }

    }, [value, delay])

    return debouncedValue
}