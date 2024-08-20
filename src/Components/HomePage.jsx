// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Header from './Header';
// import './HomePage.css';

// function HomePage() {
//   const [topics, setTopics] = useState([]);
//   const [selectedView, setSelectedView] = useState('popular');
//   const [articles, setArticles] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const response = await axios.get('https://nc-news-be-project-1.onrender.com/api/topics');
//         setTopics(response.data.topics);
//       } catch (err) {
//         console.error(err);
//         setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
//         setIsLoading(false);
//       }
//     };

//     fetchTopics();
//   }, []);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const articlePromises = topics.map(async (topic) => {
//           const response = await axios.get(`https://nc-news-be-project-1.onrender.com/api/articles`, {
//             params: { topic: topic.slug, sort_by: selectedView === 'popular' ? 'votes' : 'created_at', order: 'desc' }
//           });
//           return { topic: topic.slug, articles: response.data.articles.slice(0, 4) };
//         });
//         const articlesByTopic = await Promise.all(articlePromises);
//         const articlesObject = {};
//         articlesByTopic.forEach(({ topic, articles }) => {
//           articlesObject[topic] = articles;
//         });
//         setArticles(articlesObject);
//         setIsLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
//         setIsLoading(false);
//       }
//     };

//     if (topics.length > 0) {
//       fetchArticles();
//     }
//   }, [topics, selectedView]);

//   const handleViewChange = (view) => {
//     setSelectedView(view);
//   };

//   const handleThemeToggle = () => {
//     const newTheme = !isDarkMode ? 'dark' : 'light';
//     setIsDarkMode(!isDarkMode);
//     localStorage.setItem('theme', newTheme);
//     document.documentElement.classList.toggle('dark');
//   };

//   const capitalizeTitle = (title) => {
//     return title
//       .split(' ')
//       .map((word) => {
//         if (word.toLowerCase() === 'fc') {
//           return 'FC';
//         }
//         if (word.includes("'")) {
//           const parts = word.split("'");
//           return parts.map((part, index) => index === 0 ? capitalize(part) : part).join("'");
//         }
//         return capitalize(word);
//       })
//       .join(' ');
//   };

//   const capitalize = (word) => {
//     return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//   };

//   const handleViewAllArticlesClick = (topic) => {
//     navigate(`/articles?topic=${topic}`);
//   };

//   return (
//     <div className={isDarkMode ? 'dark' : ''}>
//       <section className="min-h-screen bg-white dark:bg-customDark text-gray-900 dark:text-white">
//         <Header isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
//         <div className="header-row flex flex-col md:flex-row justify-between items-center mb-5 px-12">
//           <h2 className="text-2xl font-bold mb-4 md:mb-0">
//             {selectedView === 'popular' ? 'Top Articles' : 'Newest Articles'}
//           </h2>
//           <div className="toggle-view flex flex-col md:flex-row gap-2">
//             <button
//               className={`toggle-button text-white px-3 py-2 rounded-md transition duration-300 ${selectedView === 'popular' ? 'font-bold border-white border-2' : 'font-normal'}`}
//               onClick={() => handleViewChange('popular')}
//             >
//               {selectedView === 'popular' ? 'Showing Most Popular' : 'Show Most Popular'}
//             </button>
//             <button
//               className={`toggle-button text-white px-3 py-2 rounded-md transition duration-300 ${selectedView === 'newest' ? 'font-bold border-white border-2' : 'font-normal'}`}
//               onClick={() => handleViewChange('newest')}
//             >
//               {selectedView === 'newest' ? 'Showing Newest' : 'Show Newest'}
//             </button>
//           </div>
//         </div>
//         <h3 className="topics-header text-xl font-bold text-center mt-5">Topics</h3>
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center h-64">
//             <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
//             <p className="loading-message">Loading... Please wait up to ~1 min for server to initialise</p>
//           </div>
//         ) : error ? (
//           <p>Error: {error}</p>
//         ) : (
//           <div className="topics-container flex flex-col gap-5 justify-center w-full box-border px-5 mx-auto">
//             {topics.map((topic) => (
//               <div
//                 key={topic.slug}
//                 className="topic-card bg-white dark:bg-customGray border border-gray-400 dark:border-gray-700 rounded-lg p-5 shadow-custom-lg transition-all duration-300 hover:border-gray-500 dark:hover:border-gray-300 dark:hover:shadow-light"
//               >
//                 <h3 className="text-lg font-semibold capitalize">{capitalizeTitle(topic.slug)}</h3>
//                 <h4 className="font-medium">{selectedView === 'popular' ? 'Most Popular' : 'Newest'}</h4>
//                 <ul className="list-none p-0">
//                   {articles[topic.slug]?.map((article) => (
//                     <li key={article.article_id} className="flex items-center justify-between mb-2">
//                       <img src={article.article_img_url} alt={`Image for ${article.title}`} className="article-img w-12 h-12 mr-2 rounded" />
//                       <Link to={`/articles/${article.article_id}`} className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap text-gray-900 dark:text-white no-underline hover:underline">
//                         {capitalizeTitle(article.title)}
//                       </Link>
//                       <Link to={`/articles/${article.article_id}`} className="read-now-button text-customRed no-underline hover:underline font-bold ml-4">Read Now</Link>
//                     </li>
//                   ))}
//                 </ul>
//                 <Link 
//                   to={`/articles?topic=${topic.slug}`} 
//                   className="view-all-link text-center text-customRed block mt-2 no-underline hover:underline"
//                 >
//                   View all articles on {capitalizeTitle(topic.slug)}
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// export default HomePage;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './HomePage.css';

function HomePage() {
  const [topics, setTopics] = useState([]);
  const [selectedView, setSelectedView] = useState('popular');
  const [articles, setArticles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('https://nc-news-be-project-1.onrender.com/api/topics');
        setTopics(response.data.topics);
      } catch (err) {
        console.error(err);
        setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlePromises = topics.map(async (topic) => {
          const response = await axios.get(`https://nc-news-be-project-1.onrender.com/api/articles`, {
            params: { topic: topic.slug, sort_by: selectedView === 'popular' ? 'votes' : 'created_at', order: 'desc' }
          });
          return { topic: topic.slug, articles: response.data.articles.slice(0, 4) };
        });
        const articlesByTopic = await Promise.all(articlePromises);
        const articlesObject = {};
        articlesByTopic.forEach(({ topic, articles }) => {
          articlesObject[topic] = articles;
        });
        setArticles(articlesObject);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : err.message);
        setIsLoading(false);
      }
    };

    if (topics.length > 0) {
      fetchArticles();
    }
  }, [topics, selectedView]);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const capitalizeTitle = (title) => {
    return title
      .split(' ')
      .map((word) => {
        if (word.length > 3 && word === word.toUpperCase()) {
          return word
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
        if (word.toLowerCase() === 'fc') {
          return 'FC';
        }
        if (word.includes("'")) {
          const parts = word.split("'");
          return parts.map((part, index) => index === 0 ? capitalize(part) : part).join("'");
        }
        return capitalize(word);
      })
      .join(' ');
  };

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const handleViewAllArticlesClick = (topic) => {
    navigate(`/articles?topic=${topic}`);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <section className="min-h-screen bg-white dark:bg-customDark text-gray-900 dark:text-white">
        <Header isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
        <div className="header-row flex flex-col md:flex-row justify-between items-center mb-5 px-12">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">
            {selectedView === 'popular' ? 'Top Articles' : 'Newest Articles'}
          </h2>
          <div className="toggle-view flex flex-col md:flex-row gap-2">
            <button
              className={`toggle-button text-white px-3 py-2 rounded-md transition duration-300 ${selectedView === 'popular' ? 'font-bold border-white border-2' : 'font-normal'}`}
              onClick={() => handleViewChange('popular')}
            >
              {selectedView === 'popular' ? 'Showing Most Popular' : 'Show Most Popular'}
            </button>
            <button
              className={`toggle-button text-white px-3 py-2 rounded-md transition duration-300 ${selectedView === 'newest' ? 'font-bold border-white border-2' : 'font-normal'}`}
              onClick={() => handleViewChange('newest')}
            >
              {selectedView === 'newest' ? 'Showing Newest' : 'Show Newest'}
            </button>
          </div>
        </div>
        <h3 className="topics-header text-xl font-bold text-center mt-5">Topics</h3>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
            <p className="loading-message">Loading... Please wait up to ~1 min for server to initialise</p>
          </div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="topics-container flex flex-col gap-5 justify-center w-full box-border px-5 mx-auto">
            {topics.map((topic) => (
              <div
                key={topic.slug}
                className="topic-card bg-white dark:bg-customGray border border-gray-400 dark:border-gray-700 rounded-lg p-5 shadow-custom-lg transition-all duration-300 hover:border-gray-500 dark:hover:border-gray-300 dark:hover:shadow-light"
              >
                <h3 className="text-lg font-semibold capitalize">{capitalizeTitle(topic.slug)}</h3>
                <h4 className="font-medium">{selectedView === 'popular' ? 'Most Popular' : 'Newest'}</h4>
                <ul className="list-none p-0">
                  {articles[topic.slug]?.map((article) => (
                    <li key={article.article_id} className="flex items-center justify-between mb-2">
                      <img src={article.article_img_url} alt={`Image for ${article.title}`} className="article-img w-12 h-12 mr-2 rounded" />
                      <Link to={`/articles/${article.article_id}`} className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap text-gray-900 dark:text-white no-underline hover:underline">
                        {capitalizeTitle(article.title)}
                      </Link>
                      <Link to={`/articles/${article.article_id}`} className="read-now-button text-customRed no-underline hover:underline font-bold ml-4">Read Now</Link>
                    </li>
                  ))}
                </ul>
                <Link 
                  to={`/articles?topic=${topic.slug}`} 
                  className="view-all-link text-center text-customRed block mt-2 no-underline hover:underline"
                >
                  View all articles on {capitalizeTitle(topic.slug)}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
