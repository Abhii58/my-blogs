import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import './Comment.css';

const Comments = ({ postId, comments, onCommentSubmit }) => {
    const { user } = useContext(UserContext);
    const [newComment, setNewComment] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await onCommentSubmit(postId, newComment);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleCommentClick = () => {
        if (!user) {
            setShowLoginPrompt(true);
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            
            {user ? (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    />
                    <button type="submit">Post Comment</button>
                </form>
            ) : (
                <div 
                    className="login-prompt"
                    onClick={handleCommentClick}
                >
                    {showLoginPrompt ? (
                        <div className="login-message">
                            <p>You need to be logged in to comment.</p>
                            <Link to="/login" className="login-link">
                                Click here to login
                            </Link>
                        </div>
                    ) : (
                        <textarea
                            placeholder="Write a comment..."
                            className="disabled-textarea"
                            disabled
                        />
                    )}
                </div>
            )}

            <div className="comments-list">
                {comments && comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <div className="comment-header">
                            <strong>{comment.author.username}</strong>
                            <span className="comment-date">
                                {new Date(comment.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments; 