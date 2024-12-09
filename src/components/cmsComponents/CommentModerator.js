import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cmscompo.css';

const CommentModerator = () => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('/api/comments');
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setError('Failed to fetch comments');
            }
        };
        fetchComments();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/comments/approve/${id}`);
            setComments(comments.map(comment => comment._id === id ? { ...comment, approved: true } : comment));
        } catch (error) {
            console.error('Error approving comment:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/comments/${id}`);
            setComments(comments.filter(comment => comment._id !== id));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="comment-moderator">
            <h2>Comment Moderation</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment._id}>
                        <p>{comment.text}</p>
                        <button onClick={() => handleApprove(comment._id)}>Approve</button>
                        <button onClick={() => handleDelete(comment._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentModerator;
