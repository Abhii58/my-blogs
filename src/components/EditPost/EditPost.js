import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import axios from '../../axiosConfig';
import 'react-quill/dist/quill.snow.css';
import './EditPost.css';

const EditPost = ({ postId, onClose, onUpdate }) => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        tags: '',
        category: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/posts/${postId}`);
                const postData = response.data;
                setPost({
                    title: postData.title,
                    content: postData.content,
                    tags: postData.tags?.join(', ') || '',
                    category: postData.category || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch post');
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const handleChange = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value
        });
    };

    const handleContentChange = (content) => {
        setPost({
            ...post,
            content
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/posts/${postId}`, 
                {
                    ...post,
                    tags: post.tags.split(',').map(tag => tag.trim())
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                if (onUpdate) {
                    onUpdate(response.data);
                }
                onClose();
            }
        } catch (err) {
            console.error('Error updating post:', err);
            setError(err.response?.data?.message || 'Failed to update post');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="edit-post-overlay">
            <div className="edit-post-modal">
                <h2>Edit Post</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <ReactQuill
                            value={post.content}
                            onChange={handleContentChange}
                            modules={EditPost.modules}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tags (comma-separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={post.tags}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={post.category}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditPost.modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
    ],
};

export default EditPost; 