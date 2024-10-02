import { useEffect, useState } from "react"
import './CommentSection.css'
import { useUser } from "../context/UserContext"
import { fetchComments, postComment, deleteComment } from "../utils/commentsApi"
import { formatDate } from "../utils/commentUtils"

function CommentSection({ articleId }) {
    const { username } = useUser()
    const [comments, setComments] = useState([])
    const [commentsExpanded, setCommentsExpanded] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [postSuccess, setPostSuccess] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(null)
    const [pendingComments, setPendingComments] = useState([])

    useEffect(() => {
    const getComments = async () => {
        try {
        setIsLoading(true)
        const commentsData = await fetchComments(articleId)
        setComments(commentsData)
        setIsLoading(false)
        } catch (err) {
        setError(err.message)
        setIsLoading(false)
        }
    };

    getComments()
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
        votes: 0,
        isPending: true,
    };

    setPendingComments([newCommentObject, ...pendingComments])
    setNewComment("")
    setPostSuccess("Your comment has been posted!")
    setError(null)

    try {
        const postedComment = await postComment(articleId, username, newComment)
        setPendingComments(pendingComments.filter(comment => comment !== newCommentObject))
        setComments([postedComment, ...comments])
    } catch (err) {
        setError("Sorry! There was an error posting the comment - please try again.")
        setPendingComments(pendingComments.filter(comment => comment !== newCommentObject))
    }
    }

    const handleDeleteComment = async (commentId, isPending) => {
    if (isPending) {
        setPendingComments(pendingComments.filter(comment => comment.created_at !== commentId))
    } else {
        setComments(comments.filter(comment => comment.comment_id !== commentId))
    }
    setDeleteSuccess("Your comment has been deleted!")
    setError(null)

    try {
        if (!isPending) {
        await deleteComment(commentId)
        }
    } catch (err) {
        setError("Sorry! There was an error deleting the comment - please try again.")
    }
    }

    const visibleComments = commentsExpanded
    ? comments.concat(pendingComments)
    : comments.concat(pendingComments).slice(0, 2)

    return (
    <section className="comment-section mt-5">
        <h3>Comments: {comments.length + pendingComments.length}</h3>
        {isLoading ? (
        <p>Loading... Please wait up to ~1 min for server to initialise</p>
        ) : (
        <>
            <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post your comment here..."
                required
                className="bg-gray-100 dark:bg-gray-200 text-gray-900 dark:text-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 w-full"
            />
            <button type="submit" disabled={pendingComments.length > 0} className="bg-customRed text-white px-3 py-2 rounded-md transition duration-300 hover:bg-red-700">
                Post Comment
            </button>
            </form>
            {postSuccess && <p className="success-message">{postSuccess}</p>}
            {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
            {error && <p className="error-message">{error}</p>}
            <button
            className="toggle-button bg-customRed text-white px-3 py-2 rounded-md transition duration-300 hover:bg-red-700"
            onClick={() => setCommentsExpanded(!commentsExpanded)}
            >
            {commentsExpanded ? 'Show Less' : 'Show All Comments'}
            </button>
            <section className="comments-container mt-4">
            {visibleComments.map((comment) => (
                <article key={comment.comment_id || comment.created_at} className="comment bg-gray-100 dark:bg-gray-200 text-gray-900 dark:text-gray-900 border border-gray-300 dark:border-gray-600 rounded p-3 mb-2">
                <p><strong>{comment.author}</strong>: {comment.body}</p>
                <p>{formatDate(comment.created_at)}</p>
                {comment.author === username && (
                    <button
                    className="delete-button bg-customRed text-white px-3 py-2 rounded-md transition duration-300 hover:bg-red-700"
                    onClick={() => handleDeleteComment(comment.comment_id || comment.created_at, comment.isPending)}
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