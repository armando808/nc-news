import { useState, useEffect } from 'react'
import { fetchTopics } from '../utils/api'

export const useFetchTopics = () => {
    const [topics, setTopics] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    const getTopics = async () => {
        try {
        const topicsData = await fetchTopics()
        setTopics(topicsData)
        setIsLoading(false)
        } catch (err) {
        setError(err.message)
        setIsLoading(false)
        }
    }

    getTopics()
    }, [])

    return { topics, isLoading, error }
}
