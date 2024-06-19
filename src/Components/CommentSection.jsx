
import { useEffect, useState } from "react";
import axios from "axios";
import './CommentSection.css';

function CommentSection({ articleId }) {
    const [comments, setComments] = useState([]);
    const [commentsExpanded, setCommentsExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://nc-news-be-project-1.onrender.com/api/articles/${articleId}/comments`);
                setComments(response.data.comments);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [articleId]);

    const visibleComments = commentsExpanded ? comments : comments.slice(0, 2);

    return (
        <section className="comment-section">
            <h3>Comments</h3>
            {isLoading ? (
                <p>Loading comments...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <button onClick={() => setCommentsExpanded(!commentsExpanded)}>
                        {commentsExpanded ? 'Show Less' : 'Show All Comments'}
                    </button>
                    <section className="comments-container">
                        {visibleComments.map((comment, index) => (
                            <article key={index} className="comment">
                                <p><strong>{comment.author}</strong>: {comment.body}</p>
                                <p>{new Date(comment.created_at).toLocaleDateString()}</p>
                            </article>
                        ))}
                    </section>
                </>
            )}
        </section>
    );
}

export default CommentSection;