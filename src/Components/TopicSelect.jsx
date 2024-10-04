import React from 'react'

function TopicSelect({ topics, selectedTopic, handleOptionChange }) {
    return (
    <div className="select-container relative mt-2">
        <select
        onChange={handleOptionChange}
        value={selectedTopic}
        className="block appearance-none w-full bg-white dark:bg-customGray border border-gray-400 dark:border-gray-600 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:ring-0"
        >
        <option value="all">All Articles</option>
        {topics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>
            {topic.slug.charAt(0).toUpperCase() + topic.slug.slice(1)}
            </option>
        ))}
        </select>
    </div>
    )
}

export default TopicSelect
