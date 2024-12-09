import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogEditor from '../components/BlogEditor/BlogEditor';
import CategoryManager from '../components/cmsComponents/CategoryManager';
import TagManager from '../components/cmsComponents/TagManager';
import CommentModerator from '../components/cmsComponents/CommentModerator';
import MediaManager from '../components/cmsComponents/MediaManager';
import SEOTools from '../components/cmsComponents/SEOTools';
import './CMS.css';

const CMS = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeComponent, setActiveComponent] = useState('editor');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios({
                    method: 'GET',
                    url: '/api/cms',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                setPosts(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.response?.data?.message || 'Failed to fetch posts');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'editor':
                return <BlogEditor />;
            case 'categories':
                return <CategoryManager />;
            case 'tags':
                return <TagManager />;
            case 'comments':
                return <CommentModerator />;
            case 'media':
                return <MediaManager />;
            case 'seo':
                return <SEOTools />;
            default:
                return <BlogEditor />;
        }
    };

    if (loading) return <div className="cms-loading">Loading...</div>;
    if (error) return <div className="cms-error">Error: {error}</div>;

    return (
        <div className="cms-container">
            <nav className="cms-nav">
                <button 
                    className={activeComponent === 'editor' ? 'active' : ''} 
                    onClick={() => setActiveComponent('editor')}
                >
                    Blog Editor
                </button>
                <button 
                    className={activeComponent === 'categories' ? 'active' : ''} 
                    onClick={() => setActiveComponent('categories')}
                >
                    Categories
                </button>
                <button 
                    className={activeComponent === 'tags' ? 'active' : ''} 
                    onClick={() => setActiveComponent('tags')}
                >
                    Tags
                </button>
                <button 
                    className={activeComponent === 'comments' ? 'active' : ''} 
                    onClick={() => setActiveComponent('comments')}
                >
                    Comments
                </button>
                <button 
                    className={activeComponent === 'media' ? 'active' : ''} 
                    onClick={() => setActiveComponent('media')}
                >
                    Media
                </button>
                <button 
                    className={activeComponent === 'seo' ? 'active' : ''} 
                    onClick={() => setActiveComponent('seo')}
                >
                    SEO Tools
                </button>
            </nav>

            <div className="cms-content">
                {renderComponent()}
            </div>

            {posts.length > 0 && (
                <div className="posts-list">
                    <h2>Recent Posts</h2>
                    <ul>
                        {posts.map(post => (
                            <li key={post._id}>
                                <h3>{post.title}</h3>
                                <p>Status: {post.isDraft ? 'Draft' : 'Published'}</p>
                                <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CMS;
