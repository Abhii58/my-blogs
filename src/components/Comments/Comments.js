import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import './Comment.css';

const Comments = ({ postId, comments, onCommentSubmit }) => {
    const { user } = useContext(UserContext);
    const [newComment, setNewComment] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [reactions, setReactions] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await onCommentSubmit(postId, newComment, replyTo);
            setNewComment('');
            setReplyTo(null);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleReaction = async (commentId, reaction) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            const currentReactions = reactions[commentId] || {};
            const newReactions = {
                ...reactions,
                [commentId]: {
                    ...currentReactions,
                    [reaction]: !currentReactions[reaction]
                }
            };
            setReactions(newReactions);
            // Here you would typically make an API call to save the reaction
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };

    const handleCommentClick = () => {
        if (!user) {
            setShowLoginPrompt(true);
        }
    };

    const renderComment = (comment, level = 0) => {
        const commentReactions = reactions[comment._id] || {};
        
        return (
            <div 
                key={comment._id} 
                className="comment"
                style={{ marginLeft: `${level * 20}px` }}
            >
                <div className="comment-header">
                    <strong>{comment.author?.username || 'Anonymous'}</strong>
                    <span className="comment-date">
                        {new Date(comment.date).toLocaleDateString()}
                    </span>
                </div>
                <p>{comment.content}</p>
                
                <div className="comment-actions">
                    <div className="reaction-buttons">
                        <button 
                            onClick={() => handleReaction(comment._id, 'like')}
                            className={`reaction-btn ${commentReactions.like ? 'active' : ''}`}
                        >
                            👍 {comment.likes || 0}
                        </button>
                        <button 
                            onClick={() => handleReaction(comment._id, 'love')}
                            className={`reaction-btn ${commentReactions.love ? 'active' : ''}`}
                        >
                            ❤️ {comment.loves || 0}
                        </button>
                        <button 
                            onClick={() => handleReaction(comment._id, 'laugh')}
                            className={`reaction-btn ${commentReactions.laugh ? 'active' : ''}`}
                        >
                            😄 {comment.laughs || 0}
                        </button>
                    </div>
                    
                    {user && (
                        <button 
                            className="reply-btn"
                            onClick={() => setReplyTo(comment._id)}
                        >
                            Reply
                        </button>
                    )}
                </div>

                {replyTo === comment._id && (
                    <form onSubmit={handleSubmit} className="reply-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a reply..."
                            required
                        />
                        <div className="reply-actions">
                            <button type="submit">Reply</button>
                            <button 
                                type="button" 
                                onClick={() => setReplyTo(null)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {comment.replies?.map(reply => renderComment(reply, level + 1))}
            </div>
        );
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
                {comments?.map(comment => renderComment(comment))}
            </div>
        </div>
    );
};

export default Comments;
