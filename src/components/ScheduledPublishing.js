import React, { useState } from 'react';
import axios from 'axios';
import './schedual.css';

const ScheduledPublishing = () => {
    const [publishDate, setPublishDate] = useState('');

    const handleSchedule = async () => {
        try {
            const response = await axios.post('/api/schedule', { publishDate });
            console.log('Scheduled publishing:', response.data);
            setPublishDate('');
        } catch (error) {
            console.error('Error scheduling publishing:', error);
        }
    };

    return (
        <div className="scheduled-publishing">
            <input
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                placeholder="Schedule publishing date"
            />
            <button onClick={handleSchedule}>Schedule</button>
        </div>
    );
};

export default ScheduledPublishing;
