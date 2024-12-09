// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ date: -1 }) // Sort by date, newest first
            .select('-__v'); // Exclude version key
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
});

// Create post route
router.post('/', async (req, res) => {
    try {
        const { title, content, tags, category, author, isDraft } = req.body;
        
        const post = new Post({
            title,
            content,
            tags,
            category,
            author,
            isDraft: isDraft || false,
            date: new Date()
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error });
    }
});

// Update post route - make sure author is preserved
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                tags,
                category,
                updatedAt: Date.now()
                // Note: We don't update author here to preserve original author
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post', error });
    }
});

module.exports = router;
