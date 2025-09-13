const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: {
        data: {
            type: Buffer
        },
        contentType: {
            type: String
        }
    }
}, { timestamps: true });

const Blog = mongoose.model("blog", BlogSchema);
module.exports = Blog;
