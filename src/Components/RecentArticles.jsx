import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RecentArticles.css';

const ncNewsAPI = axios.create({
  baseURL: 'https://nc-news-be-project-1.onrender.com/api'
});

function RecentArticles() {
  const [articlesByTopic, setArticlesByTopic] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticlesByTopic = async () => {
      try {
        const response = await ncNewsAPI.get('/articles');
        const articles = response.data.articles;

        const groupedArticles = articles.reduce((acc, article) => {
          if (!acc[article.topic]) {
            acc[article.topic] = [];
          }
          if (acc[article.topic].length < 3) {
            acc[article.topic].push(article);
          }
          return acc;
        }, {});

        setArticlesByTopic(Object.entries(groupedArticles));
      } catch (err) {
        setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
      }
    };

    fetchArticlesByTopic();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="recent-articles">
      {articlesByTopic.map(([topic, articles]) => (
        <div key={topic} className="recent-article-card bg-white dark:bg-customGray border border-gray-400 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-lg">
          <h3 className="text-lg font-bold capitalize mb-3">{topic}</h3>
          {articles.map((article) => (
            <Link key={article.article_id} to={`/articles/${article.article_id}`} className="block mb-2">
              <h4 className="text-md font-semibold capitalize">{article.title}</h4>
              <p className="text-sm">By {article.author} on {new Date(article.created_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default RecentArticles;
