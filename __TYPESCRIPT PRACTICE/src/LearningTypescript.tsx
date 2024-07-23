//COMMENTED OUT IN CASE IT BREAKS MY SITE. JUST REFACTORED A COMPONENT IN TYPESCRIPT TO LEARN HOW TO USE IT


// "use client"
// import React from "react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import './CommentSection.css';
// import { useUser } from "../UserContext";

// interface Comment {
//     author: string,
//     body: string,
//     created_at: string,
//     votes: number,
//     isPending: boolean,
//     comment_id?: string
// }

// function CommentSection({ articleId }) {
//     const { username } = useUser();
//     const [comments, setComments] = useState<Comment[]>([]);
//     const [commentsExpanded, setCommentsExpanded] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [newComment, setNewComment] = useState("");
//     const [postSuccess, setPostSuccess] = useState<string | null>(null);
//     const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
//     const [pendingComments, setPendingComments] = useState<Comment[]>([]);

//     useEffect(() => {
//         const fetchComments = async () => {
//             try {
//                 const response = await axios.get(`https://nc-news-be-project-1.onrender.com/api/articles/${articleId}/comments`);
//                 setComments(response.data.comments);
//                 setIsLoading(false);
//             } catch (err) {
//                 setError(err.message);
//                 setIsLoading(false);
//             }
//         };

//         fetchComments();
//     }, [articleId]);
    
//     const handleCommentSubmit = async (event) => {
//         event.preventDefault();
//         if (/^\s*$/.test(newComment)) {
//             setError("Comment cannot be empty.");
//             return;
//         }

//         const newCommentObject: Comment = {
//             author: username,
//             body: newComment,
//             created_at: new Date().toISOString(),
//             votes: 0,
//             isPending: true,
//         };

//         setPendingComments([newCommentObject, ...pendingComments]);
//         setNewComment("");
//         setPostSuccess("Your comment has been posted!");
//         setError(null);

//         try {
//             const response = await axios.post(`https://nc-news-be-project-1.onrender.com/api/articles/${articleId}/comments`, {
//                 username,
//                 body: newComment
//             });
//             const postedComment = response.data.comment;
//             setPendingComments(pendingComments.filter(comment => comment !== newCommentObject));
//             setComments([postedComment, ...comments]);
//             setPostSuccess("Your comment has been posted!");
//         } catch (err) {
//             setError("Sorry! There was an error posting the comment - please try again.");
//             setPendingComments(pendingComments.filter(comment => comment !== newCommentObject));
//         }
//     };

//     const handleDeleteComment = async (commentId, isPending) => {
//         if (isPending) {
//             setPendingComments(pendingComments.filter(comment => comment.created_at !== commentId));
//         } else {
//             setComments(comments.filter(comment => comment.comment_id !== commentId));
//         }
//         setDeleteSuccess("Your comment has been deleted!");
//         setError(null);

//         try {
//             if (!isPending) {
//                 await axios.delete(`https://nc-news-be-project-1.onrender.com/api/comments/${commentId}`);
//             }
//         } catch (err) {
//             setError("Sorry! There was an error deleting the comment - please try again.");
//             if (isPending) {
//                 setPendingComments(pendingComments);
//             } else {
//                 setComments(comments);
//             }
//         }
//     };

//     const visibleComments = commentsExpanded ? comments.concat(pendingComments) : comments.concat(pendingComments).slice(0, 2);

//     return (
//         <section className="comment-section">
//             <h3>Comments: {comments.length + pendingComments.length}</h3>
//             {isLoading ? (
//                 <p>Loading comments...</p>
//             ) : (
//                 <>
//                     <form onSubmit={handleCommentSubmit} className="comment-form">
//                         <textarea
//                             value={newComment}
//                             onChange={(e) => setNewComment(e.target.value)}
//                             placeholder="Post your comment here..."
//                             required
//                         />
//                         <button type="submit" disabled={pendingComments.length > 0}>Post Comment</button>
//                     </form>
//                     {postSuccess && <p className="success-message">{postSuccess}</p>}
//                     {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
//                     {error && <p className="error-message">{error}</p>}
//                     <button className="toggle-button" onClick={() => setCommentsExpanded(!commentsExpanded)}>
//                         {commentsExpanded ? 'Show Less' : 'Show All Comments'}
//                     </button>
//                     <section className="comments-container">
//                         {visibleComments.map((comment, index) => (
//                             <article key={comment.comment_id || comment.created_at} className="comment">
//                                 <p><strong>{comment.author}</strong>: {comment.body}</p>
//                                 <p>{new Date(comment.created_at).toLocaleDateString()}</p>
//                                 {comment.author === username && (
//                                     <button
//                                         className="delete-button"
//                                         onClick={() => handleDeleteComment(comment.comment_id || comment.created_at, comment.isPending)}
//                                     >
//                                         Delete comment
//                                     </button>
//                                 )}
//                             </article>
//                         ))}
//                     </section>
//                 </>
//             )}
//         </section>
//     );
// }

// export default CommentSection;
