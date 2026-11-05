import { useEffect, useState } from "react"

// debouncing help us to avoid multiple API calls on each KeyStroke
// debouncing re-set the timer again if the user type somwthing between that MS
// for ex: if user type "p, po, poli"  then after each character typed by user our debounce will re-set the timer and will run after some MS
// for ex: after writing "p" if we don't write something between that MS then API will be called
// if we write "o" after "p" within that MS then timer will be re-set again to 500ms
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