import React, { useState } from 'react';
import './comment.css';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const newComment = { text: comment, postId, date: new Date() };
        setComments([...comments, newComment]);
        setComment('');
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                ></textarea>
                <button type="submit">Submit</button>
            </form>
            <div className="comments-list">
                {comments.map((com, index) => (
                    <div key={index} className="comment">
                        <p>{com.text}</p>
                        <small>{new Date(com.date).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
