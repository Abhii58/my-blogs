// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        default: 'Anonymous'
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    tags: [{
        type: String,
        trim: true
    }],
    seoMetadata: {
        type: String,
        default: ''
    },
    isDraft: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
