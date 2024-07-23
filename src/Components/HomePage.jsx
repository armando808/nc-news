import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from './Header'
import './HomePage.css'

function HomePage() {
    const [topics, setTopics] = useState([])
    const [selectedView, setSelectedView] = useState('popular')
    const [articles, setArticles] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('https://nc-news-be-project-1.onrender.com/api/topics')
                setTopics(response.data.topics)
            } catch (err) {
                console.error(err)
                setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message)
                setIsLoading(false)
            }
        }

        fetchTopics()
    }, [])

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articlePromises = topics.map(async (topic) => {
                    const response = await axios.get(`https://nc-news-be-project-1.onrender.com/api/articles`, {
                        params: { topic: topic.slug, sort_by: selectedView === 'popular' ? 'votes' : 'created_at', order: 'desc' }
                    })
                    return { topic: topic.slug, articles: response.data.articles.slice(0, 4) }
                })
                const articlesByTopic = await Promise.all(articlePromises)
                const articlesObject = {}
                articlesByTopic.forEach(({ topic, articles }) => {
                    articlesObject[topic] = articles
                })
                setArticles(articlesObject)
                setIsLoading(false)
            } catch (err) {
                console.error(err)
                setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message)
                setIsLoading(false)
            }
        }

        if (topics.length > 0) {
            fetchArticles();
        }
    }, [topics, selectedView])

    const handleViewChange = (view) => {
        setSelectedView(view)
    }

    const capitalizeTitle = (title) => {
        return title
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase())
    }

    return (
        <section>
            <Header />
            <div className="header-row">
                <h2>Home</h2>
                <div className="toggle-view">
                    <button className={`toggle-button ${selectedView === 'popular' ? 'active' : ''}`} onClick={() => handleViewChange('popular')}>
                        {selectedView === 'popular' ? 'Showing Most Popular' : 'Show Most Popular'}
                    </button>
                    <button className={`toggle-button ${selectedView === 'newest' ? 'active' : ''}`} onClick={() => handleViewChange('newest')}>
                        {selectedView === 'newest' ? 'Showing Newest' : 'Show Newest'}
                    </button>
                </div>
            </div>
            <h3 className="topics-header">Topics</h3>
            {isLoading ? (
                <p>Loading... Please wait up to ~1 min for server to initialise</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="topics-container">
                    {topics.map((topic) => (
                        <div key={topic.slug} className="topic-card">
                            <h3>{capitalizeTitle(topic.slug)}</h3>
                            <h4>{selectedView === 'popular' ? 'Most Popular' : 'Newest'}</h4>
                            <ul>
                                {articles[topic.slug]?.map((article) => (
                                    <li key={article.article_id}>
                                        <img src={article.article_img_url} alt={`Image for ${article.title}`} className="article-img" />
                                        <Link to={`/articles/${article.article_id}`}>{capitalizeTitle(article.title)}</Link>
                                        <Link to={`/articles/${article.article_id}`} className="read-now-button">Read Now</Link>
                                    </li>
                                ))}
                            </ul>
                            <Link to={`/articles?topic=${topic.slug}`} className="view-all-link">
                                View all articles on {capitalizeTitle(topic.slug)}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default HomePage

