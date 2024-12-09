import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PostCard from '../components/PostCard/PostCard';
import posts from '../data/posts.json';
import './pages.css';

const Blog = () => {
    return (
        <div className="blog">
            
            <main className="main-content">
                <h1>Blog</h1>
                <div className="posts">
                    {posts.map((post) => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Blog;
