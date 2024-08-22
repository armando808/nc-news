import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './IndividualArticle.css';
import Header from "./Header";
import CommentSection from "./CommentSection";
import Voting from "./Voting";
import RecentArticles from "./RecentArticles";

const ncNewsAPI = axios.create({
    baseURL: "https://nc-news-be-project-1.onrender.com/api"
});

function IndividualArticle() {
    const { article_id } = useParams();
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                const response = await ncNewsAPI.get(`/articles/${article_id}`);
                setArticle(response.data.article);
                setIsLoading(false);
            } catch (err) {
                setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [article_id]);

    const handleThemeToggle = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <section className="min-h-screen bg-white dark:bg-customDark text-gray-900 dark:text-white">
                <Header isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
                <div className="content-wrapper flex px-5">
                    <div className="article-content w-2/3 mr-6"> {/* Adjusted width */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
                                <p className="loading-message">Loading... Please wait up to ~1 min for server to initialise</p>
                            </div>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <section className="article-container bg-white dark:bg-customGray border border-gray-400 dark:border-gray-700 rounded-lg p-5 shadow-custom-lg">
                                <h2 className="text-2xl font-bold text-center mb-4">{article.title}</h2>
                                <p className="text-center mb-2">By {article.author}</p>
                                <p className="text-center mb-4">{new Date(article.created_at).toLocaleDateString()}</p>
                                <div className="img-container">
                                    <img src={article.article_img_url} alt={`Image for ${article.title}`} className="article-img" />
                                </div>
                                <p className="mb-4">{article.body}</p>
                                <div className="votes-container">
                                    <Voting article_id={article_id} initialVotes={article.votes} />
                                </div>
                                <CommentSection articleId={article_id} />
                            </section>
                        )}
                    </div>
                    <div className="sidebar w-1/3">
                        <h3 className="text-xl font-bold mb-4">Latest Articles</h3>
                        <RecentArticles />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default IndividualArticle;
