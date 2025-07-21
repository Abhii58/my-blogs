import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import axios from '../axiosConfig';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './pages.css';
import Comments from '../components/Comments/Comments';
import SocialShare from '../components/SocialShare/SocialShare'; // Import SocialShare component

const Post = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/posts/${postId}`);
                console.log('Fetched post:', response.data);
                setPost(response.data);
                console.log('Allow comments:', response.data.allowComments); // Log the allowComments value
                setLoading(false);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post');
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleCommentSubmit = async (postId, commentContent) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            const response = await axios.post(`/posts/${postId}/comments`, {
                content: commentContent
            });

            if (response.status === 201) {
                // Refresh the post data to show the new comment
                const updatedPost = await axios.get(`/posts/${postId}`);
                setPost(updatedPost.data);
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const handleLoginPrompt = () => {
        navigate('/login', { state: { from: `/post/${postId}` } });
    };

    if (loading) return <div className="loading">Loading post...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="post-page">
            <main className="main-content">
                <article className="post-content">
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span className="post-author">By {post.author}</span>
                        <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    {post.image && (
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="post-image"
                        />
                    )}
                    <div 
                        className="post-body"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    <SocialShare url={window.location.href} title={post.title} /> {/* Add SocialShare component */}
                    
                    {showLoginPrompt && !user && (
                        <div className="login-prompt">
                            <p>Please log in to comment on this post</p>
                            <button 
                                onClick={handleLoginPrompt}
                                className="login-button"
                            >
                                Login
                            </button>
                        </div>
                    )}
                    
                    {post.allowComments && (
                        <Comments 
                            postId={post._id}
                            comments={post.comments}
                            onCommentSubmit={handleCommentSubmit}
                            onLoginRequired={() => setShowLoginPrompt(true)}
                            isLoggedIn={!!user}
                        />
                    )}
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default Post;
