import { useState, useEffect } from "react"
import { fetchArticles } from '../utils/api'

export const useFetchArticles = (selectedView, topics) => {
    const [articles, setArticles] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getArticles = async () => {
            try {
                const articlesByTopic = {}

                const articlePromises = topics.map(async (topic) => {
                    let params = { topic: topic.slug }

                    if (selectedView === "newest") {
                        params.sort_by = "created_at"
                        params.order = "desc"
                    } else if (selectedView === "popular") {
                        params.sort_by = "votes"
                        params.order = "desc"
                    } else if (selectedView.startsWith("topic_")) {
                        const [_, topicSlug, filter] = selectedView.split("_")
                        params.topic = topicSlug
                        params.sort_by = filter === "popularity" ? "votes" : "created_at"
                        params.order = "desc"
                    }

                    const articles = await fetchArticles(params)
                    return { topic: topic.slug, articles }
                })

                const resolvedArticles = await Promise.all(articlePromises)
                resolvedArticles.forEach(({ topic, articles }) => {
                    articlesByTopic[topic] = articles || []
                })

                setArticles(articlesByTopic)
                setIsLoading(false)
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
            }
        }

        if (topics && topics.length > 0) {
            getArticles()
        }
    }, [topics, selectedView])

    return { articles, isLoading, error }
}
