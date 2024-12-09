// routes/cmsRoutes.js

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts (including drafts) - admin only
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new post
router.post('/', async (req, res) => {
    try {
        const { title, content, tags, category, seoMetadata, isDraft } = req.body;
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const post = new Post({
            title,
            content,
            tags: tags || [],
            category: category || 'Uncategorized',
            seoMetadata,
            isDraft,
            author: req.user._id,
            authorName: req.user.username || 'Anonymous',
            publishedAt: isDraft ? null : new Date()
        });

        const savedPost = await post.save();
        const populatedPost = await Post.findById(savedPost._id)
            .populate('author', 'username');
            
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({ 
            message: 'Failed to create post', 
            error: error.message 
        });
    }
});

// Update post
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, category, seoMetadata, isDraft } = req.body;
        
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update fields
        post.title = title;
        post.content = content;
        post.tags = tags || [];
        post.category = category || 'Uncategorized';
        post.seoMetadata = seoMetadata;
        post.isDraft = isDraft;
        
        // Set publishedAt if publishing for the first time
        if (!post.publishedAt && !isDraft) {
            post.publishedAt = new Date();
        }

        const updatedPost = await post.save();
        const populatedPost = await Post.findById(updatedPost._id)
            .populate('author', 'username');
            
        res.json(populatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(400).json({ 
            message: 'Failed to update post', 
            error: error.message 
        });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.remove();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ 
            message: 'Failed to delete post', 
            error: error.message 
        });
    }
});

module.exports = router;
