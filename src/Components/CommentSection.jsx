import { useEffect, useState } from "react"
import axios from "axios"
import './CommentSection.css'
import { useUser } from "../UserContext"

function CommentSection({ articleId }) {
    const { username } = useUser()
    const [comments, setComments] = useState([])
    const [commentsExpanded, setCommentsExpanded] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [postSuccess, setPostSuccess] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(null)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://nc-news-be-project-1.onrender.com/api/articles/${articleId}/comments`)
                setComments(response.data.comments)
                setIsLoading(false)
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
            }
        };

        fetchComments()
    }, [articleId])

    const handleCommentSubmit = async (event) => {
        event.preventDefault()
        if (/^\s*$/.test(newComment)) {
            setError("Comment cannot be empty.")
            return;
        }

        const newCommentObject = {
            author: username,
            body: newComment,
            created_at: new Date().toISOString(),
            votes: 0
        };

        setComments([newCommentObject, ...comments])
        setNewComment("")
        setPostSuccess("Your comment has been posted!")
        setError(null)

        try {
            await axios.post(`https://nc-news-be-project-1.onrender.com/api/articles/${articleId}/comments`, {
                username,
                body: newComment
            })
            setPostSuccess("Your comment has been posted!")
        } catch (err) {
            setError("Sorry! There was an error posting the comment - please try again.")
            setComments(comments)
        }
    };

    const handleDeleteComment = async (commentId) => {
        const remainingComments = comments.filter(comment => comment.comment_id !== commentId)
        setComments(remainingComments)
        setDeleteSuccess("Your comment has been deleted!")

        try {
            await axios.delete(`https://nc-news-be-project-1.onrender.com/api/comments/${commentId}`)
        } catch (err) {
            setError("Sorry! There was an error deleting the comment - please try again.")
            setComments(comments)
        }
    }

    const visibleComments = commentsExpanded ? comments : comments.slice(0, 2)

    return (
        <section className="comment-section">
            <h3>Comments: {comments.length}</h3>
            {isLoading ? (
                <p>Loading comments...</p>
            ) : (
                <>
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Post your comment here..."
                            required
                        />
                        <button type="submit">Post Comment</button>
                    </form>
                    {postSuccess && <p className="success-message">{postSuccess}</p>}
                    {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <button className="toggle-button" onClick={() => setCommentsExpanded(!commentsExpanded)}>
                        {commentsExpanded ? 'Show Less' : 'Show All Comments'}
                    </button>
                    <section className="comments-container">
                        {visibleComments.map((comment, index) => (
                            <article key={comment.comment_id} className="comment">
                                <p><strong>{comment.author}</strong>: {comment.body}</p>
                                <p>{new Date(comment.created_at).toLocaleDateString()}</p>
                                {comment.author === username && (
                                    <button
                                    className="delete-button"
                                    onClick={() => handleDeleteComment(comment.comment_id)}
                                    >
                                    Delete comment
                                    </button>
                                )}
                            </article>
                        ))}
                    </section>
                </>
            )}
        </section>
    );
}

export default CommentSection