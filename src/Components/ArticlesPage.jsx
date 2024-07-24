import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const [selectedOption, setSelectedOption] = useState('all');
  const [topics, setTopics] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const query = useQuery();

  useEffect(() => {
    const topic = query.get('topic');
    if (topic) {
      setSelectedOption(`topic_${topic}`);
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
    setSelectedOption(event.target.value);
  };

  const formatTitle = (title) => {
    return title
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPageTitle = () => {
    if (selectedOption === 'all') return 'All Articles';
    if (selectedOption.startsWith('topic_')) return `${formatTitle(selectedOption.replace('topic_', ''))} Articles`;
    if (selectedOption === 'newest') return 'Newest Articles';
    if (selectedOption === 'oldest') return 'Oldest Articles';
    if (selectedOption === 'most_popular') return 'Most Popular Articles';
    if (selectedOption === 'least_popular') return 'Least Popular Articles';
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
        <div className="mt-6 header-row flex justify-between items-center mb-5 px-5">
          <h2 className="text-2xl font-bold">All Articles</h2>
          <div className="select-container relative">
            <select
              onChange={handleOptionChange}
              value={selectedOption}
              className="block appearance-none w-full bg-white dark:bg-customGray border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:ring-2 focus:ring-customRed focus:border-customRed"
            >
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className="topics-header text-xl font-bold text-center mt-5">{formatPageTitle()}</h3>
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
