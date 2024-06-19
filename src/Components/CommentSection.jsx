import { useEffect, useState } from "react";
import axios from "axios";
import './CommentsSection.css'

function CommentsSection({ articleId }) {
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

        
}
