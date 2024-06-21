import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import './TopicArticles.css'

const ncNewsAPI = axios.create({
    baseURL: "https:/nc-news-be-project-1.onrender.com/api"
})

function TopicArticles() {
    const { topic } = useParams()
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await ncNewsAPI.get('/articles', { params: { topic } })
                setArticles(response.data.articles)
                setIsLoading(false)
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
            }
        }

        fetchArticles()
    }, [topic])

    const capitalizeTitle = (title) => {
        return title
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase())
    }

    return (
        <section>
            <h2 className="topic-title">Articles on {capitalizeTitle(topic)}</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="articles-container">
                    {articles.map((article) => (
                        <div key={article.article_id} className="article-card">
                            <h3 className="article-title">{capitalizeTitle(article.title)}</h3>
                            <p>By {article.author}</p>
                            <p>{new Date(article.created_at).toLocaleDateString()}</p>
                            <img src={article.article_img_url} alt={`Image for ${article.title}`} />
                            <p>{article.body.slice(0, 100)}...</p>
                            <div className="read-now-container">
                                <Link to={`/articles/${article.article_id}`} className="read-now-button">Read Now</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default TopicArticles

