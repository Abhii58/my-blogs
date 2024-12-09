import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cmscompo.css';

const MediaManager = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchMediaFiles = async () => {
            try {
                const response = await axios.get('/api/media');
                setMediaFiles(response.data);
            } catch (error) {
                console.error('Error fetching media files:', error);
            }
        };
        fetchMediaFiles();
    }, []);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('/api/media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMediaFiles([...mediaFiles, response.data]);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="media-manager">
            <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept="image/*,video/*"
            />
            <button onClick={handleUpload}>Upload</button>
            <div className="media-list">
                {mediaFiles.map((file) => (
                    <div key={file._id} className="media-item">
                        {file.type.startsWith('image') ? (
                            <img src={file.url} alt={file.name} />
                        ) : (
                            <video src={file.url} controls />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaManager;
