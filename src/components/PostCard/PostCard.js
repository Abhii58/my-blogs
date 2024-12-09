import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './PostCard.css';

const PostCard = ({ post }) => {
    if (!post) return null;

    console.log('Rendering post:', post); // Debugging log

    const formattedDate = post.date ? new Date(post.date).toLocaleDateString() : '';

    // Function to strip HTML tags and get plain text
    const getPlainTextExcerpt = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOMPurify.sanitize(html);
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        return plainText.substring(0, 150) + '...';
    };

    return (
        <div className="post-card">
            {post.image && (
                <img src={post.image} alt={post.title} className="post-image" />
            )}
            <div className="post-content">
                <h2 className="post-title">{post.title}</h2>
               {/* <p className="post-meta">
                    {post.author && <span>By {post.author}</span>}
                    {formattedDate && <span> • {formattedDate}</span>}
                </p> */} 
                <p className="post-excerpt">
                    {getPlainTextExcerpt(post.content)}
                </p>
                <Link to={`/post/${post._id}`} className="read-more">
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
