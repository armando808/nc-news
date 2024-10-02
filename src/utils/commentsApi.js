import axios from 'axios'

const ncNewsAPI = axios.create({
    baseURL: 'https://nc-news-be-project-1.onrender.com/api',
})

export const fetchComments = async (articleId) => {
    const response = await ncNewsAPI.get(`/articles/${articleId}/comments`)
    return response.data.comments
}

export const postComment = async (articleId, username, newComment) => {
    const response = await ncNewsAPI.post(`/articles/${articleId}/comments`, {
    username,
    body: newComment,
    })
    return response.data.comment
}

export const deleteComment = async (commentId) => {
    await ncNewsAPI.delete(`/comments/${commentId}`)
}
