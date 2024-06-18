import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios'

function ArticlesPage() {
    const [articlesState, setArticlesState] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedTopic, setSelectedTopic] = useState('')

    const ncNewsAPI = axios.create({
        baseURL: "https:/nc-news-be-project-1.onrender.com/api"
    })

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true)
                const response = await ncNewsAPI.get('/articles', {
                    params: { topic: selectedTopic }
                })
                setArticlesState(response.data.articles)
                setIsLoading(false)
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
            }
        }

        fetchArticles()
    }, [selectedTopic])

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await ncNewsAPI.get('/topics')
                setSelectedTopic(response.data.topics)
            } catch (err) {
                setError(err.message)
            }
        }
        fetchTopics()
    }, [])

    const handleTopicChange = (event) => {
        setSelectedTopic(event.target.value)
    }

    return (
        <section className="articles-page">
            <h2>All Articles</h2>
            <select onChange={handleTopicChange} value={selectedTopic}>
                <option value="">All Topics</option>
                {topics.map((topic) => {
                    return (
                        <option key={topic.slug} value={topic.slug}>
                            {topic.slug}
                        </option>
                    )
                })}
            </select>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <section className="article-list">
                    {articlesState.map((article) => {
                        <article key={article.article_id} className="article-card">
                            <Link to={`/articles/${article.article_id}`}>
                            <h3>{article.title}</h3>
                            <p>Article written by {article.author} on {new Date(article.created_at).toLocaleDateString()}</p>
                            <img src={article.article_img_url} />
                            <p>{article.body.slice(0, 50)}...</p>
                            <p>Comments: {article.comment_count}</p>
                            <p>Votes: {article.votes}</p>
                            </Link>
                        </article>
                    })}
                </section>
            )}
        </section>
    )

}

export default ArticlesPage