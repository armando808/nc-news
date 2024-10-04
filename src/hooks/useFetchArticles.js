import { useState, useEffect } from 'react'
import { fetchArticles } from '../utils/api'

export const useFetchArticles = (selectedView, selectedTopic) => {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    const getArticles = async () => {
        try {
        setIsLoading(true)
        let params = {}

        if (selectedTopic && selectedTopic !== 'all') {
            params.topic = selectedTopic
        }

        if (selectedView === 'newest') {
            params.sort_by = 'created_at'
            params.order = 'desc'
        } else if (selectedView === 'popular') {
            params.sort_by = 'votes'
            params.order = 'desc'
        }

        const articles = await fetchArticles(params)
        setArticles(articles)
        setIsLoading(false)
        } catch (err) {
        setError(err.message)
        setIsLoading(false)
        }
    }

    getArticles()
    }, [selectedView, selectedTopic])

    return { articles, isLoading, error }
}
