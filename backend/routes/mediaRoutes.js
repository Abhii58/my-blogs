const express = require('express');
const router = express.Router();
const Media = require('../models/Media'); // Assuming you have a Media model

// Get all media files
router.get('/', async (req, res) => {
    try {
        const mediaFiles = await Media.find();
        res.json(mediaFiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new media file
router.post('/', async (req, res) => {
    const media = new Media({
        url: req.body.url,
        type: req.body.type
    });

    try {
        const newMedia = await media.save();
        res.status(201).json(newMedia);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
