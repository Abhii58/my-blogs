import React, { useState } from 'react';
import './cmscompo.css';

const SEOTools = () => {
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');

    const handleSaveSEO = () => {
        // Logic to save SEO metadata
        console.log('SEO Metadata saved:', { metaDescription, keywords });
    };

    return (
        <div className="seo-tools">
            <input
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Meta Description"
            />
            <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Keywords (comma separated)"
            />
            <button onClick={handleSaveSEO}>Save SEO Metadata</button>
        </div>
    );
};

export default SEOTools;
