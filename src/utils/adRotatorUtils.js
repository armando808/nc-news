import { useEffect } from "react"

export const useAdRotation = (
    adsLength,
    setCurrentAdIndex,
    intervalTime = 3000
) => {
    useEffect(() => {
    const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adsLength)
    }, intervalTime)

    return () => clearInterval(interval)
    }, [adsLength, setCurrentAdIndex, intervalTime])
}
