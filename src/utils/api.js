import axios from 'axios'

const ncNewsAPI = axios.create({
    baseURL: 'https://nc-news-be-project-1.onrender.com/api',
})

export const fetchArticles = async (params) => {
    const response = await ncNewsAPI.get('/articles', { params })
    return response.data.articles
}

export const fetchTopics = async () => {
    const response = await ncNewsAPI.get('/topics')
    return response.data.topics
}