import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cmscompo.css';

const TagManager = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('/api/tags');
                setTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    const handleAddTag = async () => {
        try {
            const response = await axios.post('/api/tags', { name: newTag });
            setTags([...tags, response.data]);
            setNewTag('');
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    return (
        <div className="tag-manager">
            <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
            />
            <button onClick={handleAddTag}>Add Tag</button>
            <ul>
                {tags.map((tag) => (
                    <li key={tag._id}>{tag.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TagManager;
