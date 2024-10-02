import { useState, useEffect } from 'react'

export const useIndexNavigation = (topics, articles) => {
    const [currentArticleIndex, setCurrentArticleIndex] = useState({})

    useEffect(() => {
    const initialIndexes = {}
    topics.forEach((topic) => {
        initialIndexes[topic.slug] = 0
    })
    setCurrentArticleIndex(initialIndexes)
    }, [topics])

    const handleNextArticle = (topicSlug) => {
    setCurrentArticleIndex((prevIndexes) => ({
        ...prevIndexes,
        [topicSlug]: (prevIndexes[topicSlug] + 1) % articles[topicSlug].length,
    }))
    }

    const handlePreviousArticle = (topicSlug) => {
    setCurrentArticleIndex((prevIndexes) => ({
        ...prevIndexes,
        [topicSlug]: (prevIndexes[topicSlug] - 1 + articles[topicSlug].length) % articles[topicSlug].length,
    }))
    }

    return { currentArticleIndex, handleNextArticle, handlePreviousArticle }
}