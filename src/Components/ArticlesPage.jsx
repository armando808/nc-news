import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import './ArticlesPage.css'
import { useArticleView } from '../hooks/useArticleView'
import { useFetchTopics } from '../hooks/useFetchTopics'
import { useFetchArticles } from '../hooks/useFetchArticles'
import { useTheme } from '../context/ThemeContext'
import { formatTitle } from '../utils/utils'

function ArticlesPage() {
  const { selectedView, handleViewChange } = useArticleView('newest')
  const { topics, isLoading: isTopicsLoading, error: topicsError } = useFetchTopics()
  const { isDarkMode, toggleTheme } = useTheme()
  const [selectedTopic, setSelectedTopic] = useState('all')
  const { articles, isLoading: isArticlesLoading, error: articlesError } = useFetchArticles(selectedView, selectedTopic)

  const error = topicsError || articlesError

  const handleOptionChange = (event) => {
    const value = event.target.value
    setSelectedTopic(value)
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <section className="min-h-screen bg-white dark:bg-customDark text-gray-900 dark:text-white">
        <Header isDarkMode={isDarkMode} handleThemeToggle={toggleTheme} />

        <div className="header-row flex justify-between items-center mb-5 px-12">
          <h2 className="text-2xl font-bold">
            {selectedTopic === 'all'
              ? 'All Articles'
              : `${formatTitle(selectedTopic)} Articles`}
          </h2>

          <div className="right-side-controls flex flex-col items-end">
            <div className="toggle-view flex gap-2">
              <button
                className={`toggle-button px-3 py-2 rounded-md transition duration-300 ${
                  selectedView === 'newest' ? 'font-bold border-white border-2' : 'font-normal'
                }`}
                onClick={() => handleViewChange('newest')}
              >
                Newest
              </button>
              <button
                className={`toggle-button px-3 py-2 rounded-md transition duration-300 ${
                  selectedView === 'popular' ? 'font-bold border-white border-2' : 'font-normal'
                }`}
                onClick={() => handleViewChange('popular')}
              >
                Most Popular
              </button>
            </div>

            <div className="select-container relative mt-2">
              <select
                onChange={handleOptionChange}
                value={selectedTopic}
                className="block appearance-none w-full bg-white dark:bg-customGray border border-gray-400 dark:border-gray-600 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:ring-0"
              >
                <option value="all">All Articles</option>
                {topics.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {formatTitle(topic.slug)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isTopicsLoading || isArticlesLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
            <p className="loading-message">Loading... Please wait up to ~1 min for server to initialize</p>
          </div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : articles.length > 0 ? (
          <div className="topics-container flex flex-col gap-5 justify-center w-full box-border px-5 mx-auto">
            {articles.map((article) => (
              <article
                key={article.article_id}
                className="article-card bg-white dark:bg-customGray border border-gray-400 dark:border-gray-700 rounded-lg p-5 shadow-custom-lg transition-all duration-300 hover:border-gray-500 dark:hover:border-gray-300 dark:hover:shadow-light"
              >
                <Link to={`/articles/${article.article_id}`} className="block">
                  <h3 className="text-lg font-semibold capitalize">{formatTitle(article.title)}</h3>
                  <p>
                    Article written by {article.author} on{' '}
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                  <img
                    src={article.article_img_url}
                    alt={`Image for ${article.title}`}
                    className="w-full h-auto rounded mb-2"
                  />
                  <p>Comments: {article.comment_count}</p>
                  <p>Votes: {article.votes}</p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p>No articles available for the selected topic.</p>
        )}
      </section>
    </div>
  )
}

export default ArticlesPage
