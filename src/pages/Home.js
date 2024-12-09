import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import PostCard from '../components/PostCard/PostCard';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../styles/GlobalStyles.css';
import '../styles/variables.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/posts');
                console.log('API Response:', response);
                
                if (response.data && Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
                    console.error('Invalid data format:', response.data);
                    setError('Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err.response?.data?.message || 'Failed to load posts');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Loading posts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="home">
            <main className="main-content">
                <h1>Welcome to My Blog</h1>
                <div className="posts-container">
                    {posts && posts.length > 0 ? (
                        posts.map(post => {
                            console.log('Rendering post:', post);
                            return (
                                <PostCard 
                                    key={post._id} 
                                    post={post} 
                                />
                            );
                        })
                    ) : (
                        <p className="no-posts-message">No posts available yet.</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
