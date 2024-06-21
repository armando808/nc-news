import { useState } from "react"
import axios from "axios"
import './Voting.css'

function Voting({ article_id, initialVotes}) {
    const [votes, setVotes] = useState(initialVotes)
    const [voteStatus, setVoteStatus] = useState(null)
    const [error, setError] = useState(null)

const handleVote = async (increment) => {
        const newVoteStatus = increment > 0 ? 'upvoted' : 'downvoted'
        const reverseVoteStatus = increment > 0 ? 'downvoted' : 'upvoted'

        try {
            if (voteStatus === newVoteStatus) {
                setVotes((prevVotes) => prevVotes - increment)
                setVoteStatus(null)
                await sendVoteToApi(-increment)
            } else if (voteStatus === reverseVoteStatus) {
                setVotes((prevVotes) => prevVotes + 2 * increment)
                setVoteStatus(newVoteStatus)
                await sendVoteToApi(2 * increment)
            } else {
                setVotes((prevVotes) => prevVotes + increment)
                setVoteStatus(newVoteStatus)
                await sendVoteToApi(increment)
            }
        } catch (err) {
            setError('Error while updating vote');
            setVotes((prevVotes) => prevVotes - increment)
        }
    }
    const sendVoteToApi = async (inc_votes) => {
        try {
            await axios.patch(`https://nc-news-be-project-1.onrender.com/api/articles/${article_id}`, { inc_votes });
        } catch (err) {
            setError('Error while updating vote')
        }
    }
    return (
        <section className="voting-component">
            <button 
                className={`vote-button downvote ${voteStatus === 'downvoted' ? 'selected' : ''}`} 
                onClick={() => handleVote(-1)}
            >
                <strong>-</strong>
            </button>
            <span className="vote-count"><strong>Votes: {votes}</strong></span>
            <button 
                className={`vote-button upvote ${voteStatus === 'upvoted' ? 'selected' : ''}`} 
                onClick={() => handleVote(1)}
            >
                <strong>+</strong>
            </button>
            {error && <p className="error-message">{error}</p>}
        </section>
    )
}


export default Voting