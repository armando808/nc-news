import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './ArticlesPage.css';

const ncNewsAPI = axios.create({
  baseURL: 'https://nc-news-be-project-1.onrender.com/api'
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ArticlesPage() {
  const [articlesState, setArticlesState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('newest');
  const [topics, setTopics] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const topic = query.get('topic');
    if (topic) {
      setSelectedOption(topic);
    } else {
      setSelectedOption('newest');
    }
  }, [query]);

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
        } else if (selectedOption.includes('topic_')) {
          const [_, topic, filter] = selectedOption.split('_');
          params.topic = topic;

          if (filter === 'date') {
            params.sort_by = 'created_at';
            params.order = 'desc';
          } else if (filter === 'popularity') {
            params.sort_by = 'votes';
            params.order = 'desc';
          }
        }

        const response = await ncNewsAPI.get('/articles', { params });
        setArticlesState(response.data.articles);
        setIsLoading(false);
      } catch (err) {
        setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedOption]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await ncNewsAPI.get('/topics');
        setTopics(response.data.topics);
      } catch (err) {
        setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
      }
    };
    fetchTopics();
  }, []);

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (value.startsWith('topic_')) {
      navigate(`/articles?topic=${value}`);
    } else {
      navigate(`/articles?sort_by=${value}`);
    }
  };

  const formatTitle = (title) => {
    return title
      .split(' ')
      .map((word) => {
        if (word === word.toUpperCase()) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const formatPageTitle = () => {
    if (selectedOption === 'newest') return 'Newest Articles';
    if (selectedOption === 'oldest') return 'Oldest Articles';
    if (selectedOption === 'most_popular') return 'Most Popular Articles';
    if (selectedOption === 'least_popular') return 'Least Popular Articles';
    if (selectedOption.startsWith('topic_')) {
      const [_, topic] = selectedOption.split('_');
      return `${formatTitle(topic)} Articles`;
    }
    return 'All Articles';
  };

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
        <div className="mt-6 header-row flex justify-between items-center mb-5 px-12">
          <h2 className="text-2xl font-bold">{formatPageTitle()}</h2>
          <div className="select-container relative ml-auto">
            <select
              onChange={handleOptionChange}
              value={selectedOption}
              className="block appearance-none w-full bg-white dark:bg-customGray border border-gray-400 dark:border-gray-600 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:ring-0"
            >
              <option value="newest">View All Articles</option>
              <optgroup label="View by Date">
                {topics.map((topic) => (
                  <option key={topic.slug} value={`topic_${topic.slug}_date`}>
                    {formatTitle(topic.slug)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="View by Popularity">
                {topics.map((topic) => (
                  <option key={topic.slug} value={`topic_${topic.slug}_popularity`}>
                    {formatTitle(topic.slug)}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
            <p className="loading-message">Loading... Please wait up to ~1 min for server to initialise</p>
          </div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="topics-container flex flex-col gap-5 justify-center w-full box-border px-5 mx-auto">
            {articlesState.map((article) => (
              <article
                key={article.article_id}
                className="article-card bg-white dark:bg-customGray border border-gray-400 dark:border-gray-700 rounded-lg p-5 shadow-custom-lg transition-all duration-300 hover:border-gray-500 dark:hover:border-gray-300 dark:hover:shadow-light"
              >
                <Link to={`/articles/${article.article_id}`} className="block">
                  <h3 className="text-lg font-semibold capitalize">{formatTitle(article.title)}</h3>
                  <p>Article written by {article.author} on {new Date(article.created_at).toLocaleDateString()}</p>
                  <img src={article.article_img_url} alt={`Image for ${article.title}`} className="w-full h-auto rounded mb-2" />
                  <p>Comments: {article.comment_count}</p>
                  <p>Votes: {article.votes}</p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ArticlesPage;
