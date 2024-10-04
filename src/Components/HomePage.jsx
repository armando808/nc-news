import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFireAlt, faClock, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useFetchTopics } from '../hooks/useFetchTopics'
import { useFetchArticles } from '../hooks/useFetchArticles'
import { useTheme } from '../context/ThemeContext'
import { capitalizeTitle, truncateTitle } from '../utils/utils'
import Header from "./Header"
import AdRotator from "./AdRotator"
import AdRotatorHorizontal from "./AdRotatorHorizontal"
import { useArticleView } from "../hooks/useArticleView"
import { useIndexNavigation } from "../hooks/useIndexNavigation"
import "./HomePage.css"

function HomePage() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { selectedView, handleViewChange } = useArticleView("popular")
  const { topics, isLoading: isTopicsLoading, error: topicsError } = useFetchTopics()
  const { articles, isLoading: isArticlesLoading, error: articlesError } = useFetchArticles(selectedView, null)

  const groupedArticles = articles.reduce((acc, article) => {
    const { topic } = article
    if (!acc[topic]) {
      acc[topic] = []
    }
    acc[topic].push(article)
    return acc
  }, {})

  const { currentArticleIndex, handleNextArticle, handlePreviousArticle } = useIndexNavigation(topics, groupedArticles)

  if (isTopicsLoading || isArticlesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
        <p className="loading-message">Loading... Please wait up to ~1 min for server to initialise</p>
      </div>
    )
  }

  if (topicsError || articlesError) {
    return <p>Error: {topicsError || articlesError}</p>
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <section className="min-h-screen bg-white dark:bg-customDark text-gray-900 dark:text-white">
        <Header isDarkMode={isDarkMode} handleThemeToggle={toggleTheme} />
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

            <div className="topics-container-inner flex flex-col gap-5 justify-center w-full box-border px-5 mx-auto">
              {topics.map((topic) => (
                <div key={topic.slug}>
                  <div className="topic-tile flex lg:flex-row flex-col">
                    <div className="topic-tile-header">{capitalizeTitle(topic.slug)}</div>
                    <div className="main-article">
                      {groupedArticles[topic.slug] && groupedArticles[topic.slug].length > 0 ? (
                        <>
                          <Link
                            to={`/articles/${groupedArticles[topic.slug][currentArticleIndex[topic.slug]]?.article_id}`}
                          >
                            <img
                              src={groupedArticles[topic.slug][currentArticleIndex[topic.slug]]?.article_img_url}
                              alt={`Image for ${groupedArticles[topic.slug][currentArticleIndex[topic.slug]]?.title}`}
                            />
                            <div className="title-overlay">
                              {capitalizeTitle(groupedArticles[topic.slug][currentArticleIndex[topic.slug]]?.title)}
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
                        </>
                      ) : (
                        <p>No articles available for {topic.slug}</p>
                      )}
                    </div>
                    <div className="side-titles-container">
                      {groupedArticles[topic.slug] && groupedArticles[topic.slug].length > 0 && [1, 2].map((offset) => {
                        const index = (currentArticleIndex[topic.slug] + offset) % groupedArticles[topic.slug].length;
                        return (
                          <Link
                            key={groupedArticles[topic.slug][index]?.article_id}
                            to={`/articles/${groupedArticles[topic.slug][index]?.article_id}`}
                            className="side-title"
                            title={groupedArticles[topic.slug][index]?.title}
                          >
                            {truncateTitle(capitalizeTitle(groupedArticles[topic.slug][index]?.title), 40)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <AdRotatorHorizontal />
                </div>
              ))}
            </div>
          </div>
          <div className="ad-container right-ad">
            <AdRotator />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
