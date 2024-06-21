import { useState, useEffect } from "react"
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import './ArticlesPage.css'
import Header from "./Header"

const ncNewsAPI = axios.create({
    baseURL: "https:/nc-news-be-project-1.onrender.com/api"
})

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

function ArticlesPage() {
    const [articlesState, setArticlesState] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedOption, setSelectedOption] = useState('all')
    const [topics, setTopics] = useState([])
    const query = useQuery()

    useEffect(() => {
        const topic = query.get('topic')
        if (topic) {
            setSelectedOption(`topic_${topic}`)
        }
    }, [query])

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                const params = {};
            
                if (selectedOption === 'newest') {
                    params.sort_by = 'created_at';
                    params.order = 'desc';
                } else if (selectedOption === 'oldest') {
                    params.sort_by = 'created_at';
                    params.order = 'asc';
                } else if (selectedOption === 'most_popular') {
                    params.sort_by = 'votes';
                    params.order = 'desc';
                } else if (selectedOption === 'least_popular') {
                    params.sort_by = 'votes';
                    params.order = 'asc';
                } else if (selectedOption.startsWith('topic_')) {
                    params.topic = selectedOption.replace('topic_', '');
                }
            
                const response = await ncNewsAPI.get('/articles', { params });
                setArticlesState(response.data.articles);
                setIsLoading(false);
            } catch (err) {
                setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
                setIsLoading(false);
            }
        }

        fetchArticles()
    }, [selectedOption])

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await ncNewsAPI.get('/topics')
                setTopics(response.data.topics)
            } catch (err) {
                setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message)
            }
        }
        fetchTopics()
    }, [])

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value)
    }

    const formatTitle = (title) => {
        return title
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const formatPageTitle = () => {
        if (selectedOption === 'all') return 'All Articles'
        if (selectedOption.startsWith('topic_')) return `${formatTitle(selectedOption.replace('topic_', ''))} Articles`
        if (selectedOption === 'newest') return 'Newest Articles'
        if (selectedOption === 'oldest') return 'Oldest Articles'
        if (selectedOption === 'most_popular') return 'Most Popular Articles'
        if (selectedOption === 'least_popular') return 'Least Popular Articles'
    }

    return (
        <section className="articles-page">
            <Header />
            <div className="header-row">
                <h2>{formatPageTitle()}</h2>
                <div className="select-container">
                    <select onChange={handleOptionChange} value={selectedOption}>
                        <option value="all">View All Articles</option>
                        <optgroup label="View by Topic">
                            {topics.map((topic) => (
                                <option key={topic.slug} value={`topic_${topic.slug}`}>
                                    {formatTitle(topic.slug)}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="View by Date">
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </optgroup>
                        <optgroup label="View by Popularity">
                            <option value="most_popular">Most Popular</option>
                            <option value="least_popular">Least Popular</option>
                        </optgroup>
                    </select>
                </div>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <section className="article-list">
                    {articlesState.map((article) => (
                        <article key={article.article_id} className="article-card">
                            <Link to={`/articles/${article.article_id}`}>
                                <h3>{formatTitle(article.title)}</h3>
                                <p>Article written by {article.author} on {new Date(article.created_at).toLocaleDateString()}</p>
                                <img src={article.article_img_url} alt={`Image for ${article.title}`} />
                                <p>Comments: {article.comment_count}</p>
                                <p>Votes: {article.votes}</p>
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </section>
    )
}

export default ArticlesPage

