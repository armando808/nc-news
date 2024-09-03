import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt, faClock, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import AdRotator from "./AdRotator";
import AdRotatorHorizontal from "./AdRotatorHorizontal";
import "./HomePage.css";

function HomePage() {
  const [topics, setTopics] = useState([]);
  const [selectedView, setSelectedView] = useState("popular");
  const [articles, setArticles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [currentArticleIndex, setCurrentArticleIndex] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("https://nc-news-be-project-1.onrender.com/api/topics");
        setTopics(response.data.topics);
      } catch (err) {
        console.error(err);
        setError(
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : err.message
        );
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlePromises = topics.map(async (topic) => {
          const response = await axios.get("https://nc-news-be-project-1.onrender.com/api/articles", {
            params: {
              topic: topic.slug,
              sort_by: selectedView === "popular" ? "votes" : "created_at",
              order: "desc",
            },
          });
          return { topic: topic.slug, articles: response.data.articles };
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
        setError(
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : err.message
        );
        setIsLoading(false);
      }
    };

    if (topics.length > 0) {
      fetchArticles();
    }
  }, [topics, selectedView]);

  useEffect(() => {
    const initialIndexes = {};
    topics.forEach((topic) => {
      initialIndexes[topic.slug] = 0;
    });
    setCurrentArticleIndex(initialIndexes);
  }, [topics]);

  const handleViewChange = (view) => {
    setSelectedView(view);

    const resetIndexes = {};
    topics.forEach((topic) => {
      resetIndexes[topic.slug] = 0;
    });
    setCurrentArticleIndex(resetIndexes);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const capitalizeTitle = (title) => {
    return title
      .split(" ")
      .map((word) => {
        if (word === "APIs") {
          return word;
        }
        if (word.toLowerCase() === "fc") {
          return "FC";
        }
        if (word.length > 1 && word.toUpperCase() === word) {
          return word.charAt(0) + word.slice(1).toLowerCase();
        }
        if (word.includes("'")) {
          const parts = word.split("'");
          return parts
            .map((part, index) => (index === 0 ? capitalize(part) : part))
            .join("'");
        }
        return capitalize(word);
      })
      .join(" ");
  };

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const handleNextArticle = (topicSlug) => {
    setCurrentArticleIndex((prevIndexes) => ({
      ...prevIndexes,
      [topicSlug]: (prevIndexes[topicSlug] + 1) % articles[topicSlug].length,
    }));
  };

  const handlePreviousArticle = (topicSlug) => {
    setCurrentArticleIndex((prevIndexes) => ({
      ...prevIndexes,
      [topicSlug]: (prevIndexes[topicSlug] - 1 + articles[topicSlug].length) % articles[topicSlug].length,
    }));
  };

  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.slice(0, maxLength - 3) + '...' : title;
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <section className="min-h-screen bg-white dark:bg-customDark text-gray-900 dark:text-white">
        <Header isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
        <div className="flex justify-center items-start relative">
          <div className="ad-container left-ad">
            <AdRotator />
          </div>
          <div className="topics-container flex flex-col gap-5 w-full lg:w-2/3 md:w-2/3">
            <div className="header-row flex flex-col md:flex-row justify-between items-center mb-5 px-12">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">
                {selectedView === "popular" ? "Top Articles" : "Newest Articles"}
              </h2>
              <div className="toggle-view flex gap-2">
                <button
                  className={`toggle-button text-white px-3 py-2 rounded-md transition duration-300 ${
                    selectedView === "popular" ? "font-bold border-white border-2" : "font-normal"
                  }`}
                  onClick={() => handleViewChange("popular")}
                >
                  <span className="hidden sm:inline">Most Popular</span>
                  <FontAwesomeIcon
                    icon={faFireAlt}
                    className={`transition-all sm:hidden ${selectedView === "popular" ? "text-3xl" : "text-sm"}`}
                  />
                </button>
                <button
                  className={`toggle-button text-white px-3 py-2 rounded-md transition duration-300 ${
                    selectedView === "newest" ? "font-bold border-white border-2" : "font-normal"
                  }`}
                  onClick={() => handleViewChange("newest")}
                >
                  <span className="hidden sm:inline">Newest</span>
                  <FontAwesomeIcon
                    icon={faClock}
                    className={`transition-all sm:hidden ${selectedView === "newest" ? "text-3xl" : "text-sm"}`}
                  />
                </button>
              </div>
            </div>
            <h3 className="topics-header text-xl font-bold text-center mt-2 mb-2">Topics</h3>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
                <p className="loading-message">Loading... Please wait up to ~1 min for server to initialise</p>
              </div>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <div className="topics-container-inner flex flex-col gap-5 justify-center w-full box-border px-5 mx-auto">
                {topics.map((topic) => (
                  <div key={topic.slug}>
                    <div className="topic-tile flex lg:flex-row flex-col">
                      <div className="topic-tile-header">{capitalizeTitle(topic.slug)}</div>
                      <div className="main-article">
                        <Link
                          to={`/articles/${articles[topic.slug][currentArticleIndex[topic.slug]].article_id}`}
                        >
                          <img
                            src={articles[topic.slug][currentArticleIndex[topic.slug]].article_img_url}
                            alt={`Image for ${articles[topic.slug][currentArticleIndex[topic.slug]].title}`}
                          />
                          <div className="title-overlay">
                            {capitalizeTitle(articles[topic.slug][currentArticleIndex[topic.slug]].title)}
                          </div>
                        </Link>
                        <button
                          className="arrow-button left"
                          onClick={() => handlePreviousArticle(topic.slug)}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button
                          className="arrow-button right"
                          onClick={() => handleNextArticle(topic.slug)}
                        >
                          <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                      </div>
                      <div className="side-titles-container">
                        {[1, 2].map((offset) => {
                          const index = (currentArticleIndex[topic.slug] + offset) % articles[topic.slug].length;
                          return (
                            <Link
                              key={articles[topic.slug][index].article_id}
                              to={`/articles/${articles[topic.slug][index].article_id}`}
                              className="side-title"
                              title={articles[topic.slug][index].title}
                            >
                              {truncateTitle(capitalizeTitle(articles[topic.slug][index].title), 40)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    <AdRotatorHorizontal />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="ad-container right-ad">
            <AdRotator />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
