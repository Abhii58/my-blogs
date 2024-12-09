const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Add a comment to a post
router.post('/posts/:postId/comments', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.allowComments) {
            return res.status(403).json({ message: 'Comments are not allowed on this post' });
        }

        const newComment = {
            content: req.body.content,
            author: req.user._id,
            date: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        // Populate the author details before sending response
        const populatedPost = await Post.findById(post._id)
            .populate('comments.author', 'username');

        res.status(201).json(populatedPost.comments[populatedPost.comments.length - 1]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// Delete a comment
router.delete('/posts/:postId/comments/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is comment author or admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        comment.remove();
        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate('comments.author', 'username');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

module.exports = router;