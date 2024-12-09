// models/Comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Comment', commentSchema);
