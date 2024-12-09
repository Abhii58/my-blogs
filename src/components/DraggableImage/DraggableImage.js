import React from 'react';
import { useDrag } from 'react-dnd';
import './DraggableImage.css'; // Import the CSS file

const DraggableImage = ({ src, alt }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'image',
        item: { type: 'image', src },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <img
            ref={drag}
            src={src}
            alt={alt}
            className={`draggable-image ${isDragging ? 'dragging' : ''}`} // Apply the dragging class
            style={{
                width: '100%', // Default to full width
                height: 'auto', // Maintain aspect ratio
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
        />
    );
};

export default DraggableImage;
