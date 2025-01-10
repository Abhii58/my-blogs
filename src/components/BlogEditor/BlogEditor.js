import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ScheduledPublishing from '../ScheduledPublishing';
import {jwtDecode} from 'jwt-decode';
import './BlogEditor.css';

// Register Blot for image embedding with drag-and-drop support
const BlockEmbed = Quill.import('blots/block/embed');
class DraggableImageBlot extends BlockEmbed {
    static create(value) {
        const node = super.create();
        const img = document.createElement('img');
        img.setAttribute('src', value.src);
        img.setAttribute('alt', value.alt || 'Image');
        img.setAttribute('class', 'draggable-image');
        node.appendChild(img);
        return node;
    }

    static value(node) {
        const img = node.querySelector('img');
        return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
        };
    }
}
DraggableImageBlot.blotName = 'draggableImage';
DraggableImageBlot.tagName = 'div';
Quill.register(DraggableImageBlot);

const BlogEditor = ({ post }) => {
    const [content, setContent] = useState(post ? post.content : '');
    const [title, setTitle] = useState(post ? post.title : '');
    const [tags, setTags] = useState(post ? post.tags.join(', ') : '');
    const [category, setCategory] = useState(post ? post.category : '');
    const [seoMetadata, setSeoMetadata] = useState(post ? post.seoMetadata : '');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const quillRef = useRef(null);

    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
        }
    }, []);

    const handleContentChange = (value) => {
        setContent(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                return;
            }

            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken); // Debug token contents

            const postData = {
                title,
                content,
                tags: tags.split(',').map(tag => tag.trim()),
                category,
                author: decodedToken.id || decodedToken._id, // Try both possible ID fields
                isDraft: true
            };

            console.log('Sending post data:', postData); // Debug outgoing data

            const response = await axios({
                method: 'POST',
                url: '/posts',
                data: postData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Server response:', response.data); // Debug response

            if (response.data) {
                setTitle('');
                setContent('');
                setTags('');
                setCategory('');
                setSeoMetadata('');
                setError('');
                setMessage('Post saved as draft successfully!');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error headers:', error.response?.headers);
            setError(error.response?.data?.message || 'Failed to create post');
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                return;
            }

            const decodedToken = jwtDecode(token);
            console.log('Token data:', decodedToken); // Debug log

            const postData = {
                title,
                content,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                category: category || 'Uncategorized',
                seoMetadata: seoMetadata || '',
                isDraft: false
            };

            console.log('Sending post data:', postData); // Debug log

            const response = await axios({
                method: 'POST',
                url: '/api/cms',
                data: postData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Server response:', response.data); // Debug log

            if (response.data) {
                setTitle('');
                setContent('');
                setTags('');
                setCategory('');
                setSeoMetadata('');
                setError('');
                setMessage('Post published successfully!');
            }
        } catch (error) {
            console.error('Error publishing post:', error);
            console.error('Error response:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to publish post');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="blog-editor">
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <form>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                    <ReactQuill
                        ref={quillRef}
                        value={content}
                        onChange={handleContentChange}
                        modules={BlogEditor.modules}
                        formats={BlogEditor.formats}
                        placeholder="Write your post here..."
                    />
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                    />
                    <input
                        type="text"
                        name="category"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                    />
                    <input
                        type="text"
                        name="seoMetadata"
                        id="seoMetadata"
                        value={seoMetadata}
                        onChange={(e) => setSeoMetadata(e.target.value)}
                        placeholder="SEO Metadata"
                    />
                    {error && <div className="error-message">{error}</div>}
                    <div className="button-group">
                        <button onClick={handleSubmit}>Save as Draft</button>
                        <button onClick={handlePublish}>Publish</button>
                        <ScheduledPublishing />
                    </div>
                </form>
            </div>
        </DndProvider>
    );
};

BlogEditor.modules = {
    toolbar: {
        container: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, 
            {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            ['clean']
        ],
        handlers: {
            image: function() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = () => {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const base64 = reader.result;
                        const range = this.quill.getSelection();
                        this.quill.insertEmbed(range.index, 'draggableImage', { src: base64, alt: 'Image' });

                        setTimeout(() => {
                            const img = this.quill.root.querySelector('img:last-child');
                            if (img) {
                                const width = prompt('Enter image width (px or %):', '100%');
                                const height = prompt('Enter image height (px or %):', 'auto');
                                img.setAttribute('width', width);
                                img.setAttribute('height', height);
                                img.className = 'draggable-image';
                            }
                        }, 0);
                    };
                };
            }
        }
    },
    clipboard: {
        matchVisual: false,
    }
};

BlogEditor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'draggableImage'
];

export default BlogEditor;
