const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        default: 'Anonymous',
        trim: true
    },
    category: {
        type: String,
        default: 'Uncategorized',
        trim: true
    },
    tags: {
        type: [{
            type: String,
            trim: true
        }],
        default: [],
        validate: {
            validator: Array.isArray,
            message: 'Tags should be an array'
        }
    },
    seoMetadata: {
        type: String,
        default: '',
        trim: true
    },
    isDraft: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: [],
        validate: {
            validator: Array.isArray,
            message: 'Comments should be an array'
        }
    } 
}, {
    timestamps: true,
    versionKey: false 
});

module.exports = mongoose.model('Post', postSchema);

// Adding validation for arrays to ensure they are not null.
// Exporting the Post model so it can be used in other parts of the application.
