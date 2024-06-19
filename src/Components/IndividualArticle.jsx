import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './IndividualArticle.css'
import Header from "./Header";

const ncNewsAPI = axios.create({
    baseURL: "https:/nc-news-be-project-1.onrender.com/api"
})

function IndividualArticle() {
    const { article_id } = useParams()
    const [article, setArticle] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true)
                const response = await ncNewsAPI.get(`/articles/${article_id}`)
                setArticle(response.data.article)
                setIsLoading(false)
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
            }
        }
        fetchArticle()
    }, [article_id])

    return (
        <div>
            <Header />
            {isLoading ? (
            <p>Loading...</p>
            ) : error ? (
            <p>Error: {error}</p>
            ) : (
            <div className="article-container">
                <h2>{article.title}</h2>
                <p>By {article.author}</p>
                <p>{new Date(article.created_at).toLocaleDateString()}</p>
                <img src={article.article_img_url} alt={`Image for ${article.title}`} />
                <p>{article.body}</p>
                <p>Comments: {article.comment_count}</p>
                <p>Votes: {article.votes}</p>
            </div>
            )}
        </div>
        );
    }

    export default IndividualArticle