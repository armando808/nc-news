import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import './IndividualArticle.css'
import Header from "./Header"
import CommentSection from "./CommentSection"
import Voting from "./Voting"

const ncNewsAPI = axios.create({
    baseURL: "https://nc-news-be-project-1.onrender.com/api"
})

function IndividualArticle() {
    const { article_id } = useParams()
    const [article, setArticle] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                const response = await ncNewsAPI.get(`/articles/${article_id}`)
                setArticle(response.data.article)
                setIsLoading(false)
            } catch (err) {
                setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message)
                setIsLoading(false)
            }
        }
        fetchArticle()
    }, [article_id])

    return (
        <section>
            <Header />
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <section className="article-container">
                    <h2>{article.title}</h2>
                    <p>By {article.author}</p>
                    <p>{new Date(article.created_at).toLocaleDateString()}</p>
                    <img src={article.article_img_url} alt={`Image for ${article.title}`} />
                    <p>{article.body}</p>
                    <div className="votes-container">
                        <Voting article_id={article_id} initialVotes={article.votes} />
                    </div>
                    <CommentSection articleId={article_id} />
                </section>
            )}
        </section>
    )
}

export default IndividualArticle
